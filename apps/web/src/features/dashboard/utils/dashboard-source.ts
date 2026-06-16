export type DashboardSource =
  | "requestProtocol"
  | "inspectionApproval"
  | "accessRequest"
  | "artAccessRequirement"
  | "utilityInspectionRequest"
  | "installationCompletion"
  | "completionValidation"
  | "technicalInspectionValidation";

export const DASHBOARD_SOURCES_WITHOUT_SOLICITADO = [
  "installationCompletion",
  "completionValidation",
  "technicalInspectionValidation",
] as const satisfies readonly DashboardSource[];

export function showsSolicitadoInfo(source: DashboardSource): boolean {
  return !DASHBOARD_SOURCES_WITHOUT_SOLICITADO.includes(
    source as (typeof DASHBOARD_SOURCES_WITHOUT_SOLICITADO)[number]
  );
}

export const DASHBOARD_SOURCES_WITH_REAL_SOLICITADO = [
  "utilityInspectionRequest",
] as const satisfies readonly DashboardSource[];

export function usesRealSolicitadoData(source: DashboardSource): boolean {
  return DASHBOARD_SOURCES_WITH_REAL_SOLICITADO.includes(
    source as (typeof DASHBOARD_SOURCES_WITH_REAL_SOLICITADO)[number]
  );
}

export const DASHBOARD_SOURCE_CONFIG = {
  accessRequest: {
    statusCardDescription:
      "Resumo de projetos em andamento na etapa de solicitação de acesso",
    statusCardTitle: 'Resumo de projetos na etapa "Solicitação de acesso"',
    tableDescription: "Projetos aguardando solicitação de acesso",
    tableTitle: "Listagem de projetos (solicitação de acesso)",
  },
  artAccessRequirement: {
    statusCardDescription:
      "Resumo de projetos em andamento na etapa de emissão de ART e requerimento de acesso",
    statusCardTitle:
      'Resumo de projetos na etapa "Emissão de ART e requerimento de acesso"',
    tableDescription:
      "Projetos aguardando emissão de ART e requerimento de acesso",
    tableTitle:
      "Listagem de projetos (emissão de ART e requerimento de acesso)",
  },
  completionValidation: {
    statusCardDescription:
      "Resumo de projetos em andamento na etapa de validação da conclusão",
    statusCardTitle: 'Resumo de projetos na etapa "Validação da conclusão"',
    tableDescription: "Projetos aguardando validação da conclusão",
    tableTitle: "Listagem de projetos (validação da conclusão)",
  },
  inspectionApproval: {
    statusCardDescription:
      "Resumo de projetos em andamento na etapa de aprovação de vistoria pela concessionária",
    statusCardTitle:
      'Resumo de projetos na etapa "Aprovação de vistoria (concessionária)"',
    tableDescription: "Projetos em aprovação de vistoria pela concessionária",
    tableTitle:
      "Listagem de projetos (aguardando aprovação de vistoria pela concessionária)",
  },
  installationCompletion: {
    statusCardDescription:
      "Resumo de projetos em andamento na etapa de conclusão da instalação",
    statusCardTitle: 'Resumo de projetos na etapa "Conclusão da instalação"',
    tableDescription: "Projetos aguardando conclusão da instalação",
    tableTitle: "Listagem de projetos (conclusão da instalação)",
  },
  requestProtocol: {
    statusCardDescription:
      "Resumo de projetos em andamento na etapa de solicitação de protocolo",
    statusCardTitle: 'Resumo de projetos na etapa "Solicitação de protocolo"',
    tableDescription: "Projetos que ainda não solicitaram protocolo",
    tableTitle: "Listagem de projetos (sem protocolo solicitado)",
  },
  technicalInspectionValidation: {
    statusCardDescription:
      "Resumo de projetos em andamento na etapa de validação da vistoria técnica",
    statusCardTitle:
      'Resumo de projetos na etapa "Validação da vistoria técnica"',
    tableDescription: "Projetos aguardando validação da vistoria técnica",
    tableTitle: "Listagem de projetos (validação da vistoria técnica)",
  },
  utilityInspectionRequest: {
    statusCardDescription:
      "Resumo de projetos em andamento na etapa de solicitação de vistoria pela concessionária",
    statusCardTitle:
      'Resumo de projetos na etapa "Solicitação de vistoria pela concessionária"',
    tableDescription:
      "Projetos aguardando solicitação de vistoria pela concessionária",
    tableTitle:
      "Listagem de projetos (solicitação de vistoria pela concessionária)",
  },
} as const satisfies Record<
  DashboardSource,
  {
    statusCardDescription: string;
    statusCardTitle: string;
    tableDescription: string;
    tableTitle: string;
  }
>;
