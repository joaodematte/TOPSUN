import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { ArtAccessRequirementDataTable } from "@/features/art-access-requirement/components/art-access-requirement-data-table";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import type { ProjectOnArtAccessRequirement } from "@/features/dashboard/hooks/use-dashboard-data";
import { DASHBOARD_SOURCE_CONFIG } from "@/features/dashboard/utils/dashboard-source";

export function ArtAccessRequirementTableSkeleton() {
  const config = DASHBOARD_SOURCE_CONFIG.artAccessRequirement;

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

export function ArtAccessRequirementTable() {
  const { isLoading, projects, thresholds } = useDashboardData(
    "artAccessRequirement"
  );
  const config = DASHBOARD_SOURCE_CONFIG.artAccessRequirement;

  if (isLoading || !projects || !thresholds) {
    return <ArtAccessRequirementTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.tableTitle}</CardTitle>
        <CardDescription>{config.tableDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ArtAccessRequirementDataTable
          data={projects as ProjectOnArtAccessRequirement}
          thresholds={thresholds}
        />
      </CardContent>
    </Card>
  );
}
