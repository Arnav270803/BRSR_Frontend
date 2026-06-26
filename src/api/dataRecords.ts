import { apiRequest } from "./client";
import type { DataRecord } from "../sections/dataEntry/dataEntryData";

export type CreateDataRecordInput = {
  ghgActivitySelectionId: string;
  recordDate: string;
  quantity: number;
  notes?: string;
};

type ApiDataResponse<TData> = {
  data: TData;
};

type ApiListResponse<TData> = {
  data: TData[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export function listDataRecords(companyId: string, reportingYearId: string) {
  return apiRequest<ApiListResponse<DataRecord>>(
    `/companies/${companyId}/reporting-years/${reportingYearId}/data-records?pageSize=100`,
  );
}

export function createDataRecord(
  companyId: string,
  reportingYearId: string,
  input: CreateDataRecordInput,
) {
  return apiRequest<ApiDataResponse<DataRecord>>(
    `/companies/${companyId}/reporting-years/${reportingYearId}/data-records`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function deleteDataRecord(
  companyId: string,
  reportingYearId: string,
  dataRecordId: string,
) {
  return apiRequest<ApiDataResponse<DataRecord>>(
    `/companies/${companyId}/reporting-years/${reportingYearId}/data-records/${dataRecordId}`,
    {
      method: "DELETE",
    },
  );
}
