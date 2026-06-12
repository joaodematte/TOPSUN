import { createFileRoute } from "@tanstack/react-router";

import { CitySummaryByOccurrence } from "@/components/city-summary-by-occurrence";
import { ProjectStatusCards } from "@/components/project-status-cards";
import { RequestProtocolTable } from "@/components/request-protocol-table";
import { UtilitySummaryByConcessionaria } from "@/components/utility-summary-by-concessionaria";
import { getTitle } from "@/utils/seo";

export const Route = createFileRoute("/_protected/")({
  component: HomeComponent,
  head: () => ({
    meta: [
      {
        title: getTitle("Solicitação de Protocolo"),
      },
    ],
  }),
});

function HomeComponent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ProjectStatusCards />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <UtilitySummaryByConcessionaria />

        <CitySummaryByOccurrence />
      </div>

      <RequestProtocolTable />
    </div>
  );
}
