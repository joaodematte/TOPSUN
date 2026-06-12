import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start";
import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { AppRouter } from "@topsun/api/routers/index";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { useEffect } from "react";
import { Toaster } from "sonner";

import { setClerkAuthTokenGetter } from "@/lib/clerk";

import appCss from "@topsun/ui/globals.css?url";

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>;
  queryClient: QueryClient;
}

function ClerkApiAuthBridge() {
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkAuthTokenGetter(getToken);

    return () => {
      setClerkAuthTokenGetter(null);
    };
  }, [getToken]);

  return null;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootDocument,

  head: () => ({
    links: [
      {
        href: appCss,
        rel: "stylesheet",
      },
      {
        href: "https://cdn.topsun.dev/images/icon.svg",
        rel: "icon",
        type: "image/svg+xml",
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      {
        title: "My App",
      },
    ],
  }),
});

function RootDocument() {
  return (
    <html lang="pt-BR" className="light">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <ClerkApiAuthBridge />
          <Outlet />
          <Toaster position="top-right" theme="light" />
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}
