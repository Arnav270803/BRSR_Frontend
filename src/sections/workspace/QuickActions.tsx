import {
  CalendarPlus,
  ClipboardList,
  Leaf,
  Settings2,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { WorkspaceRole } from "./workspaceData";

type Action = {
  label: string;
  detail: string;
  icon: LucideIcon;
  primary?: boolean;
  to: string;
};

function getReportingYearPath(
  companyId: string,
  reportingYearId: string | undefined,
  target: "data" | "ghg-setup",
) {
  return reportingYearId
    ? `/app/${companyId}/reporting-years/${reportingYearId}/${target}`
    : `/app/${companyId}/reporting-years`;
}

function getAdminActions(companyId: string, reportingYearId?: string): Action[] {
  return [
    {
      label: "Create reporting year",
      detail: "Annual setup",
      icon: CalendarPlus,
      primary: true,
      to: `/app/${companyId}/reporting-years`,
    },
    {
      label: "Select GHG activities",
      detail: "Field configuration",
      icon: Leaf,
      to: getReportingYearPath(companyId, reportingYearId, "ghg-setup"),
    },
    {
      label: "Invite employees",
      detail: "Company access",
      icon: UserPlus,
      to: `/app/${companyId}/employees`,
    },
    {
      label: "Review data entry",
      detail: "Submitted records",
      icon: ClipboardList,
      to: getReportingYearPath(companyId, reportingYearId, "data"),
    },
  ];
}

function getUserActions(companyId: string, reportingYearId?: string): Action[] {
  return [
    {
      label: "Add BRSR data",
      detail: "Data entry",
      icon: ClipboardList,
      primary: true,
      to: getReportingYearPath(companyId, reportingYearId, "data"),
    },
    {
      label: "View selected fields",
      detail: "Assigned activities",
      icon: Leaf,
      to: getReportingYearPath(companyId, reportingYearId, "ghg-setup"),
    },
    {
      label: "Workspace settings",
      detail: "Read only",
      icon: Settings2,
      to: `/app/${companyId}/settings`,
    },
  ];
}

export function QuickActions({
  companyId,
  defaultReportingYearId,
  viewerRole,
}: {
  companyId: string;
  defaultReportingYearId?: string;
  viewerRole: WorkspaceRole;
}) {
  const actions =
    viewerRole === "USER"
      ? getUserActions(companyId, defaultReportingYearId)
      : getAdminActions(companyId, defaultReportingYearId);

  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Quick actions</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">Next work</h2>
        </div>
        <span className="w-fit rounded-md border border-[#d5dfd8] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#5f6f66]">
          {viewerRole.replace("_", " ")}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              className={`flex min-h-16 w-full items-center gap-3 rounded-md border px-3 text-left shadow-sm transition focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none sm:px-4 2xl:min-h-[72px] ${
                action.primary
                  ? "border-[#24563a] bg-[#1f5135] text-white hover:bg-[#183f2a]"
                  : "border-[#d4dfd8] bg-white/65 text-[#17221b] hover:border-[#aebfb4] hover:bg-white"
              }`}
              key={action.label}
              title={action.label}
              to={action.to}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-md sm:size-10 ${
                  action.primary ? "bg-white/15" : "bg-[#eef4f0]"
                }`}
              >
                <Icon className="size-4 sm:size-5" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{action.label}</span>
                <span
                  className={`mt-1 block text-xs ${
                    action.primary ? "text-white/75" : "text-[#6a756e]"
                  }`}
                >
                  {action.detail}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
