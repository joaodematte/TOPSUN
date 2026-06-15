import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconClockExclamation,
  IconFlameFilled,
  IconFoldersFilled,
  IconSendFilled,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";
import { cn } from "@topsun/ui/lib/utils";
import type { ComponentType } from "react";

import { ProjectStatusProjectsDialog } from "@/features/dashboard/components/project-status-projects-dialog";
import { StatusThresholdsDialogButton } from "@/features/dashboard/components/status-thresholds-dialog-button";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import type {
  ProjectOnAccessRequest,
  ProjectOnInspectionApproval,
  ProjectOnRequestProtocol,
} from "@/features/dashboard/hooks/use-dashboard-data";
import { useProjectStatusDialogStore } from "@/features/dashboard/stores/project-status-dialog-store";
import { DASHBOARD_SOURCE_CONFIG } from "@/features/dashboard/utils/dashboard-source";
import type { DashboardSource } from "@/features/dashboard/utils/dashboard-source";
import {
  getProjectStatusStats,
  PROJECT_STATUS_CLASSNAME,
  PROJECT_STATUS_FILTER_LABEL,
} from "@/features/dashboard/utils/project-status";
import type { ProjectStatusThresholds } from "@/features/dashboard/utils/project-status";

interface StatusCardConfig {
  count: number | string;
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
  label: string;
  onOpen: () => void;
  percentage?: number | string;
}

const REQUESTED_MOCK = {
  count: "--",
  percentage: "--",
};

interface ProjectStatusCardsSkeletonProps {
  source: DashboardSource;
}

export function ProjectStatusCardsSkeleton({
  source,
}: ProjectStatusCardsSkeletonProps) {
  const config = DASHBOARD_SOURCE_CONFIG[source];

  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <CardTitle>{config.statusCardTitle}</CardTitle>
          <CardDescription>{config.statusCardDescription}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <Skeleton className="h-28.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
        <Skeleton className="h-28.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
        <Skeleton className="h-28.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
        <Skeleton className="h-28.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
        <Skeleton className="h-28.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
        <Skeleton className="h-28.5 w-full rounded-[min(var(--radius-4xl),24px)]" />
      </CardContent>
    </Card>
  );
}

function StatusCard({
  count,
  icon: Icon,
  iconClassName,
  label,
  onOpen,
  percentage,
}: StatusCardConfig) {
  const isInteractive = count !== "--" && Number(count) > 0;
  return (
    <button
      className={cn(
        "bg-card hover:bg-muted focus-visible:border-ring focus-visible:ring-ring/30 flex flex-col gap-3 rounded-[min(var(--radius-4xl),24px)] border p-4 transition-all duration-150 outline-none focus-visible:ring-3",
        !isInteractive && "cursor-not-allowed"
      )}
      onClick={onOpen}
      type="button"
      disabled={!isInteractive}
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            iconClassName
          )}
        >
          <Icon className="size-4" />
        </span>
        <p className="text-muted-foreground truncate text-sm font-medium">
          {label}
        </p>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {count}
        </p>
        {percentage === undefined ? null : (
          <p className="text-muted-foreground ml-auto text-sm tabular-nums">
            {percentage}%
          </p>
        )}
      </div>
    </button>
  );
}

interface ProjectStatusCardsProps {
  source?: DashboardSource;
}

function ProjectStatusProjectsDialogBySource({
  projects,
  source,
  thresholds,
}: {
  projects:
    | ProjectOnAccessRequest
    | ProjectOnInspectionApproval
    | ProjectOnRequestProtocol;
  source: DashboardSource;
  thresholds: ProjectStatusThresholds;
}) {
  if (source === "inspectionApproval") {
    return (
      <ProjectStatusProjectsDialog
        projects={projects as ProjectOnInspectionApproval}
        source="inspectionApproval"
        thresholds={thresholds}
      />
    );
  }

  if (source === "accessRequest") {
    return (
      <ProjectStatusProjectsDialog
        projects={projects as ProjectOnAccessRequest}
        source="accessRequest"
        thresholds={thresholds}
      />
    );
  }

  return (
    <ProjectStatusProjectsDialog
      projects={projects as ProjectOnRequestProtocol}
      thresholds={thresholds}
    />
  );
}

export function ProjectStatusCards({
  source = "requestProtocol",
}: ProjectStatusCardsProps) {
  const openDialog = useProjectStatusDialogStore((state) => state.openDialog);
  const { isLoading, projects, thresholds } = useDashboardData(source);
  const config = DASHBOARD_SOURCE_CONFIG[source];

  if (isLoading || !projects || !thresholds) {
    return <ProjectStatusCardsSkeleton source={source} />;
  }

  const stats = getProjectStatusStats(projects, thresholds);

  const statusCards: StatusCardConfig[] = [
    {
      count: stats.total,
      icon: IconFoldersFilled,
      iconClassName: "bg-muted text-muted-foreground",
      label: PROJECT_STATUS_FILTER_LABEL.total,
      onOpen: () => openDialog("total"),
    },
    {
      count: stats.onTime,
      icon: IconCircleCheckFilled,
      iconClassName: PROJECT_STATUS_CLASSNAME.onTime,
      label: PROJECT_STATUS_FILTER_LABEL.onTime,
      onOpen: () => openDialog("onTime"),
      percentage: stats.onTimePercentage,
    },
    {
      count: stats.attention,
      icon: IconAlertTriangleFilled,
      iconClassName: PROJECT_STATUS_CLASSNAME.attention,
      label: PROJECT_STATUS_FILTER_LABEL.attention,
      onOpen: () => openDialog("attention"),
      percentage: stats.attentionPercentage,
    },
    {
      count: stats.critical,
      icon: IconFlameFilled,
      iconClassName: PROJECT_STATUS_CLASSNAME.critical,
      label: PROJECT_STATUS_FILTER_LABEL.critical,
      onOpen: () => openDialog("critical"),
      percentage: stats.criticalPercentage,
    },
    {
      count: stats.overdue,
      icon: IconClockExclamation,
      iconClassName: PROJECT_STATUS_CLASSNAME.overdue,
      label: PROJECT_STATUS_FILTER_LABEL.overdue,
      onOpen: () => openDialog("overdue"),
      percentage: stats.overduePercentage,
    },
    {
      count: REQUESTED_MOCK.count,
      icon: IconSendFilled,
      iconClassName: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      label: "Solicitados",
      onOpen: () => null,
      percentage: REQUESTED_MOCK.percentage,
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <CardTitle>{config.statusCardTitle}</CardTitle>
          <CardDescription>{config.statusCardDescription}</CardDescription>
        </div>
        <StatusThresholdsDialogButton
          defaultValues={thresholds}
          source={source}
        />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statusCards.map((card) => (
          <StatusCard key={card.label} {...card} />
        ))}
      </CardContent>
      <ProjectStatusProjectsDialogBySource
        projects={projects}
        source={source}
        thresholds={thresholds}
      />
    </Card>
  );
}
