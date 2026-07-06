import type { VerifyApproveRequestAccessTimelineStep } from "@topsun/db/schema/postgres";

const CELESC_GRAPHQL_URL = "https://conecte.celesc.com.br/graphql";

const PROTOCOL_REGEX = /\d{10}/gu;

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

export async function getPortalPageInfo({
  accessId,
  accessToken,
  protocol,
}: GetPortalPageInfoParams): Promise<PortalPageInfoResponse> {
  const response = await fetch(CELESC_GRAPHQL_URL, {
    body: JSON.stringify({
      query: GET_PORTAL_PAGE_INFO_QUERY,
      variables: {
        channelCode: "ZAW",
        input: {
          accessId,
          protocol,
        },
        target: "sap",
      },
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      `Falha na consulta GraphQL CELESC: HTTP ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<PortalPageInfoResponse>;
}
