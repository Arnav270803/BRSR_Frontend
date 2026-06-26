import { CalendarDays, CheckCircle2, Users, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CompanyWorkspace } from "../workspace/workspaceData";
import { getCompletedSetupCount, getSetupStatusLabel } from "./settingsUtils";

type Metric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function SettingsMetrics({ workspace }: { workspace: CompanyWorkspace }) {
  const metrics: Metric[] = [
    {
      label: "Workspace status",
      value: getSetupStatusLabel(workspace.setup),
      detail: `${getCompletedSetupCount(workspace.setup)} of 3 setup checks`,
      icon: CheckCircle2,
    },
    {
      label: "Active members",
      value: String(workspace.activeMemberCount),
      detail: "Company users with access",
      icon: Users,
    },
    {
      label: "Reporting years",
      value: String(workspace.reportingYears.length),
      detail: "Active company cycles",
      icon: CalendarDays,
    },
    {
      label: "Selected activities",
      value: String(
        workspace.reportingYears.reduce(
          (total, reportingYear) => total + reportingYear.selectedGhgActivityCount,
          0,
        ),
      ),
      detail: "Across active years",
      icon: Workflow,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 xl:gap-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <article
            className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_14px_50px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5"
            key={metric.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8980]">
                  {metric.label}
                </p>
                <p className="mt-3 text-2xl font-semibold leading-none text-[#17231c]">
                  {metric.value}
                </p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#edf5f0] text-[#2f6d48]">
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6a776f]">{metric.detail}</p>
          </article>
        );
      })}
    </section>
  );
}
