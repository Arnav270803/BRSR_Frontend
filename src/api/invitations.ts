import { apiRequest } from "./client";
import type {
  CompanyInviteRole,
  InvitationRecord,
} from "../sections/employees/employeesData";

export type CreateInvitationInput = {
  email: string;
  role: CompanyInviteRole;
};

export type CreateInvitationResult = {
  invitation: InvitationRecord;
  token: string;
  inviteLink: string;
  emailSent: boolean;
  emailError?: string;
};

export type AcceptInvitationResult = {
  invitation: InvitationRecord;
  company: {
    id: string;
    displayName: string;
    legalName: string;
  };
  membership: {
    id: string;
    role: CompanyInviteRole;
    status: string;
  };
};

type ApiDataResponse<TData> = {
  data: TData;
};

export function listCompanyInvitations(companyId: string) {
  return apiRequest<ApiDataResponse<InvitationRecord[]>>(
    `/companies/${companyId}/invitations`,
  );
}

export function createCompanyInvitation(companyId: string, input: CreateInvitationInput) {
  return apiRequest<ApiDataResponse<CreateInvitationResult>>(
    `/companies/${companyId}/invitations`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function acceptInvitation(token: string) {
  return apiRequest<ApiDataResponse<AcceptInvitationResult>>("/invitations/accept", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
