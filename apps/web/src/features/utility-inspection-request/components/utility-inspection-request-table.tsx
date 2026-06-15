import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import type { ProjectOnUtilityInspectionRequest } from "@/features/dashboard/hooks/use-dashboard-data";
import { DASHBOARD_SOURCE_CONFIG } from "@/features/dashboard/utils/dashboard-source";
import { UtilityInspectionRequestDataTable } from "@/features/utility-inspection-request/components/utility-inspection-request-data-table";

export function UtilityInspectionRequestTableSkeleton() {
  const config = DASHBOARD_SOURCE_CONFIG.utilityInspectionRequest;

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

export function UtilityInspectionRequestTable() {
  const { isLoading, projects, thresholds } = useDashboardData(
    "utilityInspectionRequest"
  );
  const config = DASHBOARD_SOURCE_CONFIG.utilityInspectionRequest;

  if (isLoading || !projects || !thresholds) {
    return <UtilityInspectionRequestTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.tableTitle}</CardTitle>
        <CardDescription>{config.tableDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <UtilityInspectionRequestDataTable
          data={projects as ProjectOnUtilityInspectionRequest}
          thresholds={thresholds}
        />
      </CardContent>
    </Card>
  );
}
