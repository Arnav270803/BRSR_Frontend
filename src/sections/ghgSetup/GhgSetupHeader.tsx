import { ClipboardList, Save } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReportingYearRecord } from "../reportingYears/reportingYearsData";
import type { WorkspaceRole } from "../workspace/workspaceData";

type CompanySummary = {
  id: string;
  displayName: string;
  legalName: string;
  status: string;
};

export function GhgSetupHeader({
  canEdit,
  company,
  hasUnsavedChanges,
  reportingYear,
  saveSelections,
  siteId,
  viewerRole,
}: {
  canEdit: boolean;
  company: CompanySummary;
  hasUnsavedChanges: boolean;
  reportingYear: ReportingYearRecord;
  saveSelections: () => void;
  siteId?: string;
  viewerRole: WorkspaceRole;
}) {
  const dataEntryPath = siteId
    ? `/app/${company.id}/sites/${siteId}/reporting-years/${reportingYear.id}/data`
    : `/app/${company.id}/reporting-years/${reportingYear.id}/data`;

  return (
    <header className="rounded-lg border border-white/70 bg-white/55 p-3 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-7">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
        <div className="min-w-0 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl leading-tight font-semibold text-[#142019] sm:text-2xl md:text-3xl 2xl:text-4xl">
              GHG setup
            </h1>
            <span className="rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2.5 py-1 text-xs font-semibold text-[#2f6b45]">
              {reportingYear.label}
            </span>
            <span className="rounded-md border border-[#d1ddd5] bg-white/70 px-2.5 py-1 text-xs font-semibold text-[#56645d]">
              {viewerRole.replace("_", " ")}
            </span>
            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                hasUnsavedChanges
                  ? "border-[#ded2b4] bg-[#fbf6e9] text-[#775d20]"
                  : "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
              }`}
            >
              {hasUnsavedChanges ? "Unsaved" : "Saved"}
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-[#5f6d65] sm:mt-2 2xl:text-base">
            {company.displayName} / {company.legalName}
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6a756e]">
            Select the activities that apply to this reporting year before data entry.
          </p>
        </div>

        <div className="grid gap-2 sm:flex sm:flex-row sm:gap-3">
          {canEdit ? (
            <button
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#cdd9d1] bg-white/70 px-4 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none sm:h-11 sm:w-auto"
              onClick={saveSelections}
              title="Save GHG activity selections"
              type="button"
            >
              <Save className="size-4" strokeWidth={1.8} />
              Save setup
            </button>
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
