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
import { useTRPC } from "@/lib/trpc";
import {
  getProjectStatusStats,
  PROJECT_STATUS_CLASSNAME,
} from "@/utils/project-status";

interface StatusCardConfig {
  count: number | string;
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
  label: string;
  percentage?: number | string;
}

const SOLICITADOS_MOCK = {
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
  percentage,
}: StatusCardConfig) {
  return (
    <div className="bg-card flex flex-col gap-3 rounded-[min(var(--radius-4xl),24px)] border p-4">
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
    </div>
  );
}

export function ProjectStatusCards() {
  const trpc = useTRPC();

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
      label: "Total",
    },
    {
      count: stats.noPrazo,
      icon: IconCircleCheckFilled,
      iconClassName: PROJECT_STATUS_CLASSNAME.noPrazo,
      label: "No prazo",
      percentage: stats.noPrazoPercentage,
    },
    {
      count: stats.atencao,
      icon: IconAlertTriangleFilled,
      iconClassName: PROJECT_STATUS_CLASSNAME.atencao,
      label: "Atenção",
      percentage: stats.atencaoPercentage,
    },
    {
      count: stats.caminhoCritico,
      icon: IconFlameFilled,
      iconClassName: PROJECT_STATUS_CLASSNAME.caminhoCritico,
      label: "Críticos",
      percentage: stats.caminhoCriticoPercentage,
    },
    {
      count: stats.atrasado,
      icon: IconClockExclamation,
      iconClassName: PROJECT_STATUS_CLASSNAME.atrasado,
      label: "Atrasados",
      percentage: stats.atrasadoPercentage,
    },
    {
      count: SOLICITADOS_MOCK.count,
      icon: IconSendFilled,
      iconClassName: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      label: "Solicitados",
      percentage: SOLICITADOS_MOCK.percentage,
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
    </Card>
  );
}
