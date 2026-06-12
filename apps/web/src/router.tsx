import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import type { AppRouter } from "@topsun/api/routers/index";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { getClerkAuthToken } from "@/lib/clerk";

import { TRPCProvider } from "./lib/trpc";
import { routeTree } from "./routeTree.gen";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });
}

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({ enabled: () => import.meta.env.DEV }),
    httpBatchLink({
      headers: async () => {
        const token = await getClerkAuthToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
      url: `${import.meta.env.VITE_SERVER_URL}/trpc`,
    }),
  ],
});

export function getRouter() {
  const queryClient = createQueryClient();
  const trpc = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient,
  });

  const router = createTanStackRouter({
    Wrap: ({ children }) => (
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    ),
    context: { queryClient, trpc },
    defaultNotFoundComponent: () => <div>Not Found</div>,
    defaultPreloadStaleTime: 0,
    routeTree,
    scrollRestoration: true,
  });

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
