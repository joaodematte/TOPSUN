import { CitySummaryCard } from "@/features/dashboard/components/city-summary-card";
import { ProjectStatusCards } from "@/features/dashboard/components/project-status-cards";
import { UtilitySummaryCard } from "@/features/dashboard/components/utility-summary-card";
import { UtilityInspectionRequestTable } from "@/features/utility-inspection-request/components/utility-inspection-request-table";

export function UtilityInspectionRequestPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ProjectStatusCards source="utilityInspectionRequest" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <UtilitySummaryCard source="utilityInspectionRequest" />

        <CitySummaryCard source="utilityInspectionRequest" />
      </div>

      <UtilityInspectionRequestTable />
    </div>
  );
}
