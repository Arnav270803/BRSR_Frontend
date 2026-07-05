import { BarChart3, CheckCircle2, FileText, Leaf, Table2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { ReportingYearReport, ReportTotalRow } from "../../api/reports";
import { formatKgCo2e, formatReportDate, formatReportDateTime } from "./reportsUtils";

type ReportPreviewProps = {
  report?: ReportingYearReport;
  isLoading: boolean;
};

export function ReportPreview({ report, isLoading }: ReportPreviewProps) {
  if (isLoading) {
    return (
      <section className="rounded-lg border border-white/70 bg-white/55 p-6 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl">
        <p className="text-sm font-semibold text-[#243128]">Generating report preview...</p>
        <p className="mt-2 text-sm text-[#66736b]">
          Collecting company setup, selected GHG activities, and data records.
        </p>
      </section>
    );
  }

  if (!report) {
    return (
      <section className="rounded-lg border border-dashed border-[#cbd8cf] bg-white/40 p-6 text-center shadow-[0_18px_60px_rgba(35,47,38,0.06)] backdrop-blur-2xl sm:p-8">
        <span className="mx-auto grid size-12 place-items-center rounded-lg bg-[#eef7f1] text-[#2d7347]">
          <FileText className="size-6" strokeWidth={1.8} />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-[#17231d]">No report generated yet</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#65736b]">
          Select a reporting year and generate a preview. The PDF export will use the same live
          backend data shown here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_70px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 xl:p-6">
      <div className="flex flex-col gap-4 border-b border-[#dce5df] pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#718079] uppercase">
            Report preview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#142019]">
            {report.company.displayName} - {report.reportingYear.label}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#65736b]">
            Generated {formatReportDateTime(report.generatedAt)}
          </p>
        </div>
        <div className="rounded-lg border border-[#d9e3dc] bg-white/65 p-3 text-sm text-[#243128]">
          <p className="font-semibold">{report.reportingYear.setupStatus}</p>
          <p className="mt-1 text-[#65736b]">
            {formatReportDate(report.reportingYear.startDate)} to{" "}
            {formatReportDate(report.reportingYear.endDate)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Leaf}
          label="Selected activities"
          value={report.ghgActivitySetup.selectedActivityCount.toLocaleString("en-IN")}
        />
        <MetricCard
          icon={Table2}
          label="Submitted records"
          value={report.emissionSummary.recordCount.toLocaleString("en-IN")}
        />
        <MetricCard
          icon={BarChart3}
          label="Total emissions"
          value={formatKgCo2e(report.emissionSummary.totalKgCo2e)}
        />
        <MetricCard icon={CheckCircle2} label="Source" value="Live backend data" />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-4">
          <ReportBlock title="Company summary">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoTile label="Company name" value={report.company.displayName} />
              <InfoTile label="Legal name" value={report.company.legalName} />
              <InfoTile label="Industry" value={report.company.industry} />
              <InfoTile label="Location" value={report.company.location} />
              <InfoTile label="Primary domain" value={report.company.primaryDomain} />
              <InfoTile
                label="Financial year"
                value={`Starts in month ${report.company.financialYearStartMonth}`}
              />
            </div>
          </ReportBlock>

          <ReportBlock title="Emission totals">
            <div className="grid gap-3 lg:grid-cols-3">
              <TotalsList rows={report.emissionSummary.totalsByScope} title="By scope" />
              <TotalsList rows={report.emissionSummary.totalsByCategory} title="By category" />
              <TotalsList
                rows={report.emissionSummary.totalsByActivity.slice(0, 6)}
                title="Top activities"
              />
            </div>
          </ReportBlock>

          <ReportBlock title="Data records table">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-[11px] font-semibold tracking-[0.12em] text-[#718079] uppercase">
                  <tr className="border-b border-[#dce5df]">
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Activity</th>
                    <th className="py-3 pr-4">Category/scope</th>
                    <th className="py-3 pr-4">Quantity</th>
                    <th className="py-3 pr-4">Factor</th>
                    <th className="py-3 pr-4">Calculated kg CO2e</th>
                    <th className="py-3 pr-4">Created by</th>
                  </tr>
                </thead>
                <tbody>
                  {report.dataRecords.slice(0, 10).map((record) => (
                    <tr className="border-b border-[#edf2ef] last:border-0" key={record.id}>
                      <td className="py-3 pr-4 text-[#26342b]">
                        {formatReportDate(record.recordDate)}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-[#18241d]">
                        {record.activity}
                      </td>
                      <td className="py-3 pr-4 text-[#65736b]">
                        {record.category} / {record.scope ?? "Scope not set"}
                      </td>
                      <td className="py-3 pr-4 text-[#65736b]">
                        {record.quantity} {record.unit}
                      </td>
                      <td className="py-3 pr-4 text-[#65736b]">
                        {record.factorKgCo2e ?? "Not set"}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-[#183f2a]">
                        {formatKgCo2e(record.calculatedKgCo2e)}
                      </td>
                      <td className="py-3 pr-4 text-[#65736b]">{record.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {report.dataRecords.length > 10 ? (
              <p className="mt-3 text-xs text-[#66736b]">
                Showing first 10 records in preview. The PDF export includes more report detail.
              </p>
            ) : null}
          </ReportBlock>
        </div>

        <aside className="space-y-4">
          <ReportBlock title="GHG activity setup">
            <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {report.ghgActivitySetup.selectedActivities.slice(0, 18).map((activity) => (
                <div
                  className="rounded-md border border-[#dce5df] bg-white/60 p-3"
                  key={activity.selectionId}
                >
                  <p className="text-sm font-semibold text-[#17231d]">{activity.activity}</p>
                  <p className="mt-1 text-xs text-[#65736b]">
                    {activity.category} | {activity.scope ?? "Scope not set"} | {activity.unit} |
                    factor {activity.factorKgCo2e ?? "not set"}
                  </p>
                </div>
              ))}
            </div>
          </ReportBlock>

          <ReportBlock title="Methodology note">
            <p className="text-sm font-semibold text-[#243128]">
              {report.methodology.formula}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#65736b]">{report.methodology.note}</p>
          </ReportBlock>

          <ReportBlock title="Limitations and future scope">
            <ul className="space-y-2 text-sm leading-6 text-[#65736b]">
              {report.limitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
          </ReportBlock>
        </aside>
      </div>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#d9e3dc] bg-white/55 p-4">
      <Icon className="size-5 text-[#2d7347]" strokeWidth={1.8} />
      <p className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-[#718079] uppercase">
        {label}
      </p>
      <p className="mt-2 break-words text-xl font-semibold text-[#17231d]">{value}</p>
    </div>
  );
}

function ReportBlock({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="rounded-lg border border-[#d9e3dc] bg-white/45 p-4">
      <h3 className="text-base font-semibold text-[#17231d]">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#dce5df] bg-white/55 p-3">
      <p className="text-[11px] font-semibold tracking-[0.12em] text-[#718079] uppercase">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-[#243128]">{value}</p>
    </div>
  );
}

function TotalsList({ rows, title }: { rows: ReportTotalRow[]; title: string }) {
  return (
    <div className="rounded-md border border-[#dce5df] bg-white/50 p-3">
      <p className="text-sm font-semibold text-[#243128]">{title}</p>
      <div className="mt-3 space-y-2">
        {rows.length > 0 ? (
          rows.map((row) => (
            <div className="flex items-start justify-between gap-3 text-sm" key={row.name}>
              <span className="min-w-0 text-[#65736b]">{row.name}</span>
              <span className="shrink-0 font-semibold text-[#183f2a]">
                {formatKgCo2e(row.totalKgCo2e)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#65736b]">No submitted records yet.</p>
        )}
      </div>
    </div>
  );
}
