import { ArrowRight, ClipboardList, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReportingYearRecord } from "./reportingYearsData";
import { formatDate, getReportingYearStatus } from "./reportingYearUtils";

export function ReportingYearsList({
  canManageSetup,
  companyId,
  reportingYears,
}: {
  canManageSetup: boolean;
  companyId: string;
  reportingYears: ReportingYearRecord[];
}) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Reporting years</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">Company cycles</h2>
        </div>
        <span className="w-fit rounded-md border border-[#d5dfd8] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#5f6f66]">
          {reportingYears.length} active
        </span>
      </div>

      {reportingYears.length > 0 ? (
        <>
          <div className="mt-5 grid gap-3 lg:hidden">
            {reportingYears.map((reportingYear) => (
              <ReportingYearCard
                canManageSetup={canManageSetup}
                companyId={companyId}
                key={reportingYear.id}
                reportingYear={reportingYear}
              />
            ))}
          </div>

          <div className="mt-5 hidden overflow-hidden rounded-lg border border-[#d9e2dc] bg-white/55 lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#d9e2dc] bg-[#f3f7f4]/80 text-xs font-semibold tracking-[0.12em] text-[#65716a] uppercase">
                    <th className="px-4 py-3 2xl:px-5">Year</th>
                    <th className="px-4 py-3 2xl:px-5">Period</th>
                    <th className="px-4 py-3 2xl:px-5">GHG activities</th>
                    <th className="px-4 py-3 2xl:px-5">Status</th>
                    <th className="px-4 py-3 text-right 2xl:px-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e8e2] text-sm">
                  {reportingYears.map((reportingYear) => {
                    const status = getReportingYearStatus(reportingYear);

                    return (
                      <tr className="text-[#253229]" key={reportingYear.id}>
                        <td className="px-4 py-4 font-semibold 2xl:px-5">
                          {reportingYear.label}
                        </td>
                        <td className="px-4 py-4 text-[#5f6d65] 2xl:px-5">
                          {formatDate(reportingYear.startDate)} -{" "}
                          {formatDate(reportingYear.endDate)}
                        </td>
                        <td className="px-4 py-4 text-[#5f6d65] 2xl:px-5">
                          {reportingYear.selectedGhgActivityCount}
                        </td>
                        <td className="px-4 py-4 2xl:px-5">
                          <StatusPill status={status} />
                        </td>
                        <td className="px-4 py-4 text-right 2xl:px-5">
                          <div className="flex justify-end gap-2">
                            {canManageSetup ? (
                              <YearAction
                                href={`/app/${companyId}/reporting-years/${reportingYear.id}/ghg-setup`}
                                icon="leaf"
                                label="GHG setup"
                              />
                            ) : null}
                            <YearAction
                              href={`/app/${companyId}/reporting-years/${reportingYear.id}/data`}
                              icon="data"
                              label="Data entry"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-[#c8d6cd] bg-white/45 p-6 text-sm text-[#617069]">
          No reporting years have been created yet.
        </div>
      )}
    </section>
  );
}

function ReportingYearCard({
  canManageSetup,
  companyId,
  reportingYear,
}: {
  canManageSetup: boolean;
  companyId: string;
  reportingYear: ReportingYearRecord;
}) {
  const status = getReportingYearStatus(reportingYear);

  return (
    <article className="min-w-0 rounded-lg border border-[#d9e2dc] bg-white/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#142019]">{reportingYear.label}</h3>
          <p className="mt-1 text-sm leading-6 text-[#647169]">
            {formatDate(reportingYear.startDate)} - {formatDate(reportingYear.endDate)}
          </p>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="mt-4 rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-[#69756e] uppercase">
          Selected GHG activities
        </p>
        <p className="mt-1 text-xl font-semibold text-[#142019]">
          {reportingYear.selectedGhgActivityCount}
        </p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {canManageSetup ? (
          <YearAction
            href={`/app/${companyId}/reporting-years/${reportingYear.id}/ghg-setup`}
            icon="leaf"
            label="GHG setup"
          />
        ) : null}
        <YearAction
          href={`/app/${companyId}/reporting-years/${reportingYear.id}/data`}
          icon="data"
          label="Data entry"
        />
      </div>
    </article>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold ${
        status === "Ready"
          ? "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
          : "border-[#ded2b4] bg-[#fbf6e9] text-[#775d20]"
      }`}
    >
      {status}
    </span>
  );
}

function YearAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: "data" | "leaf";
  label: string;
}) {
  const Icon = icon === "leaf" ? Leaf : ClipboardList;

  return (
    <Link
      className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-md border border-[#d1ddd5] bg-white/75 px-3 text-sm font-semibold text-[#1d2a22] transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none"
      to={href}
    >
      <Icon className="size-4 shrink-0" strokeWidth={1.8} />
      <span className="truncate">{label}</span>
      <ArrowRight className="size-4 shrink-0" strokeWidth={1.8} />
    </Link>
  );
}
