import type { DashboardSource } from "@/features/dashboard/utils/dashboard-source";
import type { FileRoutesByTo } from "@/routeTree.gen";

type ReportRoute = keyof FileRoutesByTo;

export interface HomepageStageSource {
  href: ReportRoute;
  shortTitle: string;
  source: DashboardSource;
}

export const HOMEPAGE_STAGE_SOURCES = [
  {
    href: "/request-protocol",
    shortTitle: "Solicitação de protocolo",
    source: "requestProtocol",
  },
  {
    href: "/technical-inspection-validation",
    shortTitle: "Validação da vistoria técnica",
    source: "technicalInspectionValidation",
  },
  {
    href: "/art-access-requirement",
    shortTitle: "Emissão de ART e requerimento de acesso",
    source: "artAccessRequirement",
  },
  {
    href: "/access-request",
    shortTitle: "Solicitação de acesso",
    source: "accessRequest",
  },
  {
    href: "/installation-completion",
    shortTitle: "Conclusão da instalação",
    source: "installationCompletion",
  },
  {
    href: "/completion-validation",
    shortTitle: "Validação da conclusão",
    source: "completionValidation",
  },
  {
    href: "/utility-inspection-request",
    shortTitle: "Solicitação de vistoria (concessionária)",
    source: "utilityInspectionRequest",
  },
  {
    href: "/inspection-approval",
    shortTitle: "Aprovação de vistoria (concessionária)",
    source: "inspectionApproval",
  },
] as const satisfies readonly HomepageStageSource[];

export const AUTOMATION_KINDS = [
  "request_protocol",
  "validate_protocol_return",
  "verify_approve_request_access",
  "verify_inspection_request",
] as const;
