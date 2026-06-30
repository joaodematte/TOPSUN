"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { statusThresholdsSchema } from "@topsun/api/features/shared/status-thresholds.schema";
import type { StatusThresholdsInput } from "@topsun/api/features/shared/status-thresholds.schema";
import { Button } from "@topsun/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@topsun/ui/components/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@topsun/ui/components/field";
import { Input } from "@topsun/ui/components/input";
import { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { DashboardSource } from "@/features/dashboard/utils/dashboard-source";
import type { ProjectStatusThresholds } from "@/features/dashboard/utils/project-status";
import { useTRPC } from "@/features/platform/api/trpc";

interface StatusThresholdsDialogProps {
  defaultValues: ProjectStatusThresholds;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  source?: DashboardSource;
}

function useSaveThresholdsMutations(onOpenChange: (open: boolean) => void) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  function createMutationOptions(
    getMutationOptions: (
      options: Parameters<
        typeof trpc.requestProtocol.saveStatusThresholds.mutationOptions
      >[0]
    ) => ReturnType<
      typeof trpc.requestProtocol.saveStatusThresholds.mutationOptions
    >,
    invalidateFilter: ReturnType<
      typeof trpc.requestProtocol.getStatusThresholds.queryFilter
    >
  ) {
    return getMutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        toast.success("Configurações atualizadas com sucesso");

        await queryClient.invalidateQueries(invalidateFilter);

        onOpenChange(false);
      },
    });
  }

  const requestProtocol = useMutation(
    createMutationOptions(
      trpc.requestProtocol.saveStatusThresholds.mutationOptions,
      trpc.requestProtocol.getStatusThresholds.queryFilter()
    )
  );
  const inspectionApproval = useMutation(
    createMutationOptions(
      trpc.inspectionApproval.saveStatusThresholds.mutationOptions,
      trpc.inspectionApproval.getStatusThresholds.queryFilter()
    )
  );
  const accessRequest = useMutation(
    createMutationOptions(
      trpc.accessRequest.saveStatusThresholds.mutationOptions,
      trpc.accessRequest.getStatusThresholds.queryFilter()
    )
  );
  const artAccessRequirement = useMutation(
    createMutationOptions(
      trpc.artAccessRequirement.saveStatusThresholds.mutationOptions,
      trpc.artAccessRequirement.getStatusThresholds.queryFilter()
    )
  );
  const utilityInspectionRequest = useMutation(
    createMutationOptions(
      trpc.utilityInspectionRequest.saveStatusThresholds.mutationOptions,
      trpc.utilityInspectionRequest.getStatusThresholds.queryFilter()
    )
  );
  const installationCompletion = useMutation(
    createMutationOptions(
      trpc.installationCompletion.saveStatusThresholds.mutationOptions,
      trpc.installationCompletion.getStatusThresholds.queryFilter()
    )
  );
  const completionValidation = useMutation(
    createMutationOptions(
      trpc.completionValidation.saveStatusThresholds.mutationOptions,
      trpc.completionValidation.getStatusThresholds.queryFilter()
    )
  );
  const technicalInspectionValidation = useMutation(
    createMutationOptions(
      trpc.technicalInspectionValidation.saveStatusThresholds.mutationOptions,
      trpc.technicalInspectionValidation.getStatusThresholds.queryFilter()
    )
  );

  return {
    accessRequest,
    artAccessRequirement,
    completionValidation,
    inspectionApproval,
    installationCompletion,
    requestProtocol,
    technicalInspectionValidation,
    utilityInspectionRequest,
  };
}

export function StatusThresholdsDialog({
  defaultValues,
  onOpenChange,
  open,
  source = "requestProtocol",
}: StatusThresholdsDialogProps) {
  const formId = useId();
  const onTimeId = useId();
  const attentionId = useId();
  const criticalId = useId();
  const saveMutations = useSaveThresholdsMutations(onOpenChange);
  const saveThresholds = saveMutations[source];

  const form = useForm<StatusThresholdsInput>({
    defaultValues,
    resolver: zodResolver(statusThresholdsSchema),
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

  function onSubmit(data: StatusThresholdsInput) {
    saveThresholds.mutate(data);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar configurações</DialogTitle>
          <DialogDescription>
            Edite as configurações do sistema para atender às suas necessidades.
          </DialogDescription>
        </DialogHeader>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Controller
                control={form.control}
                name="onTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={onTimeId}>No prazo</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id={onTimeId}
                      min={0}
                      onChange={(event) => {
                        field.onChange(event.target.valueAsNumber);
                      }}
                      type="number"
                      value={field.value}
                    />
                    <FieldDescription>
                      Limite inclusive de dias na etapa. Projetos com até este
                      valor permanecem no prazo; a partir do dia seguinte entram
                      em atenção.
                    </FieldDescription>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="attention"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={attentionId}>Atenção</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id={attentionId}
                      min={0}
                      onChange={(event) => {
                        field.onChange(event.target.valueAsNumber);
                      }}
                      type="number"
                      value={field.value}
                    />
                    <FieldDescription>
                      Limite inclusive de dias na etapa para atenção. Projetos
                      acima de No prazo e até este valor ficam em atenção.
                    </FieldDescription>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="critical"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={criticalId}>
                      Caminho crítico
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id={criticalId}
                      min={0}
                      onChange={(event) => {
                        field.onChange(event.target.valueAsNumber);
                      }}
                      type="number"
                      value={field.value}
                    />
                    <FieldDescription>
                      Limite inclusive de dias na etapa para Caminho crítico.
                      Projetos acima de Atenção e até este valor ficam Caminho
                      críticos; acima disso são atrasados.
                    </FieldDescription>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Button
            disabled={saveThresholds.isPending}
            form={formId}
            type="submit"
          >
            {saveThresholds.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
