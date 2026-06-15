export type DashboardSource =
  | "requestProtocol"
  | "inspectionApproval"
  | "accessRequest";

export const DASHBOARD_SOURCE_CONFIG = {
  accessRequest: {
    statusCardDescription:
      "Resumo de projetos em andamento na etapa de solicitação de acesso",
    statusCardTitle: 'Resumo de projetos na etapa "Solicitação de acesso"',
    tableDescription: "Projetos aguardando solicitação de acesso",
    tableTitle: "Listagem de projetos (solicitação de acesso)",
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
  requestProtocol: {
    statusCardDescription:
      "Resumo de projetos em andamento na etapa de solicitação de protocolo",
    statusCardTitle: 'Resumo de projetos na etapa "Solicitação de protocolo"',
    tableDescription: "Projetos que ainda não solicitaram protocolo",
    tableTitle: "Listagem de projetos (sem protocolo solicitado)",
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
