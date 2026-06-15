"use client";

import { Link, useLocation } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@topsun/ui/components/sidebar";

import { SIDEBAR_ITEMS } from "@/features/app-shell/config/navigation";
import type { FileRoutesByTo } from "@/routeTree.gen";

export function NavMain() {
  const { pathname } = useLocation();
  const isActive = (href: keyof FileRoutesByTo) => pathname === href;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActive(item.href)}
                tooltip={item.title}
                render={<Link to={item.href} preload="intent" />}
                className="font-medium"
              >
                {item.icon}
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
