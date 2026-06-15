import { IconTicket, IconZoom } from "@tabler/icons-react";

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
];
