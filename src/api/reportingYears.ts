import { apiRequest } from "./client";

export type ReportingYearRecord = {
  id: string;
  companyId: string;
  label: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  selectedGhgActivityCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateReportingYearInput = {
  label: string;
  startDate: string;
  endDate: string;
};

type ApiDataResponse<TData> = {
  data: TData;
};

export function listReportingYears(companyId: string) {
  return apiRequest<ApiDataResponse<ReportingYearRecord[]>>(
    `/companies/${companyId}/reporting-years`,
  );
}

export function createReportingYear(companyId: string, input: CreateReportingYearInput) {
  return apiRequest<ApiDataResponse<ReportingYearRecord>>(
    `/companies/${companyId}/reporting-years`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}
