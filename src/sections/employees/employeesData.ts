export type CompanyInviteRole = "ADMIN" | "USER";

export type InvitationStatus = "Accepted" | "Expired" | "Pending" | "Revoked";

export type InvitationRecord = {
  id: string;
  companyId: string;
  email: string;
  role: CompanyInviteRole;
  invitedByUserId: string;
  acceptedByUserId: string | null;
  expiresAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  token?: string;
  inviteLink?: string;
  emailSent?: boolean;
  emailError?: string;
};

export type CreateInvitationValues = {
  email: string;
  role: CompanyInviteRole;
};

export type CreateInvitationPayload = {
  email: string;
  role: CompanyInviteRole;
};

export const demoInvitations: InvitationRecord[] = [
  {
    id: "invite-operations",
    companyId: "demo-company",
    email: "operations@acmeindustries.com",
    role: "USER",
    invitedByUserId: "user-admin",
    acceptedByUserId: null,
    expiresAt: "2026-06-26T10:00:00.000Z",
    acceptedAt: null,
    revokedAt: null,
    createdAt: "2026-06-19T10:00:00.000Z",
    token: "local_ops_7d8f2a",
  },
  {
    id: "invite-sustainability",
    companyId: "demo-company",
    email: "sustainability@acmeindustries.com",
    role: "ADMIN",
    invitedByUserId: "user-admin",
    acceptedByUserId: null,
    expiresAt: "2026-06-25T10:00:00.000Z",
    acceptedAt: null,
    revokedAt: null,
    createdAt: "2026-06-18T10:00:00.000Z",
    token: "local_sus_9b1c4e",
  },
  {
    id: "invite-finance",
    companyId: "demo-company",
    email: "finance@acmeindustries.com",
    role: "USER",
    invitedByUserId: "user-admin",
    acceptedByUserId: "user-finance",
    expiresAt: "2026-06-24T10:00:00.000Z",
    acceptedAt: "2026-06-19T09:00:00.000Z",
    revokedAt: null,
    createdAt: "2026-06-17T10:00:00.000Z",
  },
];
