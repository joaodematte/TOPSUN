"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@topsun/ui/components/sidebar";

import { NavItem } from "@/features/app-shell/components/nav-item";
import { SIDEBAR_ITEMS } from "@/features/app-shell/config/navigation";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {SIDEBAR_ITEMS.map((item) => (
            <NavItem item={item} key={item.title} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
