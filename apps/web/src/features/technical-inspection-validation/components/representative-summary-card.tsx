import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import type { ProjectOnTechnicalInspectionValidation } from "@/features/dashboard/hooks/use-dashboard-data";
import { RepresentativeSummaryTable } from "@/features/technical-inspection-validation/components/representative-summary-table";
import { getRepresentativeSummaryByRepresentante } from "@/features/technical-inspection-validation/utils/representative-summary";

export function RepresentativeSummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por representante</CardTitle>
        <CardDescription>Resumo de projetos por representante</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
      </CardContent>
    </Card>
  );
}

export function RepresentativeSummaryCard() {
  const { isLoading, projects, thresholds } = useDashboardData(
    "technicalInspectionValidation"
  );

  if (isLoading || !projects || !thresholds) {
    return <RepresentativeSummaryCardSkeleton />;
  }

  const rows = getRepresentativeSummaryByRepresentante(
    projects as unknown as ProjectOnTechnicalInspectionValidation,
    thresholds
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por representante</CardTitle>
        <CardDescription>Resumo de projetos por representante</CardDescription>
      </CardHeader>
      <CardContent>
        <RepresentativeSummaryTable data={rows} />
      </CardContent>
    </Card>
  );
}
