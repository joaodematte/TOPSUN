import {
  IconFileCertificate,
  IconKey,
  IconReportSearch,
  IconTicket,
  IconZoom,
} from "@tabler/icons-react";

import type { FileRoutesByTo } from "@/routeTree.gen";

interface SidebarItem {
  href: keyof FileRoutesByTo;
  icon: React.ReactNode;
  title: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    href: "/",
    icon: <IconTicket />,
    title: "Solicitação de protocolo",
  },
  {
    href: "/inspection-approval",
    icon: <IconZoom />,
    title: "Aprovação de vistoria (concessionária)",
  },
  {
    href: "/access-request",
    icon: <IconKey />,
    title: "Solicitação de acesso",
  },
  {
    href: "/art-access-requirement",
    icon: <IconFileCertificate />,
    title: "Emissão de ART e requerimento de acesso",
  },
  {
    href: "/utility-inspection-request",
    icon: <IconReportSearch />,
    title: "Solicitação de vistoria pela concessionária",
  },
];
