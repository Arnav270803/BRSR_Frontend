import { CalendarCheck2, CalendarDays, CheckCircle2, Leaf } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReportingYearRecord } from "./reportingYearsData";
import { getLatestReportingYear } from "./reportingYearUtils";

export function ReportingYearMetrics({
  reportingYears,
  totalSelectedActivities,
}: {
  reportingYears: ReportingYearRecord[];
  totalSelectedActivities: number;
}) {
  const latestReportingYear = getLatestReportingYear(reportingYears);
  const readyCount = reportingYears.filter(
    (reportingYear) => reportingYear.selectedGhgActivityCount > 0,
  ).length;
  const metrics: Array<{
    label: string;
    value: string;
    tone: string;
    icon: LucideIcon;
  }> = [
    {
      label: "Total years",
      value: String(reportingYears.length),
      tone: "border-[#7da58b]",
      icon: CalendarDays,
    },
    {
      label: "Current year",
      value: latestReportingYear?.label ?? "None",
      tone: "border-[#8f9fc1]",
      icon: CalendarCheck2,
    },
    {
      label: "Selected activities",
      value: String(totalSelectedActivities),
      tone: "border-[#c2a970]",
      icon: Leaf,
    },
    {
      label: "Setup ready",
      value: `${readyCount}/${reportingYears.length}`,
      tone: "border-[#9aa7a0]",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            className={`min-h-28 min-w-0 rounded-lg border border-white/70 border-t-4 ${metric.tone} bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.09)] backdrop-blur-2xl sm:min-h-32 sm:p-5 2xl:min-h-36 2xl:p-6`}
            key={metric.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] leading-4 font-semibold tracking-[0.08em] text-[#65716a] uppercase sm:text-xs sm:tracking-[0.12em]">
                  {metric.label}
                </p>
                <p className="mt-3 truncate text-2xl leading-none font-semibold text-[#142019] sm:text-3xl 2xl:text-4xl">
                  {metric.value}
                </p>
              </div>
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#eef4f0] text-[#315f42] sm:size-10 2xl:size-12">
                <Icon className="size-4 sm:size-5 2xl:size-6" strokeWidth={1.8} />
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

