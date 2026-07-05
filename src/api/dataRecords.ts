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
  return listDataRecordsForSite(companyId, undefined, reportingYearId);
}

export function listDataRecordsForSite(
  companyId: string,
  siteId: string | undefined,
  reportingYearId: string,
) {
  const prefix = siteId
    ? `/companies/${companyId}/sites/${siteId}`
    : `/companies/${companyId}`;

  return apiRequest<ApiListResponse<DataRecord>>(
    `${prefix}/reporting-years/${reportingYearId}/data-records?pageSize=100`,
  );
}

export function createDataRecord(
  companyId: string,
  reportingYearId: string,
  input: CreateDataRecordInput,
  siteId?: string,
) {
  const prefix = siteId
    ? `/companies/${companyId}/sites/${siteId}`
    : `/companies/${companyId}`;

  return apiRequest<ApiDataResponse<DataRecord>>(
    `${prefix}/reporting-years/${reportingYearId}/data-records`,
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
  siteId?: string,
) {
  const prefix = siteId
    ? `/companies/${companyId}/sites/${siteId}`
    : `/companies/${companyId}`;

  return apiRequest<ApiDataResponse<DataRecord>>(
    `${prefix}/reporting-years/${reportingYearId}/data-records/${dataRecordId}`,
    {
      method: "DELETE",
    },
  );
}
