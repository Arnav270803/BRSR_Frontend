import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Factory,
  GitBranch,
  Layers3,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { EmissionsScopeKey, EmissionsSummary } from "../../api/emissions";
import type { ReportingYear } from "./workspaceData";

type DashboardAggregationScope = "site" | "company";

const numberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 3,
});

function formatTonnes(valueKg: string) {
  const value = Number(valueKg) / 1000;

  return Number.isFinite(value) ? numberFormatter.format(value) : "0";
}

function formatUpdatedAt(value: string | null) {
  if (!value) {
    return "No records yet";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getScope(summary: EmissionsSummary, key: EmissionsScopeKey) {
  return summary.scopes.find((scope) => scope.key === key)!;
}

export function EmissionsOverview({
  aggregationScope,
  canViewCompany,
  companyId,
  isError,
  isLoading,
  onAggregationScopeChange,
  onReportingYearChange,
  reportingYears,
  selectedReportingYearId,
  siteId,
  siteName,
  summary,
}: {
  aggregationScope: DashboardAggregationScope;
  canViewCompany: boolean;
  companyId: string;
  isError: boolean;
  isLoading: boolean;
  onAggregationScopeChange: (scope: DashboardAggregationScope) => void;
  onReportingYearChange: (reportingYearId: string) => void;
  reportingYears: ReportingYear[];
  selectedReportingYearId?: string;
  siteId: string;
  siteName: string;
  summary?: EmissionsSummary;
}) {
  return (
    <section aria-labelledby="emissions-overview-heading">
      <div className="flex flex-col gap-3 border-b border-[#cbd8d0] pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Recorded emissions</p>
          <h2
            className="mt-0.5 text-xl font-semibold text-[#142019] sm:text-2xl"
            id="emissions-overview-heading"
          >
            Scope overview
          </h2>
          <p className="mt-1 text-sm text-[#647169]">
            {aggregationScope === "company" ? "All company sites" : siteName} / live submitted data
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label>
            <span className="sr-only">Reporting year</span>
            <select
              className="h-10 min-w-36 rounded-md border border-[#cbd8d0] bg-white/75 px-3 text-sm font-semibold text-[#253229] shadow-sm outline-none focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
              disabled={reportingYears.length === 0}
              value={selectedReportingYearId ?? ""}
              onChange={(event) => onReportingYearChange(event.target.value)}
            >
              {reportingYears.length === 0 ? <option value="">No reporting year</option> : null}
              {reportingYears.map((reportingYear) => (
                <option key={reportingYear.id} value={reportingYear.id}>
                  {reportingYear.label}
                </option>
              ))}
            </select>
          </label>

          {canViewCompany ? (
            <div
              aria-label="Emissions view"
              className="inline-flex h-10 rounded-md border border-[#cbd8d0] bg-white/65 p-1 shadow-sm"
              role="group"
            >
              <ScopeToggle
                active={aggregationScope === "site"}
                label="This site"
                onClick={() => onAggregationScopeChange("site")}
              />
              <ScopeToggle
                active={aggregationScope === "company"}
                label="All sites"
                onClick={() => onAggregationScopeChange("company")}
              />
            </div>
          ) : null}
        </div>
      </div>

      {!selectedReportingYearId ? (
        <div className="mt-3 flex flex-col gap-3 rounded-lg border border-dashed border-[#bdcec3] bg-white/45 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#5f6d65]">
            Create a reporting year before emissions can be calculated.
          </p>
          <Link
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#1f5135] px-3 text-sm font-semibold text-white"
            to={`/app/${companyId}/reporting-years`}
          >
            Reporting years
            <ArrowRight className="size-4" strokeWidth={1.8} />
          </Link>
        </div>
      ) : isError ? (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#e0b9b2] bg-[#fff5f2] p-4 text-sm font-medium text-[#93463b]">
          <AlertCircle className="size-5 shrink-0" strokeWidth={1.8} />
          Emissions totals could not be loaded. Your submitted records are unchanged.
        </div>
      ) : isLoading || !summary ? (
        <EmissionsSkeleton />
      ) : (
        <EmissionsSummaryContent
          companyId={companyId}
          reportingYearId={selectedReportingYearId}
          siteId={siteId}
          summary={summary}
        />
      )}
    </section>
  );
}

function ScopeToggle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`rounded px-3 text-xs font-semibold transition sm:text-sm ${
        active ? "bg-[#1f5135] text-white shadow-sm" : "text-[#617069] hover:bg-white"
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function EmissionsSummaryContent({
  companyId,
  reportingYearId,
  siteId,
  summary,
}: {
  companyId: string;
  reportingYearId: string;
  siteId: string;
  summary: EmissionsSummary;
}) {
  const grossKgCo2e = Number(summary.totals.grossKgCo2e);
  const scope1 = getScope(summary, "SCOPE_1");
  const scope2 = getScope(summary, "SCOPE_2");
  const scope3 = getScope(summary, "SCOPE_3");
  const dataEntryBasePath = `/app/${companyId}/sites/${siteId}/reporting-years/${reportingYearId}/data`;
  const isSiteView = summary.context.aggregationScope === "SITE";
  const metrics: Array<{
    label: string;
    description: string;
    valueKg: string;
    recordCount: number;
    share?: number;
    icon: LucideIcon;
    tone: string;
    iconTone: string;
    to?: string;
  }> = [
    {
      label: "Gross total",
      description: "Scope 1 + 2 + 3",
      valueKg: summary.totals.grossKgCo2e,
      recordCount:
        scope1.calculatedRecordCount +
        scope2.calculatedRecordCount +
        scope3.calculatedRecordCount,
      icon: Activity,
      tone: "border-t-[#4d8060]",
      iconTone: "bg-[#e9f3ed] text-[#2e6b45]",
    },
    {
      label: "Scope 1",
      description: "Direct emissions",
      valueKg: scope1.totalKgCo2e,
      recordCount: scope1.recordCount,
      share: grossKgCo2e > 0 ? (Number(scope1.totalKgCo2e) / grossKgCo2e) * 100 : 0,
      icon: Factory,
      tone: "border-t-[#b55f53]",
      iconTone: "bg-[#faece9] text-[#9b493f]",
      to: isSiteView ? `${dataEntryBasePath}?scope=${encodeURIComponent(scope1.label)}` : undefined,
    },
    {
      label: "Scope 2",
      description: "Purchased energy",
      valueKg: scope2.totalKgCo2e,
      recordCount: scope2.recordCount,
      share: grossKgCo2e > 0 ? (Number(scope2.totalKgCo2e) / grossKgCo2e) * 100 : 0,
      icon: Zap,
      tone: "border-t-[#b08a37]",
      iconTone: "bg-[#fbf4df] text-[#80631f]",
      to: isSiteView ? `${dataEntryBasePath}?scope=${encodeURIComponent(scope2.label)}` : undefined,
    },
    {
      label: "Scope 3",
      description: "Value-chain emissions",
      valueKg: scope3.totalKgCo2e,
      recordCount: scope3.recordCount,
      share: grossKgCo2e > 0 ? (Number(scope3.totalKgCo2e) / grossKgCo2e) * 100 : 0,
      icon: GitBranch,
      tone: "border-t-[#5876a5]",
      iconTone: "bg-[#edf1f8] text-[#435f8a]",
      to: isSiteView ? `${dataEntryBasePath}?scope=${encodeURIComponent(scope3.label)}` : undefined,
    },
  ];

  return (
    <>
      <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0">
        {metrics.map((metric) => (
          <EmissionMetric key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)]">
        <CoverageBand summary={summary} />
        <CategoryBand summary={summary} />
      </div>
    </>
  );
}

function EmissionMetric({
  metric,
}: {
  metric: {
    label: string;
    description: string;
    valueKg: string;
    recordCount: number;
    share?: number;
    icon: LucideIcon;
    tone: string;
    iconTone: string;
    to?: string;
  };
}) {
  const Icon = metric.icon;
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#56645d]">{metric.label}</p>
          <p className="mt-0.5 truncate text-xs text-[#77827b]">{metric.description}</p>
        </div>
        <span className={`grid size-8 shrink-0 place-items-center rounded-md ${metric.iconTone}`}>
          <Icon className="size-4" strokeWidth={1.8} />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-2xl font-semibold text-[#142019]">
            {formatTonnes(metric.valueKg)}
          </p>
          <p className="text-xs font-medium text-[#68756d]">tCO2e</p>
        </div>
        <div className="shrink-0 text-right text-xs text-[#68756d]">
          {metric.share === undefined ? (
            <p>{metric.recordCount} calculated</p>
          ) : (
            <p>{numberFormatter.format(metric.share)}% of gross</p>
          )}
          <p className="mt-1">{metric.recordCount} records</p>
        </div>
      </div>
    </>
  );
  const className = `min-h-32 min-w-[220px] rounded-lg border border-white/75 border-t-[3px] ${metric.tone} bg-white/60 p-4 shadow-[0_12px_36px_rgba(35,47,38,0.08)] backdrop-blur-2xl lg:min-w-0`;

  if (!metric.to) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link
      className={`${className} transition hover:border-x-[#b8c9be] hover:border-b-[#b8c9be] hover:bg-white/80 focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none`}
      title={`Open ${metric.label} data entry`}
      to={metric.to}
    >
      {content}
    </Link>
  );
}

function CoverageBand({ summary }: { summary: EmissionsSummary }) {
  const hasMissingFactors = summary.coverage.uncalculatedRecords > 0;
  const hasRecords = summary.coverage.totalRecords > 0;
  const Icon = hasMissingFactors ? AlertCircle : CheckCircle2;

  return (
    <div
      className={`flex min-h-20 items-center gap-3 rounded-lg border px-4 py-3 ${
        hasMissingFactors
          ? "border-[#dfc58d] bg-[#fbf6e9]"
          : "border-[#c3d6c8] bg-[#edf6ef]"
      }`}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white/70 text-[#315f42]">
        <Icon className="size-5" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-sm font-semibold text-[#233128]">
            {!hasRecords
              ? "No submitted records"
              : hasMissingFactors
                ? `${summary.coverage.uncalculatedRecords} records need a factor`
                : "All submitted records calculated"}
          </p>
          <p className="text-xs font-semibold text-[#52635a]">
            {summary.coverage.calculationCoveragePercent}% coverage
          </p>
        </div>
        <p className="mt-1 text-xs leading-5 text-[#65716a]">
          {hasMissingFactors
            ? "Records without a conversion factor remain visible but are excluded from totals."
            : `Last data update: ${formatUpdatedAt(summary.coverage.lastUpdatedAt)}`}
        </p>
      </div>
    </div>
  );
}

function CategoryBand({ summary }: { summary: EmissionsSummary }) {
  const topCategories = summary.categories.slice(0, 3);
  const outsideScopes = Number(summary.totals.outsideScopesKgCo2e);
  const unclassified = Number(summary.totals.unclassifiedKgCo2e);

  return (
    <div className="min-h-20 rounded-lg border border-[#d4ded7] bg-white/45 px-4 py-3">
      <div className="flex items-center gap-2">
        <Layers3 className="size-4 text-[#426a52]" strokeWidth={1.8} />
        <p className="text-sm font-semibold text-[#233128]">Largest categories</p>
      </div>
      {topCategories.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#647169]">
          {topCategories.map((category) => (
            <span key={category.name} className="min-w-0 truncate">
              <strong className="font-semibold text-[#34443a]">{category.name}</strong>{" "}
              {formatTonnes(category.totalKgCo2e)} t
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-[#77827b]">Categories appear after the first record.</p>
      )}
      {outsideScopes > 0 || unclassified > 0 ? (
        <p className="mt-2 text-xs text-[#775d20]">
          Outside scopes: {formatTonnes(String(outsideScopes))} t / Unclassified:{" "}
          {formatTonnes(String(unclassified))} t
        </p>
      ) : null}
    </div>
  );
}

function EmissionsSkeleton() {
  return (
    <div className="-mx-3 mt-3 flex gap-2 overflow-hidden px-3 sm:-mx-4 sm:px-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-3 lg:px-0">
      {[0, 1, 2, 3].map((item) => (
        <div
          className="min-h-32 min-w-[220px] animate-pulse rounded-lg border border-white/75 bg-white/55 p-4 lg:min-w-0"
          key={item}
        >
          <div className="h-3 w-20 rounded bg-[#dce6df]" />
          <div className="mt-6 h-7 w-28 rounded bg-[#dce6df]" />
          <div className="mt-2 h-3 w-14 rounded bg-[#e6ece8]" />
        </div>
      ))}
    </div>
  );
}
