import { IconActivity, IconArrowLeft, IconFileText } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@topsun/ui/components/badge";
import { Button } from "@topsun/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@topsun/ui/components/empty";
import { ScrollArea } from "@topsun/ui/components/scroll-area";
import { Skeleton } from "@topsun/ui/components/skeleton";
import { cn } from "@topsun/ui/lib/utils";

import { AutomationRunReportDataTable } from "@/features/automation/components/automation-run-report-data-table";
import type { AutomationKind } from "@/features/automation/config";
import {
  AUTOMATION_DASHBOARD_ROUTE_BY_KIND,
  AUTOMATION_KIND_CONFIG,
} from "@/features/automation/config";
import { useAutomationRunReport } from "@/features/automation/hooks/use-automation-run-report";
import type {
  AutomationRunDisplayStatus,
  AutomationRunReportLogEntry,
} from "@/features/automation/types";

const RESULTS_DESCRIPTION_BY_KIND: Record<AutomationKind, string> = {
  request_protocol:
    "Projetos elegíveis processados nesta execução com status na CELESC e no TOPSUN",
  validate_protocol_return:
    "Projetos fechados com sucesso e divergências identificadas nos e-mails da CELESC",
};

const LOG_LEVEL_CLASSNAME: Record<
  AutomationRunReportLogEntry["level"],
  string
> = {
  error: "text-destructive",
  info: "text-muted-foreground",
  step: "text-blue-600 dark:text-blue-400",
  success: "text-emerald-600 dark:text-emerald-400",
};

const RUN_STATUS_CONFIG: Record<
  AutomationRunDisplayStatus,
  { className: string; label: string }
> = {
  error: {
    className:
      "border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20",
    label: "Erro",
  },
  running: {
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    label: "Em execução",
  },
  success: {
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    label: "Sucesso",
  },
  with_divergences: {
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    label: "Com divergências",
  },
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatCompactRunId(id: string) {
  return id.slice(0, 8);
}

function RunStatusBadge({ status }: { status: AutomationRunDisplayStatus }) {
  const config = RUN_STATUS_CONFIG[status];

  return (
    <Badge className={cn("gap-1.5", config.className)} variant="outline">
      {status === "running" ? (
        <span
          aria-hidden="true"
          className="size-1.5 animate-pulse rounded-full bg-emerald-500"
        />
      ) : null}
      {config.label}
    </Badge>
  );
}

function AutomationRunReportSkeleton({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-32 w-full rounded-[min(var(--radius-4xl),24px)]" />
      <Skeleton className="h-96 w-full rounded-[min(var(--radius-4xl),24px)]" />
      <Skeleton className="h-112 w-full rounded-[min(var(--radius-4xl),24px)]" />
      <span className="sr-only">{title}</span>
    </div>
  );
}

function LogLine({ entry }: { entry: AutomationRunReportLogEntry }) {
  return (
    <div className="flex gap-3 py-1">
      <time
        className="text-muted-foreground shrink-0 tabular-nums"
        dateTime={entry.timestamp}
      >
        {formatDateTime(entry.timestamp)}
      </time>
      <span
        className={cn(
          "min-w-16 shrink-0 uppercase",
          LOG_LEVEL_CLASSNAME[entry.level]
        )}
      >
        [{entry.level}]
      </span>
      <span className="text-foreground">{entry.message}</span>
    </div>
  );
}

interface AutomationRunReportPageProps {
  automationId: string;
  kind: AutomationKind;
}

export function AutomationRunReportPage({
  automationId,
  kind,
}: AutomationRunReportPageProps) {
  const config = AUTOMATION_KIND_CONFIG[kind];
  const dashboardRoute = AUTOMATION_DASHBOARD_ROUTE_BY_KIND[kind];
  const { isLoading, report } = useAutomationRunReport(kind, automationId);

  if (isLoading) {
    return <AutomationRunReportSkeleton title={config.title} />;
  }

  if (!report) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Button
          render={<Link to={dashboardRoute} />}
          type="button"
          variant="outline"
        >
          <IconArrowLeft />
          Voltar
        </Button>
        <Empty className="border-none py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconFileText />
            </EmptyMedia>
            <EmptyTitle>Execução não encontrada</EmptyTitle>
            <EmptyDescription>
              Não foi possível localizar o relatório desta execução.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          render={<Link to={dashboardRoute} />}
          type="button"
          variant="outline"
        >
          <IconArrowLeft />
          Voltar
        </Button>
        <RunStatusBadge status={report.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatório da execução</CardTitle>
          <CardDescription>
            {config.title} · ID{" "}
            <code className="bg-muted rounded-md px-1.5 py-0.5 font-mono text-xs">
              {formatCompactRunId(report.id)}
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-muted-foreground text-xs font-medium">
                Iniciado em
              </dt>
              <dd className="text-sm font-medium tabular-nums">
                {formatDateTime(report.startedAt)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground text-xs font-medium">
                Finalizado em
              </dt>
              <dd className="text-sm font-medium tabular-nums">
                {formatDateTime(report.finishedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados por projeto</CardTitle>
          <CardDescription>{RESULTS_DESCRIPTION_BY_KIND[kind]}</CardDescription>
        </CardHeader>
        <CardContent>
          {report.rows.length === 0 ? (
            <Empty className="border-none py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconFileText />
                </EmptyMedia>
                <EmptyTitle>Nenhum resultado registrado</EmptyTitle>
                <EmptyDescription>
                  Esta execução não possui linhas de resultado para exibir.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <AutomationRunReportDataTable kind={kind} report={report} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logs da execução</CardTitle>
          <CardDescription>
            Eventos registrados durante esta execução
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="bg-muted/30 ring-foreground/5 h-112 rounded-[min(var(--radius-4xl),24px)] ring-1">
            {report.logs.length === 0 ? (
              <Empty className="border-none">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconActivity />
                  </EmptyMedia>
                  <EmptyTitle>Nenhum log disponível</EmptyTitle>
                  <EmptyDescription>
                    Não há logs registrados para esta execução.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="p-4 font-mono text-xs leading-relaxed">
                {report.logs.map((entry) => (
                  <LogLine entry={entry} key={entry.id} />
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
