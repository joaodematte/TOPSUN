import { CitySummaryCard } from "@/features/dashboard/components/city-summary-card";
import { ProjectStatusCards } from "@/features/dashboard/components/project-status-cards";
import { RepresentativeSummaryCard } from "@/features/technical-inspection-validation/components/representative-summary-card";
import { TechnicalInspectionValidationTable } from "@/features/technical-inspection-validation/components/technical-inspection-validation-table";

export function TechnicalInspectionValidationPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ProjectStatusCards source="technicalInspectionValidation" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <RepresentativeSummaryCard />

        <CitySummaryCard source="technicalInspectionValidation" />
      </div>

      <TechnicalInspectionValidationTable />
    </div>
  );
}
