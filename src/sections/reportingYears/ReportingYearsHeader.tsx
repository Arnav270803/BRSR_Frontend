import { CalendarPlus, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import type { WorkspaceRole } from "../workspace/workspaceData";

type CompanySummary = {
  displayName: string;
  legalName: string;
  status: string;
  financialYearStartMonth: number;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ReportingYearsHeader({
  canCreateReportingYear,
  company,
  companyId,
  defaultReportingYearId,
  viewerRole,
}: {
  canCreateReportingYear: boolean;
  company: CompanySummary;
  companyId: string;
  defaultReportingYearId?: string;
  viewerRole: WorkspaceRole;
}) {
  const dataEntryPath = defaultReportingYearId
    ? `/app/${companyId}/reporting-years/${defaultReportingYearId}/data`
    : `/app/${companyId}/reporting-years`;

  return (
    <header className="rounded-lg border border-white/70 bg-white/55 p-3 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-7">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl leading-tight font-semibold text-[#142019] sm:text-2xl md:text-3xl 2xl:text-4xl">
              Reporting years
            </h1>
            <span className="rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2.5 py-1 text-xs font-semibold text-[#2f6b45]">
              {company.status}
            </span>
            <span className="rounded-md border border-[#d1ddd5] bg-white/70 px-2.5 py-1 text-xs font-semibold text-[#56645d]">
              {viewerRole.replace("_", " ")}
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-[#5f6d65] sm:mt-2 2xl:text-base">
            {company.displayName} / {company.legalName}
          </p>
          <p className="mt-1 text-sm leading-6 text-[#6a756e]">
            Financial year starts in {monthNames[company.financialYearStartMonth - 1]}.
          </p>
        </div>

        <div className="grid gap-2 sm:flex sm:flex-row sm:gap-3">
          {canCreateReportingYear ? (
            <a
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#cdd9d1] bg-white/70 px-4 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none sm:h-11 sm:w-auto"
              href="#create-reporting-year"
              title="Create reporting year"
            >
              <CalendarPlus className="size-4" strokeWidth={1.8} />
              Create year
            </a>
          ) : null}
          <Link
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none sm:h-11 sm:w-auto"
            title="Open data entry"
            to={dataEntryPath}
          >
            <ClipboardList className="size-4" strokeWidth={1.8} />
            Data entry
          </Link>
        </div>
      </div>
    </header>
  );
}
