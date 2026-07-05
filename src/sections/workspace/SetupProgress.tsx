import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  Leaf,
  LockKeyhole,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { CompanyWorkspace, ReportingYear } from "./workspaceData";

type SetupStep = {
  label: string;
  description: string;
  ready: boolean;
  blocked?: boolean;
  icon: LucideIcon;
  to?: string;
};

type NextAction = {
  label: string;
  detail: string;
  to: string;
  icon: LucideIcon;
};

function getReportingYearPath(
  companyId: string,
  siteId: string,
  reportingYearId: string | undefined,
  target: "data" | "ghg-setup",
) {
  return reportingYearId
    ? `/app/${companyId}/sites/${siteId}/reporting-years/${reportingYearId}/${target}`
    : `/app/${companyId}/reporting-years`;
}

function getNextAction({
  activeReportingYear,
  companyId,
  dataRecordCount,
  hasTeamAccess,
  isAdmin,
  siteId,
}: {
  activeReportingYear?: ReportingYear;
  companyId: string;
  dataRecordCount: number;
  hasTeamAccess: boolean;
  isAdmin: boolean;
  siteId: string;
}): NextAction {
  if (!activeReportingYear) {
    return isAdmin
      ? {
          label: "Create reporting year",
          detail: "Start the annual BRSR cycle before configuring fields.",
          icon: CalendarDays,
          to: `/app/${companyId}/reporting-years`,
        }
      : {
          label: "Open workspace",
          detail: "A company admin needs to create the reporting year first.",
          icon: LockKeyhole,
          to: `/app/${companyId}/sites/${siteId}`,
        };
  }

  if (activeReportingYear.selectedGhgActivityCount === 0) {
    return isAdmin
      ? {
          label: "Select GHG activities",
          detail: `${activeReportingYear.label} needs selected activities before data entry.`,
          icon: Leaf,
          to: getReportingYearPath(companyId, siteId, activeReportingYear.id, "ghg-setup"),
        }
      : {
          label: "View selected fields",
          detail: "Data entry will open once an admin selects the company activities.",
          icon: Leaf,
          to: getReportingYearPath(companyId, siteId, activeReportingYear.id, "ghg-setup"),
        };
  }

  if (isAdmin && !hasTeamAccess) {
    return {
      label: "Invite employees",
      detail: "Give contributors access before recurring data collection begins.",
      icon: UserPlus,
      to: `/app/${companyId}/employees`,
    };
  }

  if (dataRecordCount === 0) {
    return {
      label: "Start data entry",
      detail: `Add the first activity record for ${activeReportingYear.label}.`,
      icon: ClipboardList,
      to: getReportingYearPath(companyId, siteId, activeReportingYear.id, "data"),
    };
  }

  return {
    label: "Review data entry",
    detail: `${dataRecordCount} record${dataRecordCount === 1 ? "" : "s"} submitted for ${activeReportingYear.label}.`,
    icon: ClipboardList,
    to: getReportingYearPath(companyId, siteId, activeReportingYear.id, "data"),
  };
}

export function SetupProgress({
  activeReportingYear,
  companyId,
  dataRecordCount,
  isDataRecordCountLoading,
  siteId,
  workspace,
}: {
  activeReportingYear?: ReportingYear;
  companyId: string;
  dataRecordCount: number;
  isDataRecordCountLoading: boolean;
  siteId: string;
  workspace: CompanyWorkspace;
}) {
  const isAdmin = workspace.viewerRole !== "USER";
  const hasReportingYear = Boolean(activeReportingYear);
  const hasGhgActivities = Boolean(activeReportingYear?.selectedGhgActivityCount);
  const hasTeamAccess = workspace.activeMemberCount > 1;
  const hasDataRecords = dataRecordCount > 0;
  const steps: SetupStep[] = [
    {
      label: "Company profile created",
      description: workspace.company.displayName,
      ready: true,
      icon: Building2,
      to: `/app/${companyId}/settings`,
    },
    {
      label: "Reporting year created",
      description: activeReportingYear
        ? `${activeReportingYear.label} is the active workspace year.`
        : "Create the first annual reporting cycle.",
      ready: hasReportingYear,
      icon: CalendarDays,
      to: `/app/${companyId}/reporting-years`,
    },
    {
      label: "GHG activities selected",
      description: activeReportingYear
        ? `${activeReportingYear.selectedGhgActivityCount} activities selected.`
        : "Blocked until a reporting year exists.",
      ready: hasGhgActivities,
      blocked: !hasReportingYear,
      icon: Leaf,
      to: getReportingYearPath(companyId, siteId, activeReportingYear?.id, "ghg-setup"),
    },
    {
      label: "Employees invited",
      description: hasTeamAccess
        ? `${workspace.activeMemberCount} active members have access.`
        : "Invite contributors when data collection needs more people.",
      ready: hasTeamAccess,
      blocked: !hasGhgActivities,
      icon: UserPlus,
      to: `/app/${companyId}/employees`,
    },
    {
      label: "Data entry started",
      description: isDataRecordCountLoading
        ? "Checking submitted records..."
        : hasDataRecords
          ? `${dataRecordCount} record${dataRecordCount === 1 ? "" : "s"} submitted.`
          : "Add the first record for this reporting year.",
      ready: hasDataRecords,
      blocked: !hasGhgActivities,
      icon: ClipboardList,
      to: getReportingYearPath(companyId, siteId, activeReportingYear?.id, "data"),
    },
  ];
  const readyCount = steps.filter((step) => step.ready).length;
  const progress = Math.round((readyCount / steps.length) * 100);
  const nextAction = getNextAction({
    activeReportingYear,
    companyId,
    dataRecordCount,
    hasTeamAccess,
    isAdmin,
    siteId,
  });
  const NextActionIcon = nextAction.icon;

  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-3 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-4 lg:p-5 2xl:p-6">
      <div className="grid gap-3 lg:gap-4 xl:grid-cols-[minmax(0,1fr)_390px] 2xl:grid-cols-[minmax(0,1fr)_450px]">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#426a52] sm:text-sm">Guided setup</p>
              <h2 className="mt-0.5 text-lg font-semibold text-[#142019] sm:mt-1 sm:text-xl">
                {readyCount} of {steps.length} steps ready
              </h2>
            </div>
            <span className="w-fit rounded-md border border-[#cbd9d1] bg-white/65 px-2.5 py-1.5 text-xs font-semibold text-[#52635a] sm:px-3 sm:py-2 sm:text-sm">
              {progress}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dfe9e2] sm:mt-5">
            <div
              className="h-full rounded-full bg-[#2f6b45] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:mt-5 sm:px-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 2xl:grid-cols-5">
            {steps.map((step) => (
              <SetupStepCard key={step.label} step={step} />
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-[#c8d8cd] bg-[#f7faf7]/80 p-3 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#426a52] sm:text-sm">Recommended next</p>
              <h3 className="mt-0.5 text-lg font-semibold text-[#142019] sm:mt-1 sm:text-xl">
                {nextAction.label}
              </h3>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#e7f1eb] text-[#315f42] sm:size-10">
              <NextActionIcon className="size-4 sm:size-5" strokeWidth={1.8} />
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-[#647169] sm:mt-3">{nextAction.detail}</p>

          <Link
            className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none sm:mt-5 sm:h-11"
            to={nextAction.to}
          >
            Continue
            <ArrowRight className="size-4" strokeWidth={1.8} />
          </Link>
        </aside>
      </div>
    </section>
  );
}

function SetupStepCard({ step }: { step: SetupStep }) {
  const Icon = step.icon;
  const status = step.ready ? "Ready" : step.blocked ? "Blocked" : "Next";
  const className = `min-w-[220px] rounded-lg border p-3 transition md:min-w-0 ${
    step.ready
      ? "border-[#bdd3c3] bg-[#edf6ef]"
      : step.blocked
        ? "border-[#ded2b4] bg-[#fbf6e9]"
        : "border-[#d9e2dc] bg-white/60"
  }`;
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`grid size-8 place-items-center rounded-md sm:size-9 ${
            step.ready ? "bg-white/70 text-[#2f6b45]" : "bg-white/65 text-[#315f42]"
          }`}
        >
          <Icon className="size-4" strokeWidth={1.8} />
        </span>
        <span
          className={`grid size-7 place-items-center rounded-full border ${
            step.ready
              ? "border-[#9fc5aa] bg-white/80 text-[#2f6b45]"
              : step.blocked
                ? "border-[#d4be86] bg-white/75 text-[#775d20]"
                : "border-[#d8ded9] bg-white/70 text-[#89948d]"
          }`}
        >
          {step.ready ? (
            <Check className="size-4" strokeWidth={2} />
          ) : step.blocked ? (
            <LockKeyhole className="size-3.5" strokeWidth={2} />
          ) : (
            <ArrowRight className="size-3.5" strokeWidth={2} />
          )}
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <p className="min-w-0 text-sm font-semibold text-[#1e2b23]">{step.label}</p>
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${
            step.ready
              ? "border-[#bdd3c3] bg-white/70 text-[#2f6b45]"
              : step.blocked
                ? "border-[#d4be86] bg-white/75 text-[#775d20]"
                : "border-[#d8ded9] bg-white/70 text-[#52635a]"
          }`}
        >
          {status}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#68756d] md:line-clamp-none">
        {step.description}
      </p>
    </>
  );

  if (!step.to || step.blocked) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link className={`${className} block hover:border-[#9fb5a6] hover:bg-white/75`} to={step.to}>
      {content}
    </Link>
  );
}
