import { Check, Clock, Copy, Shield, UserRound, XCircle } from "lucide-react";
import type { InvitationRecord, InvitationStatus } from "./employeesData";
import { formatDate, getDaysUntilExpiry, getInvitationStatus } from "./employeesUtils";

export function InvitationsList({ invitations }: { invitations: InvitationRecord[] }) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Invitations</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">Access requests</h2>
        </div>
        <span className="w-fit rounded-md border border-[#d5dfd8] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#5f6f66]">
          {invitations.length} total
        </span>
      </div>

      {invitations.length > 0 ? (
        <>
          <div className="mt-5 grid gap-3 lg:hidden">
            {invitations.map((invitation) => (
              <InvitationCard invitation={invitation} key={invitation.id} />
            ))}
          </div>

          <div className="mt-5 hidden overflow-hidden rounded-lg border border-[#d9e2dc] bg-white/55 lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#d9e2dc] bg-[#f3f7f4]/80 text-xs font-semibold tracking-[0.12em] text-[#65716a] uppercase">
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Expires</th>
                    <th className="px-4 py-3">Invite link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e8e2] text-sm">
                  {invitations.map((invitation) => (
                    <InvitationRow invitation={invitation} key={invitation.id} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-[#c8d6cd] bg-white/45 p-6 text-sm text-[#617069]">
          No invitations have been created yet.
        </div>
      )}
    </section>
  );
}

function InvitationRow({ invitation }: { invitation: InvitationRecord }) {
  const status = getInvitationStatus(invitation);

  return (
    <tr className="text-[#253229]">
      <td className="px-4 py-4 font-semibold">{invitation.email}</td>
      <td className="px-4 py-4">
        <RolePill role={invitation.role} />
      </td>
      <td className="px-4 py-4">
        <StatusPill status={status} />
      </td>
      <td className="px-4 py-4 text-[#5f6d65]">
        <p>{formatDate(invitation.expiresAt)}</p>
        <p className="mt-1 text-xs">{getDaysUntilExpiry(invitation)}</p>
      </td>
      <td className="px-4 py-4">
        <TokenChip inviteLink={invitation.inviteLink} token={invitation.token} />
      </td>
    </tr>
  );
}

function InvitationCard({ invitation }: { invitation: InvitationRecord }) {
  const status = getInvitationStatus(invitation);

  return (
    <article className="rounded-lg border border-[#d9e2dc] bg-white/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-[#142019]">
            {invitation.email}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#647169]">
            Invited {formatDate(invitation.createdAt)}
          </p>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[#69756e] uppercase">
            Role
          </p>
          <div className="mt-2">
            <RolePill role={invitation.role} />
          </div>
        </div>
        <div className="rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[#69756e] uppercase">
            Expires
          </p>
          <p className="mt-1 text-sm font-semibold text-[#16211b]">
            {getDaysUntilExpiry(invitation)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <TokenChip inviteLink={invitation.inviteLink} token={invitation.token} />
      </div>
    </article>
  );
}

function RolePill({ role }: { role: string }) {
  const Icon = role === "ADMIN" ? Shield : UserRound;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#d1ddd5] bg-white/65 px-2.5 py-1 text-xs font-semibold text-[#52635a]">
      <Icon className="size-3.5" strokeWidth={1.8} />
      {role}
    </span>
  );
}

function StatusPill({ status }: { status: InvitationStatus }) {
  const Icon = status === "Accepted" ? Check : status === "Pending" ? Clock : XCircle;
  const className =
    status === "Accepted"
      ? "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
      : status === "Pending"
        ? "border-[#ded2b4] bg-[#fbf6e9] text-[#775d20]"
        : "border-[#d7c6c1] bg-[#fbefed] text-[#713c34]";

  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${className}`}>
      <Icon className="size-3.5" strokeWidth={1.8} />
      {status}
    </span>
  );
}

function TokenChip({ inviteLink, token }: { inviteLink?: string; token?: string }) {
  if (!token) {
    return <span className="text-sm text-[#778179]">Accepted</span>;
  }
  const invitePath = `/invite?token=${encodeURIComponent(token)}`;
  const resolvedInviteLink =
    inviteLink ??
    (typeof window === "undefined" ? invitePath : `${window.location.origin}${invitePath}`);

  async function copyInviteLink() {
    if (!token || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(resolvedInviteLink);
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <a
        className="min-w-0 truncate rounded-md border border-[#d1ddd5] bg-white/70 px-2.5 py-1 text-xs font-semibold text-[#52635a] transition hover:border-[#9fb5a6] hover:bg-white"
        href={invitePath}
        title={resolvedInviteLink}
      >
        {resolvedInviteLink}
      </a>
      <button
        className="grid size-8 shrink-0 place-items-center rounded-md border border-[#d1ddd5] bg-white/75 text-[#315f42] transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none"
        onClick={copyInviteLink}
        title="Copy invite link"
        type="button"
      >
        <Copy className="size-4" strokeWidth={1.8} />
      </button>
    </div>
  );
}
