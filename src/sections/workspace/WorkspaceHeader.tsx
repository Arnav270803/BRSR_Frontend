import { ClipboardList, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import type { CompanyWorkspace } from "./workspaceData";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function WorkspaceHeader({ workspace }: { workspace: CompanyWorkspace }) {
  const { company, viewerRole } = workspace;
  const canManageAccess = viewerRole !== "USER";
  const defaultReportingYearId = workspace.reportingYears[0]?.id;
  const dataEntryPath = defaultReportingYearId
    ? `/app/${company.id}/reporting-years/${defaultReportingYearId}/data`
    : `/app/${company.id}/reporting-years`;
  const companyDetails = [
    company.primaryDomain,
    company.industry,
    `${company.city}, ${company.state}`,
  ];

  return (
    <header className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-[#cbd9d1] bg-[#1f5135] text-base font-semibold text-white shadow-sm sm:size-14 sm:text-lg 2xl:size-16 2xl:text-xl">
            {getInitials(company.displayName)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="min-w-0 text-xl leading-tight font-semibold text-[#142019] sm:text-2xl md:text-3xl 2xl:text-4xl">
                {company.displayName}
              </h1>
              <span className="rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2.5 py-1 text-xs font-semibold text-[#2f6b45]">
                {company.status}
              </span>
              <span className="rounded-md border border-[#d1ddd5] bg-white/70 px-2.5 py-1 text-xs font-semibold text-[#56645d]">
                {viewerRole.replace("_", " ")}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#5f6d65] 2xl:text-base">
              {company.legalName}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {companyDetails.map((detail) => (
                <span
                  className="rounded-md border border-[#d8e2dc] bg-white/55 px-2.5 py-1 text-xs font-medium text-[#637069] 2xl:text-sm"
                  key={detail}
                >
                  {detail}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:flex sm:flex-row sm:gap-3 xl:justify-end">
          {canManageAccess ? (
            <Link
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[#cdd9d1] bg-white/70 px-4 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none sm:w-auto"
              title="Invite employees"
              to={`/app/${company.id}/employees`}
            >
              <UserPlus className="size-4" strokeWidth={1.8} />
              Invite
            </Link>
          ) : null}
          <Link
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none sm:w-auto"
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
