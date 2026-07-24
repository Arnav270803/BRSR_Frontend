import { apiRequest } from "./client";
import type { GhgActivity, GhgCategory } from "../sections/ghgSetup/ghgSetupData";
import type { SelectedGhgActivity } from "../sections/dataEntry/dataEntryData";
import type { ReportingYearRecord } from "./reportingYears";

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

export type GhgSelectionsResponse = {
  site: {
    id: string;
    name: string;
    type: string;
    city: string;
    state: string;
    country: string;
    isPrimary: boolean;
  };
  reportingYear: ReportingYearRecord;
  selectedActivities: SelectedGhgActivity[];
};

export function listGhgCategories() {
  return apiRequest<ApiDataResponse<GhgCategory[]>>("/ghg/categories");
}

async function listGhgActivitiesPage(page: number) {
  return apiRequest<ApiListResponse<GhgActivity>>(`/ghg/activities?page=${page}&pageSize=100`);
}

export async function listGhgActivities() {
  const firstPage = await listGhgActivitiesPage(1);
  const activities = [...firstPage.data];

  for (let page = 2; page <= firstPage.meta.totalPages; page += 1) {
    const result = await listGhgActivitiesPage(page);
    activities.push(...result.data);
  }

  return {
    data: activities,
    meta: {
      ...firstPage.meta,
      page: 1,
      pageSize: activities.length,
    },
  };
}

export function listGhgActivitySelections(
  companyId: string,
  reportingYearId: string,
  siteId?: string,
) {
  const prefix = siteId
    ? `/companies/${companyId}/sites/${siteId}`
    : `/companies/${companyId}`;

  return apiRequest<ApiDataResponse<GhgSelectionsResponse>>(
    `${prefix}/reporting-years/${reportingYearId}/ghg-activity-selections`,
  );
}

export function updateGhgActivitySelections(
  companyId: string,
  reportingYearId: string,
  activityIds: string[],
  siteId?: string,
  vendorTrackingModes: Record<string, "NONE" | "OPTIONAL" | "REQUIRED"> = {},
) {
  const prefix = siteId
    ? `/companies/${companyId}/sites/${siteId}`
    : `/companies/${companyId}`;

  return apiRequest<ApiDataResponse<GhgSelectionsResponse>>(
    `${prefix}/reporting-years/${reportingYearId}/ghg-activity-selections`,
    {
      method: "PUT",
      body: JSON.stringify({ activityIds, vendorTrackingModes }),
    },
  );
}
