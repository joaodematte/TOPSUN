import {
  IconActivity,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconPlayerPlay,
  IconRobot,
} from "@tabler/icons-react";
import type { RouterOutputs } from "@topsun/api";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@topsun/ui/components/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@topsun/ui/components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@topsun/ui/components/tabs";
import { cn } from "@topsun/ui/lib/utils";
import { useState } from "react";
import type { ComponentType, ReactNode } from "react";

import type {
  AutomationKind,
  AutomationUiLogLevel,
} from "@/features/automation/config";
import { AUTOMATION_KIND_CONFIG } from "@/features/automation/config";
import { useAutomationDashboard } from "@/features/automation/hooks/use-automation-dashboard";

const LOG_LEVEL_CLASSNAME: Record<AutomationUiLogLevel, string> = {
  error: "text-destructive",
  info: "text-muted-foreground",
  step: "text-blue-600 dark:text-blue-400",
  success: "text-emerald-600 dark:text-emerald-400",
};

type AutomationExecutionResults = NonNullable<
  RouterOutputs["automation"]["getStatus"]["lastExecutionResults"]
>;

type AutomationSuccessRow = AutomationExecutionResults["success"][number];
type AutomationErrorRow = AutomationExecutionResults["error"][number];

const SYSTEM_STATUS_CLASSNAME: Record<
  AutomationErrorRow["celescStatus"],
  string
> = {
  ERRO: "text-destructive",
  IGNORADO: "text-amber-600 dark:text-amber-400",
  OK: "text-emerald-600 dark:text-emerald-400",
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

function AutomationDashboardSkeleton({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-80 max-w-full" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <span className="sr-only">{title}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <Skeleton className="h-72 w-full rounded-[min(var(--radius-4xl),24px)]" />
        <Skeleton className="h-72 w-full rounded-[min(var(--radius-4xl),24px)]" />
      </div>
      <Skeleton className="h-112 w-full rounded-[min(var(--radius-4xl),24px)]" />
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
  results: AutomationExecutionResults | null;
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

interface ResultTableSectionProps {
  showHeader?: boolean;
}

function SuccessResultTableSection({
  rows,
  showHeader = true,
}: { rows: AutomationSuccessRow[] } & ResultTableSectionProps) {
  return (
    <section className="space-y-3">
      {showHeader ? (
        <div className="flex items-center gap-2">
          <IconCircleCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold">Sucessos</h3>
          <Badge variant="secondary">{rows.length}</Badge>
        </div>
      ) : null}

      {rows.length === 0 ? (
        <Empty className="border-none py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconCircleCheck />
            </EmptyMedia>
            <EmptyTitle>Nenhum sucesso</EmptyTitle>
            <EmptyDescription>
              Nenhum projeto concluído com sucesso na última execução.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="ring-foreground/5 overflow-hidden rounded-[min(var(--radius-4xl),24px)] ring-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Cliente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.projectId}>
                  <TableCell className="font-medium tabular-nums">
                    {row.projectId}
                  </TableCell>
                  <TableCell>{row.client ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

function SystemStatusBadge({
  status,
}: {
  status: AutomationErrorRow["celescStatus"];
}) {
  return (
    <span
      className={cn("text-xs font-semibold", SYSTEM_STATUS_CLASSNAME[status])}
    >
      {status}
    </span>
  );
}

function ErrorResultTableSection({
  rows,
  showHeader = true,
}: { rows: AutomationErrorRow[] } & ResultTableSectionProps) {
  return (
    <section className="space-y-3">
      {showHeader ? (
        <div className="flex items-center gap-2">
          <IconCircleX className="text-destructive size-4" />
          <h3 className="text-sm font-semibold">Erros</h3>
          <Badge variant="secondary">{rows.length}</Badge>
        </div>
      ) : null}

      {rows.length === 0 ? (
        <Empty className="border-none py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconCircleX />
            </EmptyMedia>
            <EmptyTitle>Nenhum erro</EmptyTitle>
            <EmptyDescription>
              Nenhum projeto com erro na última execução.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="ring-foreground/5 overflow-hidden rounded-[min(var(--radius-4xl),24px)] ring-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>CELESC</TableHead>
                <TableHead>TOPSUN</TableHead>
                <TableHead>Mensagem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.projectId}>
                  <TableCell className="font-medium tabular-nums">
                    {row.projectId}
                  </TableCell>
                  <TableCell>{row.client ?? "—"}</TableCell>
                  <TableCell>
                    <SystemStatusBadge status={row.celescStatus} />
                  </TableCell>
                  <TableCell>
                    <SystemStatusBadge status={row.topsunStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-md whitespace-normal">
                    {row.errorMessage ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

interface LastExecutionReportDialogProps {
  lastExecutionAt: string | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  results: AutomationExecutionResults;
}

function LastExecutionReportDialog({
  lastExecutionAt,
  onOpenChange,
  open,
  results,
}: LastExecutionReportDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-6xl flex-col gap-4 overflow-hidden sm:max-w-6xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Resultados da última execução</DialogTitle>
          <DialogDescription>
            {lastExecutionAt
              ? `Finalizada em ${formatDateTime(lastExecutionAt)}`
              : "Relatório da última execução concluída"}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          className="flex min-h-0 flex-1 flex-col gap-4"
          defaultValue="success"
        >
          <TabsList className="shrink-0">
            <TabsTrigger value="success">
              Sucesso ({results.success.length})
            </TabsTrigger>
            <TabsTrigger value="error">
              Erro ({results.error.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent className="min-h-0 flex-1 overflow-auto" value="success">
            <SuccessResultTableSection
              rows={results.success}
              showHeader={false}
            />
          </TabsContent>

          <TabsContent className="min-h-0 flex-1 overflow-auto" value="error">
            <ErrorResultTableSection rows={results.error} showHeader={false} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function LastExecutionCard({
  lastExecutionAt,
  results,
  stats,
}: LastExecutionCardProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const hasExecution = Boolean(lastExecutionAt && stats);
  const canViewReport = Boolean(hasExecution && results);
  const totalProjects = stats ? getTotalLastExecutionProjects(stats) : 0;
  const successRate = stats ? getLastExecutionSuccessRate(stats) : 0;
  const result = stats ? getLastExecutionResultLabel(stats) : null;

  return (
    <>
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

              {canViewReport ? (
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => setIsReportOpen(true)}
                  type="button"
                  variant="outline"
                >
                  Visualizar relatório
                </Button>
              ) : null}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Os resultados aparecerão aqui após a primeira execução concluída.
            </p>
          )}
        </CardContent>
      </Card>

      {canViewReport && results ? (
        <LastExecutionReportDialog
          lastExecutionAt={lastExecutionAt}
          onOpenChange={setIsReportOpen}
          open={isReportOpen}
          results={results}
        />
      ) : null}
    </>
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
            <Empty className="border-none">
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

export function AutomationDashboardPage({
  kind,
}: AutomationDashboardPageProps) {
  const config = AUTOMATION_KIND_CONFIG[kind];
  const {
    currentStep,
    isLoading,
    isRunning,
    isStarting,
    lastExecutionAt,
    lastExecutionResults,
    lastExecutionStats,
    logs,
    startAutomation,
    startError,
  } = useAutomationDashboard(kind);

  if (isLoading) {
    return <AutomationDashboardSkeleton title={config.title} />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
              <IconRobot className="size-5" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">
              {config.title}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl text-sm">
            {config.description}
          </p>
        </div>

        <AutomationStatusBadge isRunning={isRunning} />
      </header>

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
          results={lastExecutionResults}
          stats={lastExecutionStats}
        />
      </div>

      <LiveLogCard isRunning={isRunning} logs={logs} />
    </div>
  );
}
