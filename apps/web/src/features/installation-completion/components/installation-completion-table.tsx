import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import type { ProjectOnInstallationCompletion } from "@/features/dashboard/hooks/use-dashboard-data";
import { DASHBOARD_SOURCE_CONFIG } from "@/features/dashboard/utils/dashboard-source";
import { InstallationCompletionDataTable } from "@/features/installation-completion/components/installation-completion-data-table";

export function InstallationCompletionTableSkeleton() {
  const config = DASHBOARD_SOURCE_CONFIG.installationCompletion;

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

export function InstallationCompletionTable() {
  const { isLoading, projects, thresholds } = useDashboardData(
    "installationCompletion"
  );
  const config = DASHBOARD_SOURCE_CONFIG.installationCompletion;

  if (isLoading || !projects || !thresholds) {
    return <InstallationCompletionTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.tableTitle}</CardTitle>
        <CardDescription>{config.tableDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <InstallationCompletionDataTable
          data={projects as unknown as ProjectOnInstallationCompletion}
          thresholds={thresholds}
        />
      </CardContent>
    </Card>
  );
}
