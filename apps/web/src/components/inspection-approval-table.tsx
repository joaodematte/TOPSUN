import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { InspectionApprovalDataTable } from "@/components/inspection-approval-data-table";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import type { ProjectOnInspectionApproval } from "@/hooks/use-dashboard-data";
import { DASHBOARD_SOURCE_CONFIG } from "@/utils/dashboard-source";

export function InspectionApprovalTableSkeleton() {
  const config = DASHBOARD_SOURCE_CONFIG.inspectionApproval;

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

export function InspectionApprovalTable() {
  const { isLoading, projects, thresholds } =
    useDashboardData("inspectionApproval");
  const config = DASHBOARD_SOURCE_CONFIG.inspectionApproval;

  if (isLoading || !projects || !thresholds) {
    return <InspectionApprovalTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.tableTitle}</CardTitle>
        <CardDescription>{config.tableDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <InspectionApprovalDataTable
          data={projects as ProjectOnInspectionApproval}
          thresholds={thresholds}
        />
      </CardContent>
    </Card>
  );
}
