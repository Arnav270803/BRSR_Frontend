import { useState } from "react";
import { MapPin, ShieldCheck } from "lucide-react";
import type { CompanySiteMember } from "../../api/sites";
import type { CompanySite, WorkspaceRole } from "../workspace/workspaceData";

export function SiteAccessPanel({
  canManageAccess,
  members,
  saveSiteAccess,
  sites,
  viewerRole,
}: {
  canManageAccess: boolean;
  members: CompanySiteMember[];
  saveSiteAccess: (userId: string, siteIds: string[]) => Promise<void>;
  sites: CompanySite[];
  viewerRole: WorkspaceRole;
}) {
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  async function toggleSite(member: CompanySiteMember, siteId: string) {
    if (!canManageAccess || member.role === "ADMIN") {
      return;
    }

    const siteIds = member.siteIds.includes(siteId)
      ? member.siteIds.filter((id) => id !== siteId)
      : [...member.siteIds, siteId];

    setSavingUserId(member.userId);
    try {
      await saveSiteAccess(member.userId, siteIds);
    } finally {
      setSavingUserId(null);
    }
  }

  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Site access</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">Member site assignments</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#65716a]">
            Admins can use every site. Users only see the sites assigned here.
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#eef4f0] text-[#315f42]">
          <MapPin className="size-5" strokeWidth={1.8} />
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {members.map((member) => {
          const isAdmin = member.role === "ADMIN";
          const saving = savingUserId === member.userId;

          return (
            <article
              className="rounded-lg border border-[#d9e2dc] bg-white/55 p-4"
              key={member.userId}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#142019]">
                    {member.user.name ?? member.user.email}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#65716a]">{member.user.email}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-1 rounded-md border border-[#d9e2dc] bg-white/65 px-2 py-1 text-xs font-semibold text-[#65716a]">
                  {isAdmin ? <ShieldCheck className="size-3.5" strokeWidth={2} /> : null}
                  {member.role}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
                {sites.map((site) => {
                  const checked = isAdmin || member.siteIds.includes(site.id);

                  return (
                    <label
                      className={`flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                        checked
                          ? "border-[#bdd5c5] bg-[#edf8f1] text-[#1f5135]"
                          : "border-[#d9e2dc] bg-white/60 text-[#65716a]"
                      } ${
                        canManageAccess && !isAdmin
                          ? "cursor-pointer hover:border-[#9fb5a6]"
                          : "cursor-not-allowed opacity-80"
                      }`}
                      key={site.id}
                    >
                      <input
                        checked={checked}
                        className="size-4 accent-[#1f5135]"
                        disabled={!canManageAccess || isAdmin || saving}
                        onChange={() => toggleSite(member, site.id)}
                        type="checkbox"
                      />
                      <span className="min-w-0 truncate">{site.name}</span>
                    </label>
                  );
                })}
              </div>

              {isAdmin ? (
                <p className="mt-3 text-xs font-medium text-[#65716a]">
                  Admin role grants all company sites automatically.
                </p>
              ) : null}
              {viewerRole === "USER" ? (
                <p className="mt-3 text-xs font-medium text-[#65716a]">
                  Your account can view assigned sites only.
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
