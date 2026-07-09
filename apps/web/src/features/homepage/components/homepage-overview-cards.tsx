import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconClockExclamation,
  IconFlameFilled,
  IconFoldersFilled,
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

import { PROJECT_STATUS_CLASSNAME } from "@/features/dashboard/utils/project-status";
import type { HomepageGlobalInsight } from "@/features/homepage/hooks/use-homepage-insights";

interface OverviewMetric {
  count: number;
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
  label: string;
}

function buildOverviewMetrics(
  globalInsight: HomepageGlobalInsight
): OverviewMetric[] {
  return [
    {
      count: globalInsight.total,
      icon: IconFoldersFilled,
      iconClassName: "bg-muted text-muted-foreground",
      label: "Total",
    },
    {
      count: globalInsight.onTime,
      icon: IconCircleCheckFilled,
      iconClassName: PROJECT_STATUS_CLASSNAME.onTime,
      label: "No prazo",
    },
    {
      count: globalInsight.attention,
      icon: IconAlertTriangleFilled,
      iconClassName: PROJECT_STATUS_CLASSNAME.attention,
      label: "Atenção",
    },
    {
      count: globalInsight.critical,
      icon: IconFlameFilled,
      iconClassName: PROJECT_STATUS_CLASSNAME.critical,
      label: "Caminho crítico",
    },
    {
      count: globalInsight.overdue,
      icon: IconClockExclamation,
      iconClassName: PROJECT_STATUS_CLASSNAME.overdue,
      label: "Atrasados",
    },
  ];
}

function OverviewMetricCard({
  count,
  icon: Icon,
  iconClassName,
  label,
}: OverviewMetric) {
  return (
    <div className="bg-card ring-foreground/5 flex flex-col gap-3 rounded-[min(var(--radius-4xl),24px)] p-4 ring-1">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            iconClassName
          )}
        >
          <Icon className="size-4.5" />
        </span>
        <span className="text-muted-foreground text-sm font-medium">
          {label}
        </span>
      </div>
      <p className="text-3xl font-semibold tracking-tight tabular-nums">
        {count}
      </p>
    </div>
  );
}

function HomepageOverviewCardsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão geral do pipeline</CardTitle>
        <CardDescription>
          Soma de projetos em andamento em todas as etapas dos resumos
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            className="h-28.5 w-full rounded-[min(var(--radius-4xl),24px)]"
            key={index}
          />
        ))}
      </CardContent>
    </Card>
  );
}

interface HomepageOverviewCardsProps {
  globalInsight: HomepageGlobalInsight;
  isLoading: boolean;
}

export function HomepageOverviewCards({
  globalInsight,
  isLoading,
}: HomepageOverviewCardsProps) {
  if (isLoading) {
    return <HomepageOverviewCardsSkeleton />;
  }

  const metrics = buildOverviewMetrics(globalInsight);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão geral do pipeline</CardTitle>
        <CardDescription>
          Soma de projetos em andamento em todas as etapas dos resumos
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <OverviewMetricCard key={metric.label} {...metric} />
        ))}
      </CardContent>
    </Card>
  );
}
