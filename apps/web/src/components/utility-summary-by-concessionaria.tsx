import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { UtilitySummaryDataTable } from "@/components/utility-summary-data-table";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import type { DashboardSource } from "@/utils/dashboard-source";
import { getUtilitySummaryByConcessionaria } from "@/utils/utility-summary";

export function UtilitySummaryByConcessionariaSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por concessionária</CardTitle>
        <CardDescription>Resumo de projetos por concessionária</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
      </CardContent>
    </Card>
  );
}

interface UtilitySummaryByConcessionariaProps {
  source?: DashboardSource;
}

export function UtilitySummaryByConcessionaria({
  source = "requestProtocol",
}: UtilitySummaryByConcessionariaProps) {
  const { isLoading, projects, thresholds } = useDashboardData(source);

  if (isLoading || !projects || !thresholds) {
    return <UtilitySummaryByConcessionariaSkeleton />;
  }

  const rows = getUtilitySummaryByConcessionaria(projects, thresholds);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por concessionária</CardTitle>
        <CardDescription>Resumo de projetos por concessionária</CardDescription>
      </CardHeader>
      <CardContent>
        <UtilitySummaryDataTable data={rows} />
      </CardContent>
    </Card>
  );
}
