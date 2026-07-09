import { IconActivity, IconArrowRight } from "@tabler/icons-react";
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

import type { HomepageAutomationInsight } from "@/features/homepage/hooks/use-homepage-automations";
import { formatValue } from "@/shared/utils/format-value";

function formatDateTime(value: string | null) {
  if (!value) {
    return "Nenhuma execução registrada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function AutomationInsightCard({
  automation,
}: {
  automation: HomepageAutomationInsight;
}) {
  if (automation.isLoading) {
    return (
      <Skeleton className="h-44 w-full rounded-[min(var(--radius-4xl),24px)]" />
    );
  }

  if (automation.isError) {
    return (
      <Card className="border-destructive/30 h-full">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{automation.title}</CardTitle>
          <CardDescription className="text-destructive">
            Não foi possível carregar o status desta automação.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const stats = automation.lastExecutionStats;

  return (
    <Link
      className="group block h-full"
      preload="intent"
      to={automation.dashboardHref}
    >
      <Card className="group-hover:bg-muted/40 h-full transition-colors">
        <CardHeader className="gap-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base leading-snug">
              {automation.title}
            </CardTitle>
            <IconArrowRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
          <CardDescription>{automation.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {automation.isRunning ? (
              <Badge
                className={cn(
                  "gap-1.5 font-normal",
                  "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                )}
                variant="outline"
              >
                <IconActivity className="size-3.5" />
                Em execução
              </Badge>
            ) : (
              <Badge
                className="border-muted-foreground/20 bg-muted/50 text-muted-foreground font-normal"
                variant="outline"
              >
                Parada
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {formatDateTime(automation.lastExecutionAt)}
          </p>
          {stats ? (
            <p className="text-sm tabular-nums">
              Última execução: {formatValue(stats.succeeded)} sucesso
              {stats.succeeded === 1 ? "" : "s"}, {formatValue(stats.failed)}{" "}
              falha{stats.failed === 1 ? "" : "s"}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}

interface HomepageAutomationCardsProps {
  automations: HomepageAutomationInsight[];
}

export function HomepageAutomationCards({
  automations,
}: HomepageAutomationCardsProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Automações</h2>
        <p className="text-muted-foreground text-sm">
          Status das automações e acesso rápido aos painéis de controle
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {automations.map((automation) => (
          <AutomationInsightCard
            automation={automation}
            key={automation.kind}
          />
        ))}
      </div>
    </section>
  );
}
