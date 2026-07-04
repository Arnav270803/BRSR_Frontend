import { Archive, ClipboardCheck, Download, FileCheck2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type RoadmapItem = {
  label: string;
  detail: string;
  icon: LucideIcon;
};

const roadmapItems: RoadmapItem[] = [
  {
    label: "Audit log",
    detail: "Show setup changes, invite acceptance, and data-record activity.",
    icon: ClipboardCheck,
  },
  {
    label: "BRSR export",
    detail: "Prepare year-end exports after the reporting review workflow exists.",
    icon: Download,
  },
  {
    label: "Evidence upload",
    detail: "Attach bills, source files, and supporting documents to records.",
    icon: Archive,
  },
  {
    label: "Approval review",
    detail: "Add admin approval before data is locked for final reporting.",
    icon: FileCheck2,
  },
];

export function GovernanceRoadmapPanel() {
  return (
    <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.09)] backdrop-blur-2xl sm:p-5">
      <div>
        <p className="text-sm font-semibold text-[#2f6d48]">Future governance</p>
        <h2 className="mt-1 text-lg font-semibold text-[#18251d]">Audit and export planning</h2>
        <p className="mt-2 text-sm leading-6 text-[#66736b]">
          These workflows are intentionally marked as planned until their backend endpoints and
          review rules are added.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {roadmapItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              className="flex items-start gap-3 rounded-lg border border-[#dbe5df] bg-white/45 p-4"
              key={item.label}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf5f0] text-[#2f6d48]">
                <Icon className="size-4" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[#203128]">{item.label}</p>
                  <span className="rounded-md border border-[#ded2b4] bg-[#fbf6e9] px-2 py-0.5 text-[11px] font-semibold text-[#775d20]">
                    Planned
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-[#6b7970]">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
