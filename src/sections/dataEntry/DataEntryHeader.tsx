import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReportingYearRecord } from "../reportingYears/reportingYearsData";
import type { WorkspaceRole } from "../workspace/workspaceData";

type CompanySummary = {
  id: string;
  displayName: string;
  legalName: string;
};

export function DataEntryHeader({
  company,
  reportingYear,
  selectedActivityCount,
  siteId,
  viewerRole,
}: {
  company: CompanySummary;
  reportingYear: ReportingYearRecord;
  selectedActivityCount: number;
  siteId?: string;
  viewerRole: WorkspaceRole;
}) {
  const ghgSetupPath = siteId
    ? `/app/${company.id}/sites/${siteId}/reporting-years/${reportingYear.id}/ghg-setup`
    : `/app/${company.id}/reporting-years/${reportingYear.id}/ghg-setup`;

  return (
    <header className="rounded-lg border border-white/70 bg-white/55 p-3 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-7">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
        <div className="min-w-0 max-w-4xl">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h1 className="min-w-0 text-xl leading-tight font-semibold text-[#142019] sm:text-2xl md:text-3xl 2xl:text-4xl">
              Data entry
            </h1>
            <span className="rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2.5 py-1 text-xs font-semibold text-[#2f6b45]">
              {reportingYear.label}
            </span>
            <span className="rounded-md border border-[#d1ddd5] bg-white/70 px-2.5 py-1 text-xs font-semibold text-[#56645d]">
              {viewerRole.replace("_", " ")}
            </span>
            <span className="max-w-full rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2.5 py-1 text-xs font-semibold text-[#2f6b45]">
              {selectedActivityCount} fields
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-[#5f6d65] sm:mt-2 2xl:text-base">
            {company.displayName} / {company.legalName}
          </p>
          <p className="mt-1 max-w-2xl text-wrap text-sm leading-6 break-words text-[#6a756e]">
            Enter quantities for selected GHG activities and review calculated kg CO2e.
          </p>
        </div>

        <Link
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#cdd9d1] bg-white/70 px-4 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none sm:h-11 sm:w-auto"
          title="Open GHG setup"
          to={ghgSetupPath}
        >
          <Leaf className="size-4" strokeWidth={1.8} />
          GHG setup
        </Link>
      </div>
    </header>
  );
}
