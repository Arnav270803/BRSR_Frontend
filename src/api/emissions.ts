import { apiRequest } from "./client";

export type EmissionsScopeKey =
  | "SCOPE_1"
  | "SCOPE_2"
  | "SCOPE_3"
  | "OUTSIDE_SCOPES"
  | "UNCLASSIFIED";

export type EmissionsSummaryScope = {
  key: EmissionsScopeKey;
  label: string;
  recordCount: number;
  calculatedRecordCount: number;
  uncalculatedRecordCount: number;
  totalKgCo2e: string;
};

export type EmissionsSummary = {
  generatedAt: string;
  context: {
    companyId: string;
    siteId: string | null;
    reportingYearId: string;
    aggregationScope: "SITE" | "COMPANY";
  };
  unit: "kgCO2e";
  totals: {
    grossKgCo2e: string;
    scope1KgCo2e: string;
    scope2KgCo2e: string;
    scope3KgCo2e: string;
    outsideScopesKgCo2e: string;
    unclassifiedKgCo2e: string;
  };
  scopes: EmissionsSummaryScope[];
  categories: Array<{
    name: string;
    recordCount: number;
    calculatedRecordCount: number;
    uncalculatedRecordCount: number;
    totalKgCo2e: string;
  }>;
  coverage: {
    totalRecords: number;
    calculatedRecords: number;
    uncalculatedRecords: number;
    calculationCoveragePercent: number;
    lastUpdatedAt: string | null;
  };
};

type ApiDataResponse<TData> = {
  data: TData;
};

export function getEmissionsSummary(
  companyId: string,
  reportingYearId: string,
  siteId?: string,
) {
  const prefix = siteId
    ? `/companies/${companyId}/sites/${siteId}`
    : `/companies/${companyId}`;

  return apiRequest<ApiDataResponse<EmissionsSummary>>(
    `${prefix}/reporting-years/${reportingYearId}/emissions-summary`,
  );
}
