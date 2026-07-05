import { CalendarRange, CheckCircle2, Leaf, MapPin, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WorkspaceSetup } from "./workspaceData";

function getSetupLabel(setup: WorkspaceSetup) {
  if (
    setup.reportingYearsReady &&
    setup.ghgActivitySelectionReady &&
    setup.fieldConfigurationReady
  ) {
    return "Ready";
  }

  if (setup.reportingYearsReady) {
    return "In progress";
  }

  return "Pending";
}

export function WorkspaceMetricCards({
  activeMemberCount,
  reportingYearCount,
  setup,
  siteCount,
  totalSelectedActivities,
}: {
  activeMemberCount: number;
  reportingYearCount: number;
  setup: WorkspaceSetup;
  siteCount: number;
  totalSelectedActivities: number;
}) {
  const metrics: Array<{
    label: string;
    value: string;
    tone: string;
    icon: LucideIcon;
  }> = [
    {
      label: "Active members",
      value: String(activeMemberCount),
      tone: "border-[#7da58b]",
      icon: UsersRound,
    },
    {
      label: "Sites",
      value: String(siteCount),
      tone: "border-[#8f9fc1]",
      icon: MapPin,
    },
    {
      label: "Reporting years",
      value: String(reportingYearCount),
      tone: "border-[#8f9fc1]",
      icon: CalendarRange,
    },
    {
      label: "Selected activities",
      value: String(totalSelectedActivities),
      tone: "border-[#c2a970]",
      icon: Leaf,
    },
    {
      label: "Setup status",
      value: getSetupLabel(setup),
      tone: "border-[#9aa7a0]",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            className={`min-w-[148px] rounded-lg border border-white/70 border-t-[3px] ${metric.tone} bg-white/55 p-3 shadow-[0_12px_36px_rgba(35,47,38,0.08)] backdrop-blur-2xl lg:min-h-32 lg:min-w-0 lg:border-t-4 lg:p-5 lg:shadow-[0_18px_60px_rgba(35,47,38,0.09)] 2xl:min-h-36 2xl:p-6`}
            key={metric.label}
          >
            <div className="flex items-center justify-between gap-2 lg:items-start lg:gap-3">
              <div className="min-w-0">
                <p className="truncate text-[10px] leading-4 font-semibold tracking-[0.08em] text-[#65716a] uppercase lg:text-xs lg:tracking-[0.12em]">
                  {metric.label}
                </p>
                <p className="mt-1 truncate text-xl leading-none font-semibold text-[#142019] lg:mt-3 lg:text-3xl 2xl:text-4xl">
                  {metric.value}
                </p>
              </div>
              <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#eef4f0] text-[#315f42] lg:size-10 2xl:size-12">
                <Icon className="size-4 lg:size-5 2xl:size-6" strokeWidth={1.8} />
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
