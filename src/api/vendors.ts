import { apiRequest } from "./client";

type ApiDataResponse<TData> = {
  data: TData;
};

export type VendorStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
export type VendorMembershipRole = "VENDOR_ADMIN" | "VENDOR_CONTRIBUTOR";
export type VendorTrackingMode = "NONE" | "OPTIONAL" | "REQUIRED";
export type VendorDataRequestStatus =
  | "DRAFT"
  | "SENT"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "OVERDUE"
  | "CANCELLED";

export type VendorSite = {
  assignmentId?: string;
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  country: string;
  isPrimary?: boolean;
};

export type Vendor = {
  id: string;
  companyId: string;
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
  status: VendorStatus;
  profileCompletedAt: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  sites: VendorSite[];
  members: Array<{
    membershipId: string;
    role: VendorMembershipRole;
    status: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      avatarUrl: string | null;
    };
  }>;
  recentInvitations: Array<{
    id: string;
    email: string;
    role: VendorMembershipRole;
    expiresAt: string;
    acceptedAt: string | null;
    revokedAt: string | null;
    createdAt: string;
  }>;
  requestCount: number;
  approvedRecordCount: number;
};

export type VendorOption = {
  id: string;
  displayName: string;
  vendorCode: string | null;
};

export type VendorDataRequestItem = {
  id: string;
  ghgActivitySelectionId: string;
  trackingMode: VendorTrackingMode;
  instructions: string | null;
  activity: {
    id: string;
    label: string;
    activity: string;
    subtype: string | null;
    variant: string | null;
    scope: string | null;
    unit: string;
    factorKgCo2e: string | null;
    category: {
      id: string;
      name: string;
    };
  };
};

export type VendorSubmissionRecord = {
  id: string;
  requestItemId: string;
  ghgActivitySelectionId: string;
  recordDate: string;
  quantity: string;
  notes: string | null;
  metadata: unknown;
  createdBy: {
    id: string;
    email: string;
    name: string | null;
  };
  approvedDataRecord: {
    id: string;
    calculatedKgCo2e: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type VendorDataRequest = {
  id: string;
  companyId: string;
  vendorId: string;
  siteId: string;
  reportingYearId: string;
  title: string;
  instructions: string | null;
  dueDate: string;
  status: VendorDataRequestStatus;
  reviewNotes: string | null;
  createdByUserId: string;
  reviewedByUserId: string | null;
  sentAt: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  changesRequestedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  vendor: {
    id: string;
    displayName: string;
    legalName: string;
    primaryEmail: string;
    status: VendorStatus;
  };
  site: VendorSite;
  reportingYear: {
    id: string;
    label: string;
    startDate: string;
    endDate: string;
  };
  items: VendorDataRequestItem[];
  submissionRecords: VendorSubmissionRecord[];
};

export type VendorAnalytics = {
  filters: {
    reportingYearId?: string;
    siteId?: string;
  };
  summary: {
    vendorCount: number;
    approvedRequestCount: number;
    totalRequestCount: number;
    requestCoveragePercent: number;
  };
  requestStatuses: Array<{
    status: VendorDataRequestStatus;
    count: number;
  }>;
  vendors: Array<{
    id: string;
    displayName: string;
    status: VendorStatus;
    approvedRecordCount: number;
    totalKgCo2e: string;
  }>;
};

export type CreateVendorInput = {
  legalName: string;
  displayName: string;
  vendorCode?: string;
  primaryEmail: string;
  primaryPhone?: string;
  website?: string;
  industry?: string;
  country: string;
  state: string;
  city: string;
  address?: string;
  taxId?: string;
  siteIds: string[];
  sendInvitation: boolean;
  invitationRole: VendorMembershipRole;
};

export type CreateVendorDataRequestInput = {
  vendorId: string;
  siteId: string;
  reportingYearId: string;
  title: string;
  instructions?: string;
  dueDate: string;
  activitySelectionIds: string[];
  sendNow: boolean;
};

function withQuery(path: string, values: Record<string, string | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value) {
      query.set(key, value);
    }
  }

  const suffix = query.toString();
  return suffix ? `${path}?${suffix}` : path;
}

export function listVendors(
  companyId: string,
  filters: { status?: string; siteId?: string; search?: string } = {},
) {
  return apiRequest<ApiDataResponse<Vendor[]>>(
    withQuery(`/companies/${companyId}/vendors`, filters),
  );
}

export function listVendorOptions(companyId: string, siteId: string) {
  return apiRequest<ApiDataResponse<VendorOption[]>>(
    withQuery(`/companies/${companyId}/vendors/options`, { siteId }),
  );
}

export function getVendor(companyId: string, vendorId: string) {
  return apiRequest<ApiDataResponse<Vendor>>(
    `/companies/${companyId}/vendors/${vendorId}`,
  );
}

export function createVendor(companyId: string, input: CreateVendorInput) {
  return apiRequest<
    ApiDataResponse<{
      vendor: Vendor;
      invitation: VendorInvitationResult | null;
    }>
  >(`/companies/${companyId}/vendors`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateVendor(
  companyId: string,
  vendorId: string,
  input: Partial<Omit<CreateVendorInput, "siteIds" | "sendInvitation" | "invitationRole">> & {
    status?: VendorStatus;
  },
) {
  return apiRequest<ApiDataResponse<Vendor>>(
    `/companies/${companyId}/vendors/${vendorId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export function updateVendorSites(companyId: string, vendorId: string, siteIds: string[]) {
  return apiRequest<ApiDataResponse<Vendor>>(
    `/companies/${companyId}/vendors/${vendorId}/sites`,
    {
      method: "PUT",
      body: JSON.stringify({ siteIds }),
    },
  );
}

export type VendorInvitationResult = {
  invitation: {
    id: string;
    companyId: string;
    vendorId: string;
    email: string;
    role: VendorMembershipRole;
    expiresAt: string;
    createdAt: string;
  };
  token: string;
  inviteLink: string;
  emailSent: boolean;
  emailError: string | null;
};

export function inviteVendor(
  companyId: string,
  vendorId: string,
  input: { email: string; role: VendorMembershipRole },
) {
  return apiRequest<ApiDataResponse<VendorInvitationResult>>(
    `/companies/${companyId}/vendors/${vendorId}/invitations`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function acceptVendorInvitation(token: string) {
  return apiRequest<
    ApiDataResponse<{
      vendor: { id: string; displayName: string };
      company: { id: string; displayName: string };
      membership: { id: string; role: VendorMembershipRole; status: string };
    }>
  >("/vendor-invitations/accept", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export function listVendorDataRequests(
  companyId: string,
  filters: {
    vendorId?: string;
    siteId?: string;
    reportingYearId?: string;
    status?: string;
  } = {},
) {
  return apiRequest<ApiDataResponse<VendorDataRequest[]>>(
    withQuery(`/companies/${companyId}/vendor-data-requests`, filters),
  );
}

export function createVendorDataRequest(
  companyId: string,
  input: CreateVendorDataRequestInput,
) {
  return apiRequest<ApiDataResponse<VendorDataRequest>>(
    `/companies/${companyId}/vendor-data-requests`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function sendVendorDataRequest(companyId: string, requestId: string) {
  return apiRequest<ApiDataResponse<VendorDataRequest>>(
    `/companies/${companyId}/vendor-data-requests/${requestId}/send`,
    {
      method: "POST",
    },
  );
}

export function cancelVendorDataRequest(companyId: string, requestId: string) {
  return apiRequest<ApiDataResponse<VendorDataRequest>>(
    `/companies/${companyId}/vendor-data-requests/${requestId}/cancel`,
    {
      method: "POST",
    },
  );
}

export function reviewVendorDataRequest(
  companyId: string,
  requestId: string,
  input: { action: "APPROVE" | "REQUEST_CHANGES"; notes?: string },
) {
  return apiRequest<ApiDataResponse<VendorDataRequest>>(
    `/companies/${companyId}/vendor-data-requests/${requestId}/review`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function getVendorAnalytics(
  companyId: string,
  filters: { reportingYearId?: string; siteId?: string } = {},
) {
  return apiRequest<ApiDataResponse<VendorAnalytics>>(
    withQuery(`/companies/${companyId}/vendor-analytics`, filters),
  );
}
