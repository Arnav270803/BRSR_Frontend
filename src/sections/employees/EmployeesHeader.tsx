import { UserPlus } from "lucide-react";
import type { WorkspaceRole } from "../workspace/workspaceData";

type CompanySummary = {
  displayName: string;
  legalName: string;
  status: string;
};

export function EmployeesHeader({
  company,
  viewerRole,
}: {
  company: CompanySummary;
  viewerRole: WorkspaceRole;
}) {
  return (
    <header className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 max-w-4xl">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h1 className="min-w-0 text-2xl leading-tight font-semibold text-[#142019] md:text-3xl 2xl:text-4xl">
              Employees
            </h1>
            <span className="rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2.5 py-1 text-xs font-semibold text-[#2f6b45]">
              {company.status}
            </span>
            <span className="rounded-md border border-[#d1ddd5] bg-white/70 px-2.5 py-1 text-xs font-semibold text-[#56645d]">
              {viewerRole.replace("_", " ")}
            </span>
            <span className="rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2.5 py-1 text-xs font-semibold text-[#2f6b45]">
              Access control
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#5f6d65] 2xl:text-base">
            {company.displayName} / {company.legalName}
          </p>
          <p className="mt-1 max-w-2xl text-wrap text-sm leading-6 break-words text-[#6a756e]">
            Invite admins and users to maintain BRSR data.
          </p>
        </div>

        <a
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none sm:w-auto"
          href="#invite-employee"
          title="Invite employee"
        >
          <UserPlus className="size-4" strokeWidth={1.8} />
          Invite employee
        </a>
      </div>
    </header>
  );
}
