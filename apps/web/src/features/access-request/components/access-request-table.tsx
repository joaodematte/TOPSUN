import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { AccessRequestDataTable } from "@/features/access-request/components/access-request-data-table";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import type { ProjectOnAccessRequest } from "@/features/dashboard/hooks/use-dashboard-data";
import { DASHBOARD_SOURCE_CONFIG } from "@/features/dashboard/utils/dashboard-source";

export function AccessRequestTableSkeleton() {
  const config = DASHBOARD_SOURCE_CONFIG.accessRequest;

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

export function AccessRequestTable() {
  const { isLoading, projects, thresholds } = useDashboardData("accessRequest");
  const config = DASHBOARD_SOURCE_CONFIG.accessRequest;

  if (isLoading || !projects || !thresholds) {
    return <AccessRequestTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.tableTitle}</CardTitle>
        <CardDescription>{config.tableDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <AccessRequestDataTable
          data={projects as ProjectOnAccessRequest}
          thresholds={thresholds}
        />
      </CardContent>
    </Card>
  );
}
