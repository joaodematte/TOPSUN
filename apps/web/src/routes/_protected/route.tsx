import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@topsun/ui/components/sidebar";

import { AppSidebar } from "@/features/app-shell/components/app-sidebar";
import { SiteHeader } from "@/features/app-shell/components/site-header";
import { authStateFn } from "@/features/platform/auth/auth-state";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    const { userId } = await authStateFn();

    if (!userId) {
      throw redirect({ to: "/auth/$" });
    }

    return { userId };
  },
  component: RouteComponent,
  ssr: "data-only",
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
