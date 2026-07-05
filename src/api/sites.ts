import { apiRequest } from "./client";
import type { CompanySite } from "../sections/workspace/workspaceData";

type ApiDataResponse<TData> = {
  data: TData;
};

export type CreateCompanySiteInput = {
  name: string;
  type: string;
  country: string;
  state: string;
  city: string;
  address?: string;
  isPrimary?: boolean;
};

export type CompanySiteMember = {
  id: string;
  companyId: string;
  userId: string;
  role: "ADMIN" | "USER";
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  };
  siteIds: string[];
};

export function listCompanySites(companyId: string) {
  return apiRequest<ApiDataResponse<CompanySite[]>>(`/companies/${companyId}/sites`);
}

export function createCompanySite(companyId: string, input: CreateCompanySiteInput) {
  return apiRequest<ApiDataResponse<CompanySite>>(`/companies/${companyId}/sites`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCompanySite(
  companyId: string,
  siteId: string,
  input: Partial<CreateCompanySiteInput>,
) {
  return apiRequest<ApiDataResponse<CompanySite>>(`/companies/${companyId}/sites/${siteId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function listCompanySiteMembers(companyId: string) {
  return apiRequest<ApiDataResponse<CompanySiteMember[]>>(
    `/companies/${companyId}/sites/members`,
  );
}

export function updateCompanySiteMemberAccess(
  companyId: string,
  userId: string,
  siteIds: string[],
) {
  return apiRequest<ApiDataResponse<CompanySiteMember>>(
    `/companies/${companyId}/sites/members/${userId}`,
    {
      method: "PUT",
      body: JSON.stringify({ siteIds }),
    },
  );
}
