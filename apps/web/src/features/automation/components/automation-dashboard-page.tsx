import {
  IconActivity,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconDotsVertical,
  IconEye,
  IconHistory,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@topsun/ui/components/alert";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@topsun/ui/components/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@topsun/ui/components/empty";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@topsun/ui/components/progress";
import { ScrollArea } from "@topsun/ui/components/scroll-area";
import { Skeleton } from "@topsun/ui/components/skeleton";
import { cn } from "@topsun/ui/lib/utils";
import type { ComponentType, ReactNode } from "react";

import type {
  AutomationKind,
  AutomationUiLogLevel,
} from "@/features/automation/config";
import {
  AUTOMATION_KIND_CONFIG,
  AUTOMATION_REPORT_ROUTE_BY_KIND,
} from "@/features/automation/config";
import { useAutomationDashboard } from "@/features/automation/hooks/use-automation-dashboard";
import type {
  AutomationRunDisplayStatus,
  AutomationRunHistoryItem,
} from "@/features/automation/types";
import { DataTable } from "@/shared/components/data-table";

const LOG_LEVEL_CLASSNAME: Record<AutomationUiLogLevel, string> = {
  error: "text-destructive",
  info: "text-muted-foreground",
  step: "text-blue-600 dark:text-blue-400",
  success: "text-emerald-600 dark:text-emerald-400",
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

function AutomationDashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Skeleton className="h-21 w-full" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <Skeleton className="h-[206.5px] w-full" />
        <Skeleton className="h-[206.5px] w-full" />
      </div>
      <Skeleton className="h-139 w-full" />
      <Skeleton className="h-71.75 w-full" />
    </div>
  );
}

function AutomationStatusBadge({ isRunning }: { isRunning: boolean }) {
  return (
    <Badge
      className={cn(
        "h-7 gap-1.5 px-3 text-xs",
        isRunning &&
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      )}
      variant={isRunning ? "outline" : "secondary"}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2 rounded-full",
          isRunning ? "animate-pulse bg-emerald-500" : "bg-muted-foreground/50"
        )}
      />
      {isRunning ? "Em execução" : "Parado"}
    </Badge>
  );
}

interface MetricItemProps {
  className?: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
}

function MetricItem({ className, icon: Icon, label, value }: MetricItemProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

interface StatPillProps {
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
  label: string;
  value: number;
}

function StatPill({ icon: Icon, iconClassName, label, value }: StatPillProps) {
  return (
    <div className="bg-card ring-foreground/5 flex flex-col gap-1 rounded-[min(var(--radius-4xl),24px)] p-3 ring-1">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-3.5", iconClassName)} />
        <span className="text-muted-foreground text-xs">{label}</span>
      </div>
      <span className="text-xl font-semibold tabular-nums">{value}</span>
    </div>
  );
}

interface AutomationDashboardPageProps {
  kind: AutomationKind;
  showExecutionHistory?: boolean;
}

interface AutomationControlCardProps {
  currentStep: string | null;
  isRunning: boolean;
  isStarting: boolean;
  lastExecutionAt: string | null;
  onStart: () => void;
}

function AutomationControlCard({
  isRunning,
  isStarting,
  lastExecutionAt,
  onStart,
}: AutomationControlCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Controle da automação</CardTitle>
        <CardDescription>
          Status atual e ação para iniciar uma nova execução
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetricItem
            icon={IconActivity}
            label="Situação"
            value={
              <Badge
                className={cn(
                  isRunning &&
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                )}
                variant={isRunning ? "outline" : "secondary"}
              >
                {isRunning ? "Em execução" : "Parado"}
              </Badge>
            }
          />
          <MetricItem
            icon={IconClock}
            label="Última execução"
            value={
              <span className="text-sm font-medium">
                {formatDateTime(lastExecutionAt)}
              </span>
            }
          />
        </dl>

        <Button
          className="w-full sm:w-auto"
          disabled={isRunning || isStarting}
          onClick={onStart}
          type="button"
        >
          <IconPlayerPlay />
          {isStarting ? "Iniciando..." : "Iniciar automação"}
        </Button>
      </CardContent>
    </Card>
  );
}

interface LastExecutionCardProps {
  lastExecutionAt: string | null;
  stats: {
    failed: number;
    succeeded: number;
  } | null;
}

function getTotalLastExecutionProjects(
  stats: NonNullable<LastExecutionCardProps["stats"]>
) {
  return stats.succeeded + stats.failed;
}

function getLastExecutionSuccessRate(
  stats: NonNullable<LastExecutionCardProps["stats"]>
) {
  const total = getTotalLastExecutionProjects(stats);

  if (total === 0) {
    return 0;
  }

  return Math.round((stats.succeeded / total) * 100);
}

function getLastExecutionResultLabel(
  stats: NonNullable<LastExecutionCardProps["stats"]>
) {
  if (stats.failed > 0) {
    return {
      className:
        "border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20",
      label: "Com falhas",
    };
  }

  return {
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    label: "Concluída",
  };
}

function LastExecutionCard({ lastExecutionAt, stats }: LastExecutionCardProps) {
  const hasExecution = Boolean(lastExecutionAt && stats);
  const totalProjects = stats ? getTotalLastExecutionProjects(stats) : 0;
  const successRate = stats ? getLastExecutionSuccessRate(stats) : 0;
  const result = stats ? getLastExecutionResultLabel(stats) : null;

  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="space-y-1">
          <CardTitle>Última execução</CardTitle>
          <CardDescription>
            {lastExecutionAt
              ? `Finalizada em ${formatDateTime(lastExecutionAt)}`
              : "Nenhuma execução concluída"}
          </CardDescription>
        </div>
        {result ? (
          <Badge className={cn("w-fit", result.className)} variant="outline">
            {result.label}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {hasExecution ? (
          <>
            <div className="bg-muted/30 ring-foreground/5 rounded-[min(var(--radius-4xl),24px)] p-4 ring-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Projetos processados
                  </p>
                  <p className="text-4xl font-semibold tracking-tight tabular-nums">
                    {totalProjects}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <StatPill
                icon={IconCircleCheck}
                iconClassName="text-emerald-600 dark:text-emerald-400"
                label="Sucesso"
                value={stats?.succeeded ?? 0}
              />
              <StatPill
                icon={IconCircleX}
                iconClassName="text-destructive"
                label="Erros"
                value={stats?.failed ?? 0}
              />
            </div>

            <Progress value={successRate}>
              <ProgressLabel>Taxa de sucesso</ProgressLabel>
              <ProgressValue>{() => `${successRate}%`}</ProgressValue>
            </Progress>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            Os resultados aparecerão aqui após a primeira execução concluída.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface LiveLogEntry {
  id: string;
  level: AutomationUiLogLevel;
  message: string;
  timestamp: string;
}

interface LiveLogCardProps {
  isRunning: boolean;
  logs: LiveLogEntry[];
}

function LogLine({ entry }: { entry: LiveLogEntry }) {
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

function LiveLogCard({ isRunning, logs }: LiveLogCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <CardTitle>Log em tempo real</CardTitle>
          <CardDescription>
            Acompanhe a execução da automação conforme ela acontece
          </CardDescription>
        </div>
        {isRunning ? (
          <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            Ao vivo
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent>
        <ScrollArea className="bg-muted/30 ring-foreground/5 h-112 rounded-[min(var(--radius-4xl),24px)] ring-1">
          {logs.length === 0 ? (
            <Empty className="h-full border-none">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconActivity />
                </EmptyMedia>
                <EmptyTitle>Nenhum log disponível</EmptyTitle>
                <EmptyDescription>
                  Inicie a automação para acompanhar os eventos aqui.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="p-4 font-mono text-xs leading-relaxed">
              {logs.map((entry) => (
                <LogLine entry={entry} key={entry.id} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface ExecutionHistoryCardProps {
  kind: AutomationKind;
  runs: AutomationRunHistoryItem[];
}

function ExecutionHistoryActionsMenu({
  kind,
  run,
}: {
  kind: AutomationKind;
  run: AutomationRunHistoryItem;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={`Ações da execução ${formatCompactRunId(run.id)}`}
            size="icon-sm"
            type="button"
            variant="ghost"
          />
        }
      >
        <IconDotsVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="font-medium"
            render={
              <Link
                params={{ automationId: run.id }}
                to={AUTOMATION_REPORT_ROUTE_BY_KIND[kind]}
              />
            }
          >
            <IconEye />
            Visualizar relatório
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function createExecutionHistoryColumns(
  kind: AutomationKind
): ColumnDef<AutomationRunHistoryItem>[] {
  return [
    {
      accessorKey: "id",
      cell: ({ row }) => {
        const run = row.original;

        return (
          <code
            className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-xs"
            title={run.id}
          >
            {formatCompactRunId(run.id)}
          </code>
        );
      },
      header: "ID",
      size: 100,
    },
    {
      accessorKey: "status",
      cell: ({ row }) => <RunStatusBadge status={row.original.status} />,
      header: "Status",
      size: 160,
    },
    {
      accessorKey: "startedAt",
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {formatDateTime(row.original.startedAt)}
        </span>
      ),
      header: "Iniciado em",
      size: 180,
    },
    {
      accessorKey: "finishedAt",
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {formatDateTime(row.original.finishedAt)}
        </span>
      ),
      header: "Finalizado em",
      size: 180,
    },
    {
      cell: ({ row }) => (
        <ExecutionHistoryActionsMenu kind={kind} run={row.original} />
      ),
      header: "Ações",
      id: "actions",
      size: 72,
    },
  ];
}

function ExecutionHistoryCard({ kind, runs }: ExecutionHistoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <CardTitle>Histórico de execuções</CardTitle>
          <CardDescription>
            Execuções anteriores do robô com status detalhado
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {runs.length === 0 ? (
          <Empty className="border-none py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconHistory />
              </EmptyMedia>
              <EmptyTitle>Nenhuma execução registrada</EmptyTitle>
              <EmptyDescription>
                O histórico aparecerá aqui após a primeira execução.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            columns={createExecutionHistoryColumns(kind)}
            data={runs}
            pageSize={10}
          />
        )}
      </CardContent>
    </Card>
  );
}

export function AutomationDashboardPage({
  kind,
  showExecutionHistory = false,
}: AutomationDashboardPageProps) {
  const config = AUTOMATION_KIND_CONFIG[kind];
  const {
    currentStep,
    history,
    isLoading,
    isRunning,
    isStarting,
    lastExecutionAt,
    lastExecutionStats,
    logs,
    startAutomation,
    startError,
  } = useAutomationDashboard(kind, { includeHistory: showExecutionHistory });

  if (isLoading) {
    return <AutomationDashboardSkeleton />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle>{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </div>
          <AutomationStatusBadge isRunning={isRunning} />
        </CardHeader>
      </Card>

      {startError ? (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível iniciar</AlertTitle>
          <AlertDescription>{startError.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <AutomationControlCard
          currentStep={currentStep}
          isRunning={isRunning}
          isStarting={isStarting}
          lastExecutionAt={lastExecutionAt}
          onStart={startAutomation}
        />

        <LastExecutionCard
          lastExecutionAt={lastExecutionAt}
          stats={lastExecutionStats}
        />
      </div>

      <LiveLogCard isRunning={isRunning} logs={logs} />

      {showExecutionHistory ? (
        <ExecutionHistoryCard kind={kind} runs={history} />
      ) : null}
    </div>
  );
}
