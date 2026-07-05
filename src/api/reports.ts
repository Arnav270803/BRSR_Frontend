import { apiBlobRequest, apiRequest } from "./client";

type ApiDataResponse<TData> = {
  data: TData;
};

export type ReportTotalRow = {
  name: string;
  recordCount: number;
  totalKgCo2e: string;
};

export type ReportSelectedActivity = {
  selectionId: string;
  activityId: string;
  activity: string;
  category: string;
  scope: string | null;
  unit: string;
  factorKgCo2e: string | null;
  sourceSheet: string;
  sourceYear: number | null;
  sourceRow: number;
};

export type ReportDataRecord = {
  id: string;
  recordDate: string;
  activity: string;
  category: string;
  scope: string | null;
  quantity: string;
  unit: string;
  factorKgCo2e: string | null;
  calculatedKgCo2e: string | null;
  createdBy: string;
  notes: string | null;
};

export type ReportingYearReport = {
  generatedAt: string;
  company: {
    id: string;
    displayName: string;
    legalName: string;
    primaryDomain: string;
    industry: string;
    location: string;
    financialYearStartMonth: number;
  };
  reportingYear: {
    id: string;
    label: string;
    startDate: string;
    endDate: string;
    setupStatus: string;
  };
  ghgActivitySetup: {
    selectedActivityCount: number;
    selectedActivities: ReportSelectedActivity[];
  };
  emissionSummary: {
    recordCount: number;
    totalKgCo2e: string;
    totalsByScope: ReportTotalRow[];
    totalsByCategory: ReportTotalRow[];
    totalsByActivity: ReportTotalRow[];
  };
  dataRecords: ReportDataRecord[];
  methodology: {
    formula: string;
    note: string;
  };
  limitations: string[];
};

export function getReportingYearReport(companyId: string, reportingYearId: string) {
  return apiRequest<ApiDataResponse<ReportingYearReport>>(
    `/companies/${companyId}/reporting-years/${reportingYearId}/report`,
  );
}

export function downloadReportingYearReportPdf(companyId: string, reportingYearId: string) {
  return apiBlobRequest(
    `/companies/${companyId}/reporting-years/${reportingYearId}/report.pdf`,
  );
}
