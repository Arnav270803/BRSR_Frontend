import { CheckCircle2, CircleDashed } from "lucide-react";
import type { CompanyWorkspace } from "../workspace/workspaceData";
import { getCompletedSetupCount, getSetupStatusLabel } from "./settingsUtils";

export function WorkspaceReadinessPanel({ workspace }: { workspace: CompanyWorkspace }) {
  const setupItems = [
    {
      label: "Reporting year",
      description: "At least one active company cycle exists.",
      ready: workspace.setup.reportingYearsReady,
    },
    {
      label: "GHG activity selection",
      description: "Activities have been selected for company use.",
      ready: workspace.setup.ghgActivitySelectionReady,
    },
    {
      label: "Field configuration",
      description: "Selected activities can drive the data-entry surface.",
      ready: workspace.setup.fieldConfigurationReady,
    },
  ];

  return (
    <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.09)] backdrop-blur-2xl sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#2f6d48]">Workspace readiness</p>
          <h2 className="mt-1 text-lg font-semibold text-[#18251d]">
            {getSetupStatusLabel(workspace.setup)}
          </h2>
        </div>
        <span className="rounded-md border border-[#d1ded6] bg-white/60 px-3 py-2 text-sm font-semibold text-[#2f6d48]">
          {getCompletedSetupCount(workspace.setup)}/3
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {setupItems.map((item) => {
          const Icon = item.ready ? CheckCircle2 : CircleDashed;

          return (
            <div
              className="flex items-start gap-3 rounded-lg border border-[#dbe5df] bg-white/45 p-4"
              key={item.label}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                  item.ready ? "bg-[#e8f5ec] text-[#2d7b48]" : "bg-[#f7f1e6] text-[#9b7340]"
                }`}
              >
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-[#203128]">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-[#6b7970]">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
