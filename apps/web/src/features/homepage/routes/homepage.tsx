import { HomepageAutomationCards } from "@/features/homepage/components/homepage-automation-cards";
import { HomepageOverviewCards } from "@/features/homepage/components/homepage-overview-cards";
import { HomepageStageInsightsGrid } from "@/features/homepage/components/homepage-stage-insights-grid";
import { useHomepageAutomations } from "@/features/homepage/hooks/use-homepage-automations";
import { useHomepageInsights } from "@/features/homepage/hooks/use-homepage-insights";

export function Homepage() {
  const {
    globalInsight,
    isLoading: isInsightsLoading,
    stages,
  } = useHomepageInsights();
  const { automations } = useHomepageAutomations();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Visão geral</h1>
        <p className="text-muted-foreground text-sm">
          Insights consolidados dos resumos e automações do TOPSUN
        </p>
      </div>

      <HomepageOverviewCards
        globalInsight={globalInsight}
        isLoading={isInsightsLoading}
      />

      <HomepageStageInsightsGrid stages={stages} />

      <HomepageAutomationCards automations={automations} />
    </div>
  );
}
