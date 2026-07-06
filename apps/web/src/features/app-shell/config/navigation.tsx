import type { Icon } from "@tabler/icons-react";
import { IconReportAnalytics, IconRobot } from "@tabler/icons-react";

import type { FileRoutesByTo } from "@/routeTree.gen";

type ValidRoute = keyof FileRoutesByTo;

interface SidebarItemBase {
  title: string;
  icon: Icon;
}

export interface SidebarItemWithHref extends SidebarItemBase {
  href: ValidRoute;
}

export interface SidebarItemWithItems extends SidebarItemBase {
  items: Omit<SidebarItemWithHref, "icon">[];
}

export type SidebarItem = SidebarItemWithHref | SidebarItemWithItems;

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    icon: IconRobot,
    items: [
      {
        href: "/automation/request-protocol",
        title: "Solicitação de protocolo",
      },
      {
        href: "/automation/validate-protocol-return",
        title: "Retorno de protocolo",
      },
      {
        href: "/automation/verify-approve-request-access",
        title: "Verificação de solicitação de acesso",
      },
    ],
    title: "Automações",
  },
  {
    icon: IconReportAnalytics,
    items: [
      {
        href: "/technical-inspection-validation",
        title: "Validação da vistoria técnica",
      },
      {
        href: "/art-access-requirement",
        title: "Emissão de ART e requerimento de acesso",
      },
      {
        href: "/",
        title: "Solicitação de protocolo",
      },
      {
        href: "/access-request",
        title: "Solicitação de acesso",
      },
      {
        href: "/installation-completion",
        title: "Conclusão da instalação",
      },
      {
        href: "/completion-validation",
        title: "Validação da conclusão",
      },
      {
        href: "/utility-inspection-request",
        title: "Solicitação de vistoria (concessionária)",
      },
      {
        href: "/inspection-approval",
        title: "Aprovação de vistoria (concessionária)",
      },
    ],
    title: "Resumos",
  },
];
