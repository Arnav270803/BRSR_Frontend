import { Building2, Globe2, MapPin, CalendarClock, Factory } from "lucide-react";
import type { CompanyWorkspace } from "../workspace/workspaceData";
import { getFinancialYearStartLabel } from "./settingsUtils";

type ProfileItem = {
  label: string;
  value: string;
};

export function CompanyProfilePanel({ workspace }: { workspace: CompanyWorkspace }) {
  const profileItems: ProfileItem[] = [
    { label: "Legal name", value: workspace.company.legalName },
    { label: "Display name", value: workspace.company.displayName },
    { label: "Primary domain", value: workspace.company.primaryDomain },
    { label: "Industry", value: workspace.company.industry },
    {
      label: "Location",
      value: `${workspace.company.city}, ${workspace.company.state}, ${workspace.company.country}`,
    },
    {
      label: "Financial year starts",
      value: getFinancialYearStartLabel(workspace.company.financialYearStartMonth),
    },
  ];

  return (
    <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.09)] backdrop-blur-2xl sm:p-5 xl:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2f6d48]">Company profile</p>
          <h2 className="mt-1 text-xl font-semibold text-[#18251d]">Registered workspace details</h2>
        </div>
        <span className="w-fit rounded-md border border-[#d7e0da] bg-white/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6f7c74]">
          From workspace API
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {profileItems.map((item) => (
          <div className="rounded-lg border border-[#dbe5df] bg-white/45 p-4" key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7a887f]">
              {item.label}
            </p>
            <p className="mt-3 break-words text-base font-semibold leading-6 text-[#1d2b22]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Identity", icon: Building2, value: workspace.company.status },
          { label: "Domain", icon: Globe2, value: workspace.company.primaryDomain },
          { label: "Location", icon: MapPin, value: workspace.company.city },
          { label: "Cycle", icon: CalendarClock, value: "Annual BRSR" },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              className="flex min-w-0 items-center gap-3 rounded-lg border border-[#dbe5df] bg-[#f8faf7]/70 p-3"
              key={item.label}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf5f0] text-[#2f6d48]">
                <Icon className="size-4" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-[#75827a]">{item.label}</p>
                <p className="truncate text-sm font-semibold text-[#233027]">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#dbe5df] bg-[#f8faf7]/70 p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf5f0] text-[#2f6d48]">
          <Factory className="size-4" strokeWidth={1.8} />
        </span>
        <p className="text-sm leading-6 text-[#637168]">
          Profile editing should be added only after the backend gets a company update API. Until
          then, this page stays aligned with the current workspace response.
        </p>
      </div>
    </section>
  );
}
