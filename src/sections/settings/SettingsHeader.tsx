import { Building2, LockKeyhole, ShieldCheck } from "lucide-react";
import type { CompanyWorkspace } from "../workspace/workspaceData";

export function SettingsHeader({ workspace }: { workspace: CompanyWorkspace }) {
  return (
    <header className="rounded-lg border border-white/70 bg-white/60 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 xl:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#1f5135] text-white shadow-sm sm:size-14">
            <Building2 className="size-6" strokeWidth={1.8} />
          </span>

          <div className="min-w-0">
            <h1 className="text-2xl font-semibold leading-tight text-[#16211b] sm:text-3xl">
              Company settings
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#bcd7c5] bg-[#edf7f0] px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#257044]">
                {workspace.company.status}
              </span>
              <span className="rounded-md border border-[#cbd6cf] bg-white/60 px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">
                {workspace.viewerRole}
              </span>
            </div>
            <p className="mt-2 max-w-[19rem] text-sm leading-6 text-[#66736b] sm:max-w-3xl">
              Review the company profile, workspace readiness, and access state that the backend
              exposes for this company workspace.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:w-[380px]">
          <div className="rounded-lg border border-[#d8e2dc] bg-white/50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#718078]">
              <LockKeyhole className="size-4" strokeWidth={1.8} />
              V1 mode
            </div>
            <p className="mt-2 text-sm font-semibold text-[#203128]">Read only</p>
          </div>
          <div className="rounded-lg border border-[#d8e2dc] bg-white/50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#718078]">
              <ShieldCheck className="size-4" strokeWidth={1.8} />
              Workspace
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-[#203128]">
              {workspace.company.displayName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
