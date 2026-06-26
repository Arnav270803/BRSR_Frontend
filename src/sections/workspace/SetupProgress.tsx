import { Check, Circle, Leaf, Settings2, TimerReset } from "lucide-react";
import type { WorkspaceSetup } from "./workspaceData";

type SetupItem = {
  label: string;
  status: string;
  ready: boolean;
  icon: typeof TimerReset;
};

export function SetupProgress({ setup }: { setup: WorkspaceSetup }) {
  const items: SetupItem[] = [
    {
      label: "Reporting year",
      status: setup.reportingYearsReady ? "Ready" : "Pending",
      ready: setup.reportingYearsReady,
      icon: TimerReset,
    },
    {
      label: "GHG activity selection",
      status: setup.ghgActivitySelectionReady ? "Ready" : "Pending",
      ready: setup.ghgActivitySelectionReady,
      icon: Leaf,
    },
    {
      label: "Field configuration",
      status: setup.fieldConfigurationReady ? "Ready" : "Pending",
      ready: setup.fieldConfigurationReady,
      icon: Settings2,
    },
  ];
  const readyCount = items.filter((item) => item.ready).length;
  const progress = Math.round((readyCount / items.length) * 100);

  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Setup progress</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">
            {readyCount} of {items.length} ready
          </h2>
        </div>
        <span className="w-fit rounded-md border border-[#cbd9d1] bg-white/65 px-3 py-2 text-sm font-semibold text-[#52635a]">
          {progress}%
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#dfe9e2]">
        <div
          className="h-full rounded-full bg-[#2f6b45] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3 2xl:gap-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              className="rounded-lg border border-[#d9e2dc] bg-white/55 p-3 sm:p-4 2xl:p-5"
              key={item.label}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-9 place-items-center rounded-md bg-[#eef4f0] text-[#315f42] sm:size-10">
                  <Icon className="size-4 sm:size-5" strokeWidth={1.8} />
                </span>
                <span
                  className={`grid size-7 place-items-center rounded-full border ${
                    item.ready
                      ? "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
                      : "border-[#d8ded9] bg-white/70 text-[#89948d]"
                  }`}
                >
                  {item.ready ? (
                    <Check className="size-4" strokeWidth={2} />
                  ) : (
                    <Circle className="size-3" strokeWidth={2} />
                  )}
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#1e2b23]">{item.label}</p>
              <p className="mt-1 text-xs font-semibold text-[#65716a]">{item.status}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
