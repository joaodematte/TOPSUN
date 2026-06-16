import { CompletionValidationTable } from "@/features/completion-validation/components/completion-validation-table";
import { CitySummaryCard } from "@/features/dashboard/components/city-summary-card";
import { ProjectStatusCards } from "@/features/dashboard/components/project-status-cards";
import { InstallerSummaryCard } from "@/features/installation-completion/components/installer-summary-card";

export function CompletionValidationPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ProjectStatusCards source="completionValidation" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <InstallerSummaryCard source="completionValidation" />

        <CitySummaryCard source="completionValidation" />
      </div>

      <CompletionValidationTable />
    </div>
  );
}
