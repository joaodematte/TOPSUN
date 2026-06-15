import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { UtilitySummaryTable } from "@/features/dashboard/components/utility-summary-table";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import type { DashboardSource } from "@/features/dashboard/utils/dashboard-source";
import { getUtilitySummaryByConcessionaria } from "@/features/dashboard/utils/utility-summary";

export function UtilitySummaryCardSkeleton() {
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

interface UtilitySummaryCardProps {
  source?: DashboardSource;
}

export function UtilitySummaryCard({
  source = "requestProtocol",
}: UtilitySummaryCardProps) {
  const { isLoading, projects, thresholds } = useDashboardData(source);

  if (isLoading || !projects || !thresholds) {
    return <UtilitySummaryCardSkeleton />;
  }

  const rows = getUtilitySummaryByConcessionaria(projects, thresholds);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por concessionária</CardTitle>
        <CardDescription>Resumo de projetos por concessionária</CardDescription>
      </CardHeader>
      <CardContent>
        <UtilitySummaryTable data={rows} />
      </CardContent>
    </Card>
  );
}
