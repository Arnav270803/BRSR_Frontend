import type {
  CreateInvitationPayload,
  CreateInvitationValues,
  InvitationRecord,
  InvitationStatus,
} from "./employeesData";

export const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function getInvitationStatus(invitation: InvitationRecord): InvitationStatus {
  if (invitation.revokedAt) {
    return "Revoked";
  }

  if (invitation.acceptedAt) {
    return "Accepted";
  }

  if (new Date(invitation.expiresAt).getTime() <= Date.now()) {
    return "Expired";
  }

  return "Pending";
}

export function getDaysUntilExpiry(invitation: InvitationRecord) {
  const expiresAt = new Date(invitation.expiresAt).getTime();
  const diff = expiresAt - Date.now();

  if (diff <= 0) {
    return "Expired";
  }

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function toCreateInvitationPayload(
  values: CreateInvitationValues,
): CreateInvitationPayload {
  return {
    email: values.email.trim().toLowerCase(),
    role: values.role,
  };
}

export function createLocalInviteToken(email: string) {
  const prefix = email.split("@")[0]?.slice(0, 8).replace(/[^a-z0-9]/gi, "").toLowerCase();
  return `local_${prefix || "invite"}_${Date.now().toString(36)}`;
}
