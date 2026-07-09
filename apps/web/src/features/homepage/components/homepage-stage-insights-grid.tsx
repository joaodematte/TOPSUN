import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@topsun/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";
import { cn } from "@topsun/ui/lib/utils";

import { PROJECT_STATUS_CLASSNAME } from "@/features/dashboard/utils/project-status";
import type { HomepageStageInsight } from "@/features/homepage/hooks/use-homepage-insights";

function StageInsightCard({ stage }: { stage: HomepageStageInsight }) {
  if (stage.isLoading) {
    return (
      <Skeleton className="h-44 w-full rounded-[min(var(--radius-4xl),24px)]" />
    );
  }

  if (stage.isError) {
    return (
      <Card className="border-destructive/30 h-full">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{stage.shortTitle}</CardTitle>
          <CardDescription className="text-destructive">
            Não foi possível carregar os dados desta etapa.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Link className="group block h-full" preload="intent" to={stage.href}>
      <Card className="group-hover:bg-muted/40 h-full transition-colors">
        <CardHeader className="gap-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base leading-snug">
              {stage.shortTitle}
            </CardTitle>
            <IconArrowRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
          <CardDescription>
            {stage.total} projeto{stage.total === 1 ? "" : "s"} em andamento
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge
            className={cn("font-normal", PROJECT_STATUS_CLASSNAME.overdue)}
            variant="outline"
          >
            {stage.overdue} atrasado{stage.overdue === 1 ? "" : "s"} (
            {stage.overduePercentage}%)
          </Badge>
          <Badge
            className={cn("font-normal", PROJECT_STATUS_CLASSNAME.critical)}
            variant="outline"
          >
            {stage.critical} em caminho crítico
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

interface HomepageStageInsightsGridProps {
  stages: HomepageStageInsight[];
}

export function HomepageStageInsightsGrid({
  stages,
}: HomepageStageInsightsGridProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Resumos por etapa
        </h2>
        <p className="text-muted-foreground text-sm">
          Acompanhe o volume e os riscos em cada etapa do pipeline
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage) => (
          <StageInsightCard key={stage.source} stage={stage} />
        ))}
      </div>
    </section>
  );
}
