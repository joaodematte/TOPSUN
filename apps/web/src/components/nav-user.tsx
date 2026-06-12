"use client";

import { useClerk } from "@clerk/tanstack-react-start";
import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@topsun/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@topsun/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@topsun/ui/components/sidebar";
import { Skeleton } from "@topsun/ui/components/skeleton";

function getUserInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function NavUser() {
  const { signOut, user } = useClerk();

  if (!user) {
    return <Skeleton className="h-12 w-[256px]" />;
  }

  const userName = `${user.firstName} ${user.lastName}`;
  const userEmail = user.emailAddresses[0].emailAddress;
  const userProfilePictureUrl = user.imageUrl ?? "";
  const userInitials = getUserInitials(
    user.firstName ?? "",
    user.lastName ?? ""
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar className="size-8 rounded-lg grayscale">
              <AvatarImage src={userProfilePictureUrl} alt={userName} />
              <AvatarFallback className="rounded-lg">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userName}</span>
              <span className="text-muted-foreground truncate text-xs">
                {userEmail}
              </span>
            </div>
            <IconDotsVertical className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side="top"
            align="center"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8">
                    <AvatarImage src={userProfilePictureUrl} alt={userName} />
                    <AvatarFallback className="rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-foreground grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{userName}</span>
                    <span className="truncate text-xs">{userEmail}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
