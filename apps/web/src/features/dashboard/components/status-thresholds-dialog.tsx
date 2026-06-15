"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accessRequestStatusThresholdsSchema } from "@topsun/api/features/access-request/schema";
import type { AccessRequestStatusThresholdsInput } from "@topsun/api/features/access-request/schema";
import { artAccessRequirementStatusThresholdsSchema } from "@topsun/api/features/art-access-requirement/schema";
import type { ArtAccessRequirementStatusThresholdsInput } from "@topsun/api/features/art-access-requirement/schema";
import { inspectionApprovalStatusThresholdsSchema } from "@topsun/api/features/inspection-approval/schema";
import type { InspectionApprovalStatusThresholdsInput } from "@topsun/api/features/inspection-approval/schema";
import type { RequestProtocolStatusThresholdsInput } from "@topsun/api/features/request-protocol/schema";
import { requestProtocolStatusThresholdsSchema } from "@topsun/api/features/request-protocol/schema";
import { utilityInspectionRequestStatusThresholdsSchema } from "@topsun/api/features/utility-inspection-request/schema";
import type { UtilityInspectionRequestStatusThresholdsInput } from "@topsun/api/features/utility-inspection-request/schema";
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

type StatusThresholdsFormInput =
  | RequestProtocolStatusThresholdsInput
  | InspectionApprovalStatusThresholdsInput
  | AccessRequestStatusThresholdsInput
  | ArtAccessRequirementStatusThresholdsInput
  | UtilityInspectionRequestStatusThresholdsInput;

interface StatusThresholdsDialogProps {
  defaultValues: ProjectStatusThresholds;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  source?: DashboardSource;
}

function getSchemaForSource(source: DashboardSource) {
  if (source === "inspectionApproval") {
    return inspectionApprovalStatusThresholdsSchema;
  }

  if (source === "accessRequest") {
    return accessRequestStatusThresholdsSchema;
  }

  if (source === "artAccessRequirement") {
    return artAccessRequirementStatusThresholdsSchema;
  }

  if (source === "utilityInspectionRequest") {
    return utilityInspectionRequestStatusThresholdsSchema;
  }

  return requestProtocolStatusThresholdsSchema;
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
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<StatusThresholdsFormInput>({
    defaultValues,
    resolver: zodResolver(getSchemaForSource(source)),
  });

  const saveRequestProtocolThresholds = useMutation(
    trpc.requestProtocol.saveStatusThresholds.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        toast.success("Configurações atualizadas com sucesso");

        await queryClient.invalidateQueries(
          trpc.requestProtocol.getStatusThresholds.queryFilter()
        );

        onOpenChange(false);
      },
    })
  );

  const saveInspectionApprovalThresholds = useMutation(
    trpc.inspectionApproval.saveStatusThresholds.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        toast.success("Configurações atualizadas com sucesso");

        await queryClient.invalidateQueries(
          trpc.inspectionApproval.getStatusThresholds.queryFilter()
        );

        onOpenChange(false);
      },
    })
  );

  const saveAccessRequestThresholds = useMutation(
    trpc.accessRequest.saveStatusThresholds.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        toast.success("Configurações atualizadas com sucesso");

        await queryClient.invalidateQueries(
          trpc.accessRequest.getStatusThresholds.queryFilter()
        );

        onOpenChange(false);
      },
    })
  );

  const saveArtAccessRequirementThresholds = useMutation(
    trpc.artAccessRequirement.saveStatusThresholds.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        toast.success("Configurações atualizadas com sucesso");

        await queryClient.invalidateQueries(
          trpc.artAccessRequirement.getStatusThresholds.queryFilter()
        );

        onOpenChange(false);
      },
    })
  );

  const saveUtilityInspectionRequestThresholds = useMutation(
    trpc.utilityInspectionRequest.saveStatusThresholds.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        toast.success("Configurações atualizadas com sucesso");

        await queryClient.invalidateQueries(
          trpc.utilityInspectionRequest.getStatusThresholds.queryFilter()
        );

        onOpenChange(false);
      },
    })
  );

  function getSaveThresholdsMutation() {
    if (source === "inspectionApproval") {
      return saveInspectionApprovalThresholds;
    }

    if (source === "accessRequest") {
      return saveAccessRequestThresholds;
    }

    if (source === "artAccessRequirement") {
      return saveArtAccessRequirementThresholds;
    }

    if (source === "utilityInspectionRequest") {
      return saveUtilityInspectionRequestThresholds;
    }

    return saveRequestProtocolThresholds;
  }

  const saveThresholds = getSaveThresholdsMutation();

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

  function onSubmit(data: StatusThresholdsFormInput) {
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
