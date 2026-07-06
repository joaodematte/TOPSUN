import type { RouterInputs } from "@topsun/api";

export type AutomationKind = RouterInputs["automation"]["getStatus"]["kind"];

export type AutomationUiLogLevel = "error" | "info" | "step" | "success";

export interface AutomationKindConfig {
  description: string;
  title: string;
}

export const AUTOMATION_KIND_CONFIG: Record<
  AutomationKind,
  AutomationKindConfig
> = {
  request_protocol: {
    description:
      "Controle a execução do robô que solicita protocolos na CELESC e atualiza o TOPSUN com os resultados.",
    title: "Automação de Solicitação de Protocolo",
  },
  validate_protocol_return: {
    description:
      "Controle a execução do robô que lê retornos de protocolo da CELESC e fecha etapas no TOPSUN.",
    title: "Automação de Retorno de Protocolo",
  },
  verify_approve_request_access: {
    description:
      "Controle a execução do robô que verifica e aprova solicitações de acesso na CELESC.",
    title: "Automação de Verificação de Solicitação de Acesso",
  },
};

export const AUTOMATION_DASHBOARD_ROUTE_BY_KIND: Record<
  AutomationKind,
  string
> = {
  request_protocol: "/automation/request-protocol",
  validate_protocol_return: "/automation/validate-protocol-return",
  verify_approve_request_access: "/automation/verify-approve-request-access",
};

export const AUTOMATION_REPORT_ROUTE_BY_KIND: Record<AutomationKind, string> = {
  request_protocol: "/automation/request-protocol/$automationId",
  validate_protocol_return:
    "/automation/validate-protocol-return/$automationId",
  verify_approve_request_access:
    "/automation/verify-approve-request-access/$automationId",
};
