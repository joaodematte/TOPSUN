import { ArtAccessRequirementTable } from "@/features/art-access-requirement/components/art-access-requirement-table";
import { CitySummaryCard } from "@/features/dashboard/components/city-summary-card";
import { ProjectStatusCards } from "@/features/dashboard/components/project-status-cards";
import { UtilitySummaryCard } from "@/features/dashboard/components/utility-summary-card";

export function ArtAccessRequirementPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ProjectStatusCards source="artAccessRequirement" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <UtilitySummaryCard source="artAccessRequirement" />

        <CitySummaryCard source="artAccessRequirement" />
      </div>

      <ArtAccessRequirementTable />
    </div>
  );
}
