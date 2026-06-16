import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import type {
  ProjectOnCompletionValidation,
  ProjectOnInstallationCompletion,
} from "@/features/dashboard/hooks/use-dashboard-data";
import type { DashboardSource } from "@/features/dashboard/utils/dashboard-source";
import { InstallerSummaryTable } from "@/features/installation-completion/components/installer-summary-table";
import { getInstallerSummaryByInstalador } from "@/features/installation-completion/utils/installer-summary";

export function InstallerSummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por instalador</CardTitle>
        <CardDescription>Resumo de projetos por instalador</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-72.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
      </CardContent>
    </Card>
  );
}

type InstallerSummarySource = Extract<
  DashboardSource,
  "installationCompletion" | "completionValidation"
>;

type ProjectWithInstaller =
  | ProjectOnInstallationCompletion[number]
  | ProjectOnCompletionValidation[number];

interface InstallerSummaryCardProps {
  source?: InstallerSummarySource;
}

export function InstallerSummaryCard({
  source = "installationCompletion",
}: InstallerSummaryCardProps) {
  const { isLoading, projects, thresholds } = useDashboardData(source);

  if (isLoading || !projects || !thresholds) {
    return <InstallerSummaryCardSkeleton />;
  }

  const rows = getInstallerSummaryByInstalador(
    projects as unknown as ProjectWithInstaller[],
    thresholds
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por instalador</CardTitle>
        <CardDescription>Resumo de projetos por instalador</CardDescription>
      </CardHeader>
      <CardContent>
        <InstallerSummaryTable data={rows} />
      </CardContent>
    </Card>
  );
}
