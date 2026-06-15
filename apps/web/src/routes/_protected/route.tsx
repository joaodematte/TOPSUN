import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@topsun/ui/components/sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { authStateFn } from "@/functions/auth-state";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    const { userId } = await authStateFn();

    if (!userId) {
      throw redirect({ href: import.meta.env.VITE_AUTH_URL });
    }

    return { userId };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          "--header-height": "calc(var(--spacing) * 18)",
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
