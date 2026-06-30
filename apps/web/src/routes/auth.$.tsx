import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute("/auth/$")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: getTitle("Autenticação"),
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="grid min-h-svh w-full place-items-center">
      <SignIn />
    </div>
  );
}
