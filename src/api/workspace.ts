import { apiRequest } from "./client";
import type { CompanyWorkspace } from "../sections/workspace/workspaceData";

type ApiDataResponse<TData> = {
  data: TData;
};

export function getCompanyWorkspace(companyId: string) {
  return apiRequest<ApiDataResponse<CompanyWorkspace>>(`/companies/${companyId}/workspace`);
}
