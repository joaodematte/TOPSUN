"use client";

import { IconChevronRight } from "@tabler/icons-react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@topsun/ui/components/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@topsun/ui/components/sidebar";
import { useState } from "react";

import type {
  SidebarItem,
  SidebarItemWithHref,
  SidebarItemWithItems,
} from "@/features/app-shell/config/navigation";

interface NavItemProps {
  item: SidebarItem;
}

interface CollapsibleNavItemProps {
  item: SidebarItemWithItems;
}

interface SimpleNavItemProps {
  item: SidebarItemWithHref;
}

function CollapsibleNavItem({ item }: CollapsibleNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const matchRoute = useMatchRoute();

  const hasActiveSubItem = item.items.some((subItem) =>
    Boolean(matchRoute({ fuzzy: true, to: subItem.href }))
  );

  const isCollapsibleOpen = hasActiveSubItem || isOpen;

  return (
    <Collapsible
      className="group/collapsible"
      onOpenChange={(open) => {
        if (!hasActiveSubItem) {
          setIsOpen(open);
        }
      }}
      open={isCollapsibleOpen}
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} />}>
        <item.icon />
        <span className="font-medium">{item.title}</span>
        <IconChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items.map((subItem) => {
            const isActive = !!matchRoute({
              fuzzy: true,
              to: subItem.href,
            });

            return (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  isActive={isActive}
                  render={<Link preload="intent" to={subItem.href} />}
                >
                  <span className="font-medium">{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

function SimpleNavItem({ item }: SimpleNavItemProps) {
  const matchRoute = useMatchRoute();
  const isActive = !!matchRoute({ to: item.href });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        render={<Link preload="intent" to={item.href} />}
        tooltip={item.title}
      >
        <item.icon />
        <span className="font-medium">{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function NavItem({ item }: NavItemProps) {
  if ("items" in item) {
    return <CollapsibleNavItem item={item} />;
  }

  return <SimpleNavItem item={item} />;
}
