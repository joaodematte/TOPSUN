import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { CitySummaryDataTable } from "@/components/city-summary-data-table";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { getCitySummaryByOccurrence } from "@/utils/city-summary";
import type { DashboardSource } from "@/utils/dashboard-source";

function CitySummaryByOccurrenceSkeleton() {
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

interface CitySummaryByOccurrenceProps {
  source?: DashboardSource;
}

export function CitySummaryByOccurrence({
  source = "requestProtocol",
}: CitySummaryByOccurrenceProps) {
  const { isLoading, projects, thresholds } = useDashboardData(source);

  if (isLoading || !projects || !thresholds) {
    return <CitySummaryByOccurrenceSkeleton />;
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
        <CitySummaryDataTable data={rows} />
      </CardContent>
    </Card>
  );
}
