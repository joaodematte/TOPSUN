import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconClockExclamation,
  IconFlameFilled,
  IconFoldersFilled,
  IconSendFilled,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
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

import { ConfigDialogButton } from "@/components/config-dialog-button";
import { ProjectStatusProjectsDialog } from "@/components/project-status-projects-dialog";
import { useTRPC } from "@/lib/trpc";
import { useProjectStatusDialogStore } from "@/stores/project-status-dialog-store";
import {
  getProjectStatusStats,
  PROJECT_STATUS_CLASSNAME,
  PROJECT_STATUS_FILTER_LABEL,
} from "@/utils/project-status";

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

export function ProjectStatusCardsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <CardTitle>
            Resumo de projetos na etapa "Solicitação de protocolo"
          </CardTitle>
          <CardDescription>
            Resumo de projetos em andamento na etapa de solicitação de protocolo
          </CardDescription>
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

export function ProjectStatusCards() {
  const trpc = useTRPC();
  const openDialog = useProjectStatusDialogStore((state) => state.openDialog);

  const { data: projects, isLoading: isLoadingProjects } = useQuery(
    trpc.requestProtocol.getProjects.queryOptions()
  );

  const { data: thresholds, isLoading: isLoadingThresholds } = useQuery(
    trpc.requestProtocol.getStatusThresholds.queryOptions()
  );

  if (isLoadingProjects || isLoadingThresholds || !projects || !thresholds) {
    return <ProjectStatusCardsSkeleton />;
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
          <CardTitle>
            Resumo de projetos na etapa "Solicitação de protocolo"
          </CardTitle>
          <CardDescription>
            Resumo de projetos em andamento na etapa de solicitação de protocolo
          </CardDescription>
        </div>
        <ConfigDialogButton defaultValues={thresholds} />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statusCards.map((card) => (
          <StatusCard key={card.label} {...card} />
        ))}
      </CardContent>
      {projects !== undefined && thresholds !== undefined ? (
        <ProjectStatusProjectsDialog
          projects={projects}
          thresholds={thresholds}
        />
      ) : null}
    </Card>
  );
}
