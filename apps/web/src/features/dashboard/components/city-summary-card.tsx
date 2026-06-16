import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { CitySummaryTable } from "@/features/dashboard/components/city-summary-table";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import { getCitySummaryByOccurrence } from "@/features/dashboard/utils/city-summary";
import { showsSolicitadoInfo } from "@/features/dashboard/utils/dashboard-source";
import type { DashboardSource } from "@/features/dashboard/utils/dashboard-source";

function CitySummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cidades por ocorrência</CardTitle>
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

interface CitySummaryCardProps {
  source?: DashboardSource;
}

export function CitySummaryCard({
  source = "requestProtocol",
}: CitySummaryCardProps) {
  const { isLoading, projects, thresholds } = useDashboardData(source);

  if (isLoading || !projects || !thresholds) {
    return <CitySummaryCardSkeleton />;
  }

  const rows = getCitySummaryByOccurrence(projects, thresholds);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cidades por ocorrência</CardTitle>
        <CardDescription>
          Resumo de volumes e atrasos por cidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CitySummaryTable
          data={rows}
          showSolicitado={showsSolicitadoInfo(source)}
        />
      </CardContent>
    </Card>
  );
}
