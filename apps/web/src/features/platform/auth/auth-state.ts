import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";

export const authStateFn = createServerFn().handler(async () => {
  const { isAuthenticated, userId } = await auth();

  return { isAuthenticated, userId };
});
