import {
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Leaf,
  MapPin,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CompanySite, ReportingYear, WorkspaceRole } from "./workspaceData";

export type WorkspaceNavKey =
  | "dashboard"
  | "reportingYears"
  | "ghgSetup"
  | "dataEntry"
  | "reports"
  | "sites"
  | "employees"
  | "settings";

type NavItem = {
  key: WorkspaceNavKey;
  label: string;
  icon: LucideIcon;
  to?: string;
};

function getNavigation(viewerRole: WorkspaceRole, companyId: string): NavItem[] {
  const adminNavigation: NavItem[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: `/app/${companyId}` },
    {
      key: "reportingYears",
      label: "Reporting years",
      icon: CalendarDays,
      to: `/app/${companyId}/reporting-years`,
    },
    { key: "ghgSetup", label: "GHG setup", icon: Leaf },
    { key: "dataEntry", label: "Data entry", icon: ClipboardList },
    { key: "reports", label: "Reports", icon: FileText, to: `/app/${companyId}/reports` },
    { key: "sites", label: "Sites", icon: MapPin, to: `/app/${companyId}/sites` },
    { key: "employees", label: "Employees", icon: Users, to: `/app/${companyId}/employees` },
    { key: "settings", label: "Settings", icon: Settings, to: `/app/${companyId}/settings` },
  ];

  const userNavigation: NavItem[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: `/app/${companyId}` },
    { key: "dataEntry", label: "Data entry", icon: ClipboardList },
    { key: "reports", label: "Reports", icon: FileText, to: `/app/${companyId}/reports` },
    { key: "sites", label: "Sites", icon: MapPin, to: `/app/${companyId}/sites` },
    { key: "settings", label: "Settings", icon: Settings, to: `/app/${companyId}/settings` },
  ];

  if (viewerRole === "USER") {
    return userNavigation;
  }

  return adminNavigation;
}

export function WorkspaceSidebar({
  activeItem,
  companyId,
  companyName,
  currentSiteId,
  currentReportingYearId,
  reportingYears,
  sites = [],
  viewerRole,
}: {
  activeItem: WorkspaceNavKey;
  companyId: string;
  companyName: string;
  currentSiteId?: string;
  currentReportingYearId?: string;
  reportingYears: ReportingYear[];
  sites?: CompanySite[];
  viewerRole: WorkspaceRole;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const activeSite = sites.find((site) => site.id === currentSiteId) ?? sites[0];
  const activeReportingYear =
    reportingYears.find((reportingYear) => reportingYear.id === currentReportingYearId) ??
    reportingYears[0];
  const reportingYearIdForLinks = activeReportingYear?.id;
  const navigation = getNavigation(viewerRole, companyId).map((item) => {
    if (item.key === "dashboard") {
      return {
        ...item,
        to: activeSite ? `/app/${companyId}/sites/${activeSite.id}` : item.to,
      };
    }

    if (item.key === "ghgSetup") {
      return {
        ...item,
        to: reportingYearIdForLinks
          ? activeSite
            ? `/app/${companyId}/sites/${activeSite.id}/reporting-years/${reportingYearIdForLinks}/ghg-setup`
            : `/app/${companyId}/reporting-years/${reportingYearIdForLinks}/ghg-setup`
          : `/app/${companyId}/reporting-years`,
      };
    }

    if (item.key === "dataEntry") {
      return {
        ...item,
        to: reportingYearIdForLinks
          ? activeSite
            ? `/app/${companyId}/sites/${activeSite.id}/reporting-years/${reportingYearIdForLinks}/data`
            : `/app/${companyId}/reporting-years/${reportingYearIdForLinks}/data`
          : `/app/${companyId}/reporting-years`,
      };
    }

    if (item.key === "reports") {
      return {
        ...item,
        to: activeSite
          ? `/app/${companyId}/sites/${activeSite.id}/reports`
          : `/app/${companyId}/reports`,
      };
    }

    return item;
  });
  const hasReportingYears = reportingYears.length > 0;
  const hasSites = sites.length > 0;
  const activeNavItem = navigation.find((item) => item.key === activeItem);

  function getReportingYearRoute(reportingYearId: string) {
    if (activeItem === "ghgSetup") {
      return activeSite
        ? `/app/${companyId}/sites/${activeSite.id}/reporting-years/${reportingYearId}/ghg-setup`
        : `/app/${companyId}/reporting-years/${reportingYearId}/ghg-setup`;
    }

    if (activeItem === "reports") {
      return activeSite
        ? `/app/${companyId}/sites/${activeSite.id}/reports?year=${reportingYearId}`
        : `/app/${companyId}/reports?year=${reportingYearId}`;
    }

    return activeSite
      ? `/app/${companyId}/sites/${activeSite.id}/reporting-years/${reportingYearId}/data`
      : `/app/${companyId}/reporting-years/${reportingYearId}/data`;
  }

  function getSiteRoute(siteId: string) {
    if (activeItem === "ghgSetup" && activeReportingYear) {
      return `/app/${companyId}/sites/${siteId}/reporting-years/${activeReportingYear.id}/ghg-setup`;
    }

    if (activeItem === "dataEntry" && activeReportingYear) {
      return `/app/${companyId}/sites/${siteId}/reporting-years/${activeReportingYear.id}/data`;
    }

    if (activeItem === "reports") {
      const yearQuery = activeReportingYear ? `?year=${activeReportingYear.id}` : "";
      return `/app/${companyId}/sites/${siteId}/reports${yearQuery}`;
    }

    return `/app/${companyId}/sites/${siteId}`;
  }

  return (
    <>
      <header className="sticky top-2 z-30 rounded-lg border border-white/75 bg-white/70 p-2.5 shadow-[0_14px_44px_rgba(35,47,38,0.14)] backdrop-blur-2xl lg:hidden">
        <div className="flex items-center gap-2">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#1f5135] text-white">
            <Building2 className="size-5" strokeWidth={1.8} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#142019]">ESG Workspace</p>
            <p className="truncate text-xs text-[#68756d]">
              {companyName}
              {activeSite ? ` / ${activeSite.name}` : ""}
              {activeReportingYear ? ` / ${activeReportingYear.label}` : ""}
            </p>
          </div>
          <button
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close workspace menu" : "Open workspace menu"}
            className="grid size-10 shrink-0 place-items-center rounded-md border border-[#cdd9d1] bg-white/80 text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none"
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" strokeWidth={1.8} />
            ) : (
              <Menu className="size-5" strokeWidth={1.8} />
            )}
          </button>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          {hasSites ? (
            <label className="min-w-0">
              <span className="sr-only">Switch site</span>
              <select
                className="h-10 w-full rounded-md border border-[#d2ded6] bg-white/80 px-2 text-xs font-semibold text-[#16211b] shadow-sm outline-none transition focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
                value={activeSite?.id}
                onChange={(event) => navigate(getSiteRoute(event.target.value))}
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <Link
              className="inline-flex h-10 min-w-0 items-center justify-center rounded-md border border-[#cdd9d1] bg-white/75 px-2 text-xs font-semibold text-[#1d2a22]"
              to={`/app/${companyId}/sites`}
            >
              Create site
            </Link>
          )}

          {hasReportingYears ? (
            <label className="min-w-0">
              <span className="sr-only">Switch reporting year</span>
              <select
                className="h-10 w-full rounded-md border border-[#d2ded6] bg-white/80 px-2 text-xs font-semibold text-[#16211b] shadow-sm outline-none transition focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
                value={activeReportingYear?.id}
                onChange={(event) => navigate(getReportingYearRoute(event.target.value))}
              >
                {reportingYears.map((reportingYear) => (
                  <option key={reportingYear.id} value={reportingYear.id}>
                    {reportingYear.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <Link
              className="inline-flex h-10 min-w-0 items-center justify-center rounded-md border border-[#cdd9d1] bg-white/75 px-2 text-xs font-semibold text-[#1d2a22]"
              to={`/app/${companyId}/reporting-years`}
            >
              Create year
            </Link>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-[#d9e2dc] bg-white/55 px-3 py-2">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-[#69756e] uppercase">
            Current
          </span>
          <span className="truncate text-sm font-semibold text-[#183f2a]">
            {activeNavItem?.label ?? "Workspace"}
          </span>
        </div>

        {isMobileMenuOpen ? (
          <nav className="mt-2 grid gap-1.5 rounded-lg border border-[#d9e2dc] bg-white/70 p-2 shadow-sm">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === activeItem;
              const className = `flex h-10 min-w-0 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none ${
                isActive
                  ? "border-[#bdd3c3] bg-[#edf6ef] text-[#183f2a]"
                  : "border-transparent text-[#66736b] hover:border-[#d7e0da] hover:bg-white/80 hover:text-[#26342b]"
              }`;
              const content = (
                <>
                  <Icon className="size-4 shrink-0" strokeWidth={1.8} />
                  <span className="min-w-0 truncate">{item.label}</span>
                </>
              );

              if (item.to) {
                return (
                  <Link
                    className={className}
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button className={className} key={item.label} type="button">
                  {content}
                </button>
              );
            })}
          </nav>
        ) : null}
      </header>

      <aside className="hidden rounded-lg border border-[#dfe8e2] bg-white/70 p-3 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-4 lg:sticky lg:top-4 lg:flex lg:max-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-2rem)] lg:w-72 lg:shrink-0 lg:flex-col lg:overflow-y-auto xl:w-80 2xl:w-[340px] 2xl:p-5">
      <div className="flex items-center gap-3 border-b border-[#dce5df] pb-3 sm:pb-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#1f5135] text-white sm:size-10">
          <Building2 className="size-5" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#142019]">ESG Workspace</p>
          <p className="truncate text-xs text-[#68756d]">{companyName}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-[#d9e2dc] bg-white/45 p-3 sm:mt-4 2xl:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#69756e] uppercase">
              Active site
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-[#1e2b23]">
              {activeSite?.name ?? "No site created"}
            </p>
          </div>
          <MapPin className="mt-0.5 size-4 shrink-0 text-[#426a52]" strokeWidth={1.8} />
        </div>

        {hasSites ? (
          <label className="mt-3 block">
            <span className="sr-only">Switch site</span>
            <select
              className="h-10 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 text-sm font-semibold text-[#16211b] shadow-sm outline-none transition focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
              value={activeSite?.id}
              onChange={(event) => navigate(getSiteRoute(event.target.value))}
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="mt-3 text-xs leading-5 text-[#65716a]">
            Create a site before configuring data.
          </p>
        )}
      </div>

      <div className="mt-3 rounded-lg border border-[#d9e2dc] bg-white/45 p-3 sm:mt-4 2xl:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#69756e] uppercase">
              Active year
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-[#1e2b23]">
              {activeReportingYear?.label ?? "No year created"}
            </p>
          </div>
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#426a52]" strokeWidth={1.8} />
        </div>

        {hasReportingYears ? (
          <label className="mt-3 block">
            <span className="sr-only">Switch reporting year</span>
            <select
              className="h-10 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 text-sm font-semibold text-[#16211b] shadow-sm outline-none transition focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
              value={activeReportingYear?.id}
              onChange={(event) => navigate(getReportingYearRoute(event.target.value))}
            >
              {reportingYears.map((reportingYear) => (
                <option key={reportingYear.id} value={reportingYear.id}>
                  {reportingYear.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <Link
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-md border border-[#cdd9d1] bg-white/70 px-3 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none"
            to={`/app/${companyId}/reporting-years`}
          >
            Create reporting year
          </Link>
        )}
      </div>

      <nav className="mt-3 grid gap-2 rounded-lg border border-[#d9e2dc] bg-white/45 p-2 sm:mt-4 lg:flex lg:flex-col 2xl:gap-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeItem;
          const className = `flex h-10 min-w-0 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none sm:h-11 sm:gap-3 lg:w-full 2xl:h-12 2xl:px-4 ${
            isActive
              ? "border-[#b9cec1] bg-[#eef7f1]/85 text-[#183f2a]"
              : "border-transparent text-[#66736b] hover:border-[#d7e0da] hover:bg-white/55 hover:text-[#26342b]"
          }`;

          const content = (
            <>
              <Icon className="size-4 shrink-0" strokeWidth={1.8} />
              <span className="min-w-0 truncate">{item.label}</span>
            </>
          );

          if (item.to) {
            return (
              <Link className={className} key={item.label} title={item.label} to={item.to}>
                {content}
              </Link>
            );
          }

          return (
            <button className={className} key={item.label} title={item.label} type="button">
              {content}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 hidden rounded-lg border border-[#d9e2dc] bg-white/45 p-4 text-sm text-[#65716a] lg:mt-auto lg:block">
        <p className="font-semibold text-[#243128]">Role access</p>
        <p className="mt-2 leading-6">
          {viewerRole === "USER"
            ? "Data entry access"
            : "Company setup and data access"}
        </p>
      </div>
      </aside>
    </>
  );
}
