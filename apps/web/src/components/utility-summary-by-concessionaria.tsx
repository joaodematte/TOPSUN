import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { UtilitySummaryDataTable } from "@/components/utility-summary-data-table";
import { useTRPC } from "@/lib/trpc";
import { getUtilitySummaryByConcessionaria } from "@/utils/utility-summary";

export function UtilitySummaryByConcessionariaSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por Concessionária</CardTitle>
        <CardDescription>Resumo de projetos por concessionária</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
      </CardContent>
    </Card>
  );
}

export function UtilitySummaryByConcessionaria() {
  const trpc = useTRPC();

  const { data: projects, isLoading: isLoadingProjects } = useQuery(
    trpc.requestProtocol.getProjects.queryOptions()
  );

  const { data: thresholds, isLoading: isLoadingThresholds } = useQuery(
    trpc.requestProtocol.getStatusThresholds.queryOptions()
  );

  if (isLoadingProjects || isLoadingThresholds || !projects || !thresholds) {
    return <UtilitySummaryByConcessionariaSkeleton />;
  }

  const rows = getUtilitySummaryByConcessionaria(projects, thresholds);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por Concessionária</CardTitle>
        <CardDescription>Resumo de projetos por concessionária</CardDescription>
      </CardHeader>
      <CardContent>
        <UtilitySummaryDataTable data={rows} />
      </CardContent>
    </Card>
  );
}
