import type { Context as HonoContext } from "hono";

import { clerkClient } from "../clerk/client";

export interface ClerkContextAuth {
  userId: string | null;
}

function toClerkContextAuth(
  auth: { userId: string | null } | null
): ClerkContextAuth | null {
  return auth ? { userId: auth.userId } : null;
}

async function authenticateClerkRequest(
  request: Request
): Promise<ClerkContextAuth | null> {
  const requestState = await clerkClient.authenticateRequest(request, {
    authorizedParties: [process.env.CORS_ORIGIN ?? ""],
  });
  return toClerkContextAuth(requestState.toAuth());
}

export interface CreateContextOptions {
  context: HonoContext;
}

export async function createContext({ context }: CreateContextOptions) {
  const clerkAuth = await authenticateClerkRequest(context.req.raw);

  return {
    auth: clerkAuth,
    session: null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
