import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { CitySummaryDataTable } from "@/components/city-summary-data-table";
import { useTRPC } from "@/lib/trpc";
import { getCitySummaryByOccurrence } from "@/utils/city-summary";

function CitySummaryByOccurrenceSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cidades por Ocorrência</CardTitle>
        <CardDescription>
          Resumo de volumes e atrasos por cidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
      </CardContent>
    </Card>
  );
}

export function CitySummaryByOccurrence() {
  const trpc = useTRPC();

  const { data: projects, isLoading: isLoadingProjects } = useQuery(
    trpc.requestProtocol.getProjects.queryOptions()
  );

  const { data: thresholds, isLoading: isLoadingThresholds } = useQuery(
    trpc.requestProtocol.getStatusThresholds.queryOptions()
  );

  if (isLoadingProjects || isLoadingThresholds || !projects || !thresholds) {
    return <CitySummaryByOccurrenceSkeleton />;
  }

  const rows = getCitySummaryByOccurrence(projects, thresholds);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cidades por Ocorrência</CardTitle>
        <CardDescription>
          Resumo de volumes e atrasos por cidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CitySummaryDataTable data={rows} />
      </CardContent>
    </Card>
  );
}
