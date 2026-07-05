import { CalendarDays, FileCheck2 } from "lucide-react";
import type { ReportingYear } from "../workspace/workspaceData";
import { formatReportDate } from "./reportsUtils";

type ReportControlsProps = {
  reportingYears: ReportingYear[];
  selectedReportingYearId: string;
  isGenerating: boolean;
  generatedReportingYearId?: string;
  onReportingYearChange: (reportingYearId: string) => void;
  onGenerate: () => void;
};

export function ReportControls({
  reportingYears,
  selectedReportingYearId,
  isGenerating,
  generatedReportingYearId,
  onReportingYearChange,
  onGenerate,
}: ReportControlsProps) {
  const selectedYear = reportingYears.find((year) => year.id === selectedReportingYearId);
  const hasGeneratedSelectedYear = generatedReportingYearId === selectedReportingYearId;

  return (
    <section className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <label className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-[#718079] uppercase">
              Reporting year
            </span>
            <select
              className="mt-2 h-12 w-full rounded-md border border-[#d3ded7] bg-white/80 px-3 text-sm font-semibold text-[#16211b] shadow-sm outline-none transition focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
              value={selectedReportingYearId}
              onChange={(event) => onReportingYearChange(event.target.value)}
            >
              {reportingYears.map((reportingYear) => (
                <option key={reportingYear.id} value={reportingYear.id}>
                  {reportingYear.label}
                </option>
              ))}
            </select>
          </label>

          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#173f2a] bg-[#1f5135] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17442c] disabled:cursor-not-allowed disabled:border-[#b9c8bf] disabled:bg-[#d7e2dc] disabled:text-[#6d7b72] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none"
            disabled={!selectedReportingYearId || isGenerating}
            type="button"
            onClick={onGenerate}
          >
            <FileCheck2 className="size-4" strokeWidth={1.8} />
            {isGenerating
              ? "Generating"
              : hasGeneratedSelectedYear
                ? "Regenerate report"
                : "Generate report"}
          </button>
        </div>
      </div>

      <aside className="rounded-lg border border-white/70 bg-white/45 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eef7f1] text-[#2d7347]">
            <CalendarDays className="size-5" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#718079] uppercase">
              Selected cycle
            </p>
            <p className="mt-2 text-lg font-semibold text-[#17231d]">
              {selectedYear?.label ?? "No year selected"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#65736b]">
              {selectedYear
                ? `${formatReportDate(selectedYear.startDate)} to ${formatReportDate(selectedYear.endDate)}`
                : "Create a reporting year before generating a report."}
            </p>
          </div>
        </div>
      </aside>
    </section>
  );
}
