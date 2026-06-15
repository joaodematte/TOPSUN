import { SidebarTrigger } from "@topsun/ui/components/sidebar";

export function SiteHeader() {
  return (
    <header className="bg-muted flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:hidden">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <img
          src="https://cdn.topsun.dev/images/logo.png"
          alt="Logo"
          width={128}
          height={35}
        />
        <SidebarTrigger className="-ml-1" />
      </div>
    </header>
  );
}
