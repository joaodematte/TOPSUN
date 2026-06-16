export function isProjectSolicitado(
  dataSolicitado: string | null | undefined
): boolean {
  return dataSolicitado != null && dataSolicitado.trim() !== "";
}

export function getSolicitadoStats<
  T extends { dataSolicitado?: string | null },
>(projects: T[]) {
  const total = projects.length;
  const count = projects.filter((project) =>
    isProjectSolicitado(project.dataSolicitado)
  ).length;

  return {
    count,
    percentage: total === 0 ? 0 : Math.round((count / total) * 100),
  };
}
