import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@topsun/ui/components/card";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { useTRPC } from "@/features/platform/api/trpc";
import { RequestProtocolDataTable } from "@/features/request-protocol/components/request-protocol-data-table";

export function RequestProtocolTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Listagem de projetos (sem protocolo solicitado)</CardTitle>
        <CardDescription>
          Projetos que ainda não solicitaram protocolo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-180 w-full rounded-[min(var(--radius-4xl),24px)]" />
      </CardContent>
    </Card>
  );
}

export function RequestProtocolTable() {
  const trpc = useTRPC();

  const { data: projects, isLoading: isLoadingProjects } = useQuery(
    trpc.requestProtocol.getProjects.queryOptions()
  );

  const { data: thresholds, isLoading: isLoadingThresholds } = useQuery(
    trpc.requestProtocol.getStatusThresholds.queryOptions()
  );

  if (isLoadingProjects || isLoadingThresholds || !projects || !thresholds) {
    return <RequestProtocolTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listagem de projetos (sem protocolo solicitado)</CardTitle>
        <CardDescription>
          Projetos que ainda não solicitaram protocolo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RequestProtocolDataTable data={projects} thresholds={thresholds} />
      </CardContent>
    </Card>
  );
}
