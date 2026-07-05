import { apiRequest } from "./client";

export type CreateCompanyInput = {
  legalName: string;
  displayName: string;
  primaryDomain: string;
  industry: string;
  country: string;
  state: string;
  city: string;
  financialYearStartMonth: number;
  cin?: string;
  gst?: string;
  registeredAddress?: string;
  listedStatus?: string;
  employeeCountRange?: string;
  contactPhone?: string;
  logoUrl?: string;
  site?: {
    name: string;
    type: string;
    country: string;
    state: string;
    city: string;
    address?: string;
  };
};

export type CreateCompanyResult = {
  company: {
    id: string;
    legalName: string;
    displayName: string;
    primaryDomain: string;
    industry: string;
    country: string;
    state: string;
    city: string;
    financialYearStartMonth: number;
    status: string;
  };
  membership: {
    id: string;
    role: string;
    status: string;
  };
};

type ApiDataResponse<TData> = {
  data: TData;
};

export function createCompany(input: CreateCompanyInput) {
  return apiRequest<ApiDataResponse<CreateCompanyResult>>("/companies", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
