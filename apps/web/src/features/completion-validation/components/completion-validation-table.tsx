import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { CompletionValidationDataTable } from "@/features/completion-validation/components/completion-validation-data-table";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import type { ProjectOnCompletionValidation } from "@/features/dashboard/hooks/use-dashboard-data";
import { DASHBOARD_SOURCE_CONFIG } from "@/features/dashboard/utils/dashboard-source";

export function CompletionValidationTableSkeleton() {
  const config = DASHBOARD_SOURCE_CONFIG.completionValidation;

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

export function CompletionValidationTable() {
  const { isLoading, projects, thresholds } = useDashboardData(
    "completionValidation"
  );
  const config = DASHBOARD_SOURCE_CONFIG.completionValidation;

  if (isLoading || !projects || !thresholds) {
    return <CompletionValidationTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.tableTitle}</CardTitle>
        <CardDescription>{config.tableDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <CompletionValidationDataTable
          data={projects as unknown as ProjectOnCompletionValidation}
          thresholds={thresholds}
        />
      </CardContent>
    </Card>
  );
}
