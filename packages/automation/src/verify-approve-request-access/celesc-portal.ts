import type { VerifyApproveRequestAccessTimelineStep } from "@topsun/db/schema/postgres";

import { scheduleCelescRequest, sleep } from "./celesc-rate-limit";

const CELESC_GRAPHQL_URL = "https://conecte.celesc.com.br/graphql";

const PROTOCOL_REGEX = /\d{10}/gu;
const MAX_PORTAL_PAGE_INFO_ATTEMPTS = 4;
const BASE_RATE_LIMIT_BACKOFF_MS = 2000;
const RATE_LIMIT_JITTER_MAX_MS = 500;

const GET_PORTAL_PAGE_INFO_QUERY = `query ($input: TecPortalPageInfoInputModel!) {
  getPortalPageInfo(input: $input) {
    clientName
    clientMobilePhone
    clientTelephone
    clientPersonalDocument
    clientEmail
    protocolName
    protocolNumber
    protocolAddress
    availableServices {
      serviceName
      serviceId
      serviceCode
      protocol
      enabled
      __typename
    }
    servicesTimeline {
      protocol
      serviceName
      serviceCode
      serviceClosed
      stepNumber
      stepDescription
      stepStatus
      stepMessage
      link
      stepStatusDate
      rejectionReasons
      canCorrect
      id
      __typename
    }
    __typename
  }
}`;

interface PortalTimelineItem {
  canCorrect: boolean;
  id: string;
  link: string;
  protocol: string;
  rejectionReasons: string;
  serviceClosed: boolean;
  serviceCode: string;
  serviceName: string;
  stepDescription: string;
  stepMessage: string;
  stepNumber: number;
  stepStatus: string;
  stepStatusDate: string;
}

export interface PortalPageInfoResponse {
  data?: {
    getPortalPageInfo?: {
      availableServices?: unknown[];
      clientEmail?: string;
      clientMobilePhone?: string;
      clientName?: string;
      clientPersonalDocument?: string;
      clientTelephone?: string;
      protocolAddress?: string;
      protocolName?: string;
      protocolNumber?: string;
      servicesTimeline?: PortalTimelineItem[];
    };
  };
}

export function extractLastProtocolNumber(
  protocolField: string | null
): string | null {
  if (!protocolField) {
    return null;
  }

  const matches = [...protocolField.matchAll(PROTOCOL_REGEX)];

  if (matches.length === 0) {
    return null;
  }

  const lastMatch = matches.at(-1);

  return lastMatch?.[0] ?? null;
}

export function parsePortalTimelineSteps(
  response: PortalPageInfoResponse
): VerifyApproveRequestAccessTimelineStep[] {
  const timeline = response.data?.getPortalPageInfo?.servicesTimeline ?? [];

  return timeline
    .map((step) => ({
      rejectionReasons: step.rejectionReasons,
      serviceClosed: step.serviceClosed,
      stepDescription: step.stepDescription,
      stepMessage: step.stepMessage,
      stepNumber: step.stepNumber,
      stepStatus: step.stepStatus,
      stepStatusDate: step.stepStatusDate,
    }))
    .toSorted(
      (currentStep, nextStep) => currentStep.stepNumber - nextStep.stepNumber
    );
}

interface GetPortalPageInfoParams {
  accessId: string;
  accessToken: string;
  protocol: string;
}

interface CelescRateLimitErrorBody {
  error?: string;
  message?: string;
  retry_after_seconds?: number;
}

function parseRetryAfterMs(retryAfter: string | null): number | null {
  if (!retryAfter) {
    return null;
  }

  const seconds = Number(retryAfter);

  if (Number.isFinite(seconds)) {
    return seconds * 1000;
  }

  const retryDate = Date.parse(retryAfter);

  if (!Number.isNaN(retryDate)) {
    return Math.max(0, retryDate - Date.now());
  }

  return null;
}

function getExponentialBackoffMs(attempt: number): number {
  return (
    BASE_RATE_LIMIT_BACKOFF_MS * 2 ** (attempt - 1) +
    Math.random() * RATE_LIMIT_JITTER_MAX_MS
  );
}

async function getRateLimitBackoffMsFromResponse(
  response: Response,
  attempt: number
): Promise<number> {
  const retryAfterHeaderMs = parseRetryAfterMs(
    response.headers.get("Retry-After")
  );

  if (retryAfterHeaderMs !== null) {
    return retryAfterHeaderMs;
  }

  try {
    const body = (await response.json()) as CelescRateLimitErrorBody;

    if (
      typeof body.retry_after_seconds === "number" &&
      Number.isFinite(body.retry_after_seconds) &&
      body.retry_after_seconds > 0
    ) {
      return body.retry_after_seconds * 1000;
    }
  } catch {
    // Resposta 429 sem JSON válido; usa backoff exponencial.
  }

  return getExponentialBackoffMs(attempt);
}

async function readRateLimitDetails(
  response: Response
): Promise<{ message: string | null; retryAfterSeconds: number | null }> {
  const retryAfterHeaderMs = parseRetryAfterMs(
    response.headers.get("Retry-After")
  );
  let retryAfterSeconds: number | null = null;

  if (retryAfterHeaderMs !== null) {
    retryAfterSeconds = Math.ceil(retryAfterHeaderMs / 1000);
  }

  try {
    const body = (await response.json()) as CelescRateLimitErrorBody;

    if (
      retryAfterSeconds === null &&
      typeof body.retry_after_seconds === "number" &&
      Number.isFinite(body.retry_after_seconds) &&
      body.retry_after_seconds > 0
    ) {
      retryAfterSeconds = body.retry_after_seconds;
    }

    return {
      message: body.message ?? null,
      retryAfterSeconds,
    };
  } catch {
    return {
      message: null,
      retryAfterSeconds,
    };
  }
}

function formatRateLimitErrorMessage(
  attempts: number,
  retryAfterSeconds: number | null,
  message: string | null
): string {
  const retryHint =
    retryAfterSeconds === null
      ? ""
      : `, aguarde ${retryAfterSeconds}s antes de tentar novamente`;

  const apiMessage = message ? `: ${message}` : "";

  return `Falha na consulta GraphQL CELESC: HTTP 429 após ${attempts} tentativa(s) (rate limit${retryHint})${apiMessage}`;
}

async function fetchPortalPageInfoWithRetry(
  params: GetPortalPageInfoParams
): Promise<PortalPageInfoResponse> {
  /* oxlint-disable no-await-in-loop -- retry sequencial com backoff em rate limit */
  for (
    let attempt = 1;
    attempt <= MAX_PORTAL_PAGE_INFO_ATTEMPTS;
    attempt += 1
  ) {
    const response = await fetch(CELESC_GRAPHQL_URL, {
      body: JSON.stringify({
        query: GET_PORTAL_PAGE_INFO_QUERY,
        variables: {
          channelCode: "ZAW",
          input: {
            accessId: params.accessId,
            protocol: params.protocol,
          },
          target: "sap",
        },
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${params.accessToken}`,
      },
      method: "POST",
    });

    if (response.status === 429) {
      const rateLimitDetails = await readRateLimitDetails(response);

      if (attempt === MAX_PORTAL_PAGE_INFO_ATTEMPTS) {
        throw new Error(
          formatRateLimitErrorMessage(
            MAX_PORTAL_PAGE_INFO_ATTEMPTS,
            rateLimitDetails.retryAfterSeconds,
            rateLimitDetails.message
          )
        );
      }

      const backoffMs = await getRateLimitBackoffMsFromResponse(
        response,
        attempt
      );
      await sleep(backoffMs);
      continue;
    }

    if (!response.ok) {
      throw new Error(
        `Falha na consulta GraphQL CELESC: HTTP ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<PortalPageInfoResponse>;
  }
  /* oxlint-enable no-await-in-loop */

  throw new Error(
    formatRateLimitErrorMessage(MAX_PORTAL_PAGE_INFO_ATTEMPTS, null, null)
  );
}

export function getPortalPageInfo(
  params: GetPortalPageInfoParams
): Promise<PortalPageInfoResponse> {
  return scheduleCelescRequest(() => fetchPortalPageInfoWithRetry(params));
}
