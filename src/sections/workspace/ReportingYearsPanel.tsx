import { ArrowRight, CalendarRange } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReportingYear } from "./workspaceData";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function getReportingYearStatus(reportingYear: ReportingYear) {
  return reportingYear.selectedGhgActivityCount > 0 ? "Ready" : "Needs selection";
}

export function ReportingYearsPanel({
  companyId,
  reportingYears,
  siteId,
}: {
  companyId: string;
  reportingYears: ReportingYear[];
  siteId: string;
}) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Reporting years</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">Annual workspaces</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#65716a]">
            Open a year to work with its own GHG setup and data records.
          </p>
        </div>
        <Link
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#cdd9d1] bg-white/70 px-4 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none sm:w-auto"
          title="Create reporting year"
          to={`/app/${companyId}/reporting-years`}
        >
          <CalendarRange className="size-4" strokeWidth={1.8} />
          New year
        </Link>
      </div>

      {reportingYears.length > 0 ? (
        <>
          <div className="mt-5 grid gap-3 md:hidden">
            {reportingYears.map((reportingYear, index) => {
              const status = getReportingYearStatus(reportingYear);

              return (
                <article
                  className="min-w-0 rounded-lg border border-[#d9e2dc] bg-white/60 p-4"
                  key={reportingYear.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-[#142019]">
                        {reportingYear.label}
                      </h3>
                      {index === 0 ? <DefaultPill /> : null}
                      <p className="mt-1 text-sm leading-6 text-[#647169]">
                        {formatDate(reportingYear.startDate)} -{" "}
                        {formatDate(reportingYear.endDate)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold ${
                        status === "Ready"
                          ? "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
                          : "border-[#ded2b4] bg-[#fbf6e9] text-[#775d20]"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3">
                      <p className="text-[11px] font-semibold tracking-[0.08em] text-[#69756e] uppercase">
                        GHG activities
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[#142019]">
                        {reportingYear.selectedGhgActivityCount}
                      </p>
                    </div>
                    <Link
                      className="inline-flex min-w-0 items-center justify-center gap-2 rounded-md border border-[#d1ddd5] bg-white/75 px-3 text-sm font-semibold text-[#1d2a22] transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none"
                      title={`Open ${reportingYear.label}`}
                      to={`/app/${companyId}/sites/${siteId}/reporting-years/${reportingYear.id}/data`}
                    >
                      Open
                      <ArrowRight className="size-4" strokeWidth={1.8} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

        <div className="mt-5 hidden overflow-hidden rounded-lg border border-[#d9e2dc] bg-white/55 md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#d9e2dc] bg-[#f3f7f4]/80 text-xs font-semibold tracking-[0.12em] text-[#65716a] uppercase">
                  <th className="px-4 py-3 2xl:px-5">Year</th>
                  <th className="px-4 py-3 2xl:px-5">Period</th>
                  <th className="px-4 py-3 2xl:px-5">GHG activities</th>
                  <th className="px-4 py-3 2xl:px-5">Status</th>
                  <th className="px-4 py-3 text-right 2xl:px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e8e2] text-sm">
                {reportingYears.map((reportingYear, index) => {
                  const status = getReportingYearStatus(reportingYear);

                  return (
                    <tr className="text-[#253229]" key={reportingYear.id}>
                      <td className="px-4 py-4 font-semibold 2xl:px-5">
                        <div className="flex flex-wrap items-center gap-2">
                          {reportingYear.label}
                          {index === 0 ? <DefaultPill /> : null}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#5f6d65] 2xl:px-5">
                        {formatDate(reportingYear.startDate)} -{" "}
                        {formatDate(reportingYear.endDate)}
                      </td>
                      <td className="px-4 py-4 text-[#5f6d65] 2xl:px-5">
                        {reportingYear.selectedGhgActivityCount}
                      </td>
                      <td className="px-4 py-4 2xl:px-5">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${
                            status === "Ready"
                              ? "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
                              : "border-[#ded2b4] bg-[#fbf6e9] text-[#775d20]"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right 2xl:px-5">
                        <Link
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#d1ddd5] bg-white/75 px-3 text-sm font-semibold text-[#1d2a22] transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none"
                          title={`Open ${reportingYear.label}`}
                          to={`/app/${companyId}/sites/${siteId}/reporting-years/${reportingYear.id}/data`}
                        >
                          Open
                          <ArrowRight className="size-4" strokeWidth={1.8} />
                        </Link>
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

function DefaultPill() {
  return (
    <span className="inline-flex w-fit rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2 py-0.5 text-[11px] font-semibold text-[#2f6b45]">
      Default
    </span>
  );
}
