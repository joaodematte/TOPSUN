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
import { DASHBOARD_SOURCE_CONFIG } from "@/features/dashboard/utils/dashboard-source";
import { TechnicalInspectionValidationDataTable } from "@/features/technical-inspection-validation/components/technical-inspection-validation-data-table";

export function TechnicalInspectionValidationTableSkeleton() {
  const config = DASHBOARD_SOURCE_CONFIG.technicalInspectionValidation;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.tableTitle}</CardTitle>
        <CardDescription>{config.tableDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-180 w-full rounded-[min(var(--radius-4xl),24px)]" />
      </CardContent>
    </Card>
  );
}

export function TechnicalInspectionValidationTable() {
  const { isLoading, projects, thresholds } = useDashboardData(
    "technicalInspectionValidation"
  );
  const config = DASHBOARD_SOURCE_CONFIG.technicalInspectionValidation;

  if (isLoading || !projects || !thresholds) {
    return <TechnicalInspectionValidationTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.tableTitle}</CardTitle>
        <CardDescription>{config.tableDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <TechnicalInspectionValidationDataTable
          data={projects as unknown as ProjectOnTechnicalInspectionValidation}
          thresholds={thresholds}
        />
      </CardContent>
    </Card>
  );
}
