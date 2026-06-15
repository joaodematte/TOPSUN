"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@topsun/ui/components/sidebar";
import * as React from "react";

import { NavMain } from "@/features/app-shell/components/nav-main";
import { NavUser } from "@/features/app-shell/components/nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <img
          src="https://cdn.topsun.dev/images/logo.png"
          alt="Logo"
          width={128}
          height={35}
          className="mx-auto"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
