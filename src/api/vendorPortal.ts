import { apiRequest } from "./client";
import type { VendorDataRequest, VendorMembershipRole } from "./vendors";

type ApiDataResponse<TData> = {
  data: TData;
};

export type VendorPortalContext = {
  user: {
    id: string;
    email: string;
    isPlatformOwner: boolean;
  };
  membership: {
    id: string;
    role: VendorMembershipRole;
    status: string;
  };
  company: {
    id: string;
    displayName: string;
    legalName: string;
  };
  vendor: {
    id: string;
    legalName: string;
    displayName: string;
    vendorCode: string | null;
    primaryEmail: string;
    primaryPhone: string | null;
    website: string | null;
    industry: string | null;
    country: string;
    state: string;
    city: string;
    address: string | null;
    taxId: string | null;
    status: string;
    profileCompletedAt: string | null;
  };
  sites: Array<{
    id: string;
    name: string;
    type: string;
    city: string;
    state: string;
    country: string;
  }>;
};

export type VendorSubmissionInput = {
  records: Array<{
    requestItemId: string;
    recordDate: string;
    quantity: number;
    notes?: string;
  }>;
};

export function getVendorPortalContext(vendorId: string) {
  return apiRequest<ApiDataResponse<VendorPortalContext>>(
    `/vendor-portal/vendors/${vendorId}`,
  );
}

export function listVendorPortalRequests(vendorId: string) {
  return apiRequest<ApiDataResponse<VendorDataRequest[]>>(
    `/vendor-portal/vendors/${vendorId}/requests`,
  );
}

export function getVendorPortalRequest(vendorId: string, requestId: string) {
  return apiRequest<ApiDataResponse<VendorDataRequest>>(
    `/vendor-portal/vendors/${vendorId}/requests/${requestId}`,
  );
}

export function saveVendorSubmission(
  vendorId: string,
  requestId: string,
  input: VendorSubmissionInput,
) {
  return apiRequest<ApiDataResponse<VendorDataRequest>>(
    `/vendor-portal/vendors/${vendorId}/requests/${requestId}/submissions`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export function submitVendorDataRequest(vendorId: string, requestId: string) {
  return apiRequest<ApiDataResponse<VendorDataRequest>>(
    `/vendor-portal/vendors/${vendorId}/requests/${requestId}/submit`,
    {
      method: "POST",
    },
  );
}

export function updateVendorPortalProfile(
  vendorId: string,
  input: Partial<{
    legalName: string;
    displayName: string;
    primaryPhone: string | null;
    website: string | null;
    industry: string | null;
    country: string;
    state: string;
    city: string;
    address: string | null;
    taxId: string | null;
  }>,
) {
  return apiRequest<ApiDataResponse<VendorPortalContext>>(
    `/vendor-portal/vendors/${vendorId}/profile`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}
