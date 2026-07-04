import { ShieldCheck, UsersRound } from "lucide-react";
import type { WorkspaceRole } from "../workspace/workspaceData";

export function ActiveMembersPanel({
  activeMemberCount,
  viewerRole,
}: {
  activeMemberCount: number;
  viewerRole: WorkspaceRole;
}) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Active members</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">Current workspace access</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#65716a]">
            The backend currently exposes the active member count. Detailed member rows, removal,
            and role changes should be added when member-management endpoints exist.
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#eef4f0] text-[#315f42]">
          <UsersRound className="size-5" strokeWidth={1.8} />
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[#d9e2dc] bg-white/55 p-4">
          <p className="text-xs font-semibold tracking-[0.1em] text-[#69756e] uppercase">
            Active members
          </p>
          <p className="mt-2 text-3xl font-semibold text-[#142019]">{activeMemberCount}</p>
        </div>
        <div className="rounded-lg border border-[#d9e2dc] bg-white/55 p-4">
          <p className="text-xs font-semibold tracking-[0.1em] text-[#69756e] uppercase">
            Your role
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-[#142019]">
            <ShieldCheck className="size-5 text-[#315f42]" strokeWidth={1.8} />
            {viewerRole.replace("_", " ")}
          </p>
        </div>
      </div>
    </section>
  );
}
