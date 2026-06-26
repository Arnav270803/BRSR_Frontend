import { DatabaseZap, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { CompanyWorkspace } from "../workspace/workspaceData";

export function AccessAndIntegrationPanel({ workspace }: { workspace: CompanyWorkspace }) {
  return (
    <div className="grid gap-3 sm:gap-4">
      <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.09)] backdrop-blur-2xl sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#2f6d48]">Access & roles</p>
            <h2 className="mt-1 text-lg font-semibold text-[#18251d]">Company access state</h2>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#edf5f0] text-[#2f6d48]">
            <ShieldCheck className="size-5" strokeWidth={1.8} />
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-lg border border-[#dbe5df] bg-white/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7a887f]">
              Your role
            </p>
            <p className="mt-2 text-lg font-semibold text-[#203128]">{workspace.viewerRole}</p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-[#dbe5df] bg-white/45 p-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7a887f]">
                Active members
              </p>
              <p className="mt-2 text-lg font-semibold text-[#203128]">
                {workspace.activeMemberCount}
              </p>
            </div>
            <Users className="size-5 shrink-0 text-[#2f6d48]" strokeWidth={1.8} />
          </div>
        </div>

        <Link
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md border border-[#cbd8d0] bg-white/65 px-4 text-sm font-semibold text-[#24342a] transition hover:border-[#9fb5a8] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none"
          to={`/app/${workspace.company.id}/employees`}
        >
          Manage employees
        </Link>
      </section>

      <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.09)] backdrop-blur-2xl sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#edf5f0] text-[#2f6d48]">
            <DatabaseZap className="size-5" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#2f6d48]">Integration status</p>
            <h2 className="mt-1 text-lg font-semibold text-[#18251d]">Backend compatible</h2>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-[#dbe5df] bg-[#f8faf7]/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7a887f]">
            Source endpoint
          </p>
          <p className="mt-2 break-words font-mono text-sm font-semibold text-[#203128]">
            GET /api/companies/:companyId/workspace
          </p>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#66736b]">
          This page is ready to replace demo data with the workspace API response once the frontend
          API layer is connected.
        </p>
      </section>
    </div>
  );
}
