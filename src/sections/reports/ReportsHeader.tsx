import { Download, FileText } from "lucide-react";
import type { WorkspaceRole } from "../workspace/workspaceData";

type ReportsHeaderProps = {
  companyName: string;
  viewerRole: WorkspaceRole;
  canDownload: boolean;
  isDownloading: boolean;
  onDownload: () => void;
};

export function ReportsHeader({
  companyName,
  viewerRole,
  canDownload,
  isDownloading,
  onDownload,
}: ReportsHeaderProps) {
  return (
    <header className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_70px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 xl:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#1f5135] text-white shadow-md sm:size-14">
            <FileText className="size-6" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-[#142019] sm:text-3xl lg:text-4xl">
                Reports
              </h1>
              <span className="rounded-md border border-[#b9d6c0] bg-[#eef8f0] px-2 py-1 text-xs font-semibold text-[#2c7a47]">
                {viewerRole}
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#607067] sm:text-base">
              Generate an export-ready BRSR GHG report for {companyName} from the selected
              reporting year, GHG setup, and submitted data records.
            </p>
          </div>
        </div>

        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#173f2a] bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17442c] disabled:cursor-not-allowed disabled:border-[#b9c8bf] disabled:bg-[#d7e2dc] disabled:text-[#6d7b72] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none"
          disabled={!canDownload || isDownloading}
          type="button"
          onClick={onDownload}
        >
          <Download className="size-4" strokeWidth={1.8} />
          {isDownloading ? "Preparing PDF" : "Download PDF"}
        </button>
      </div>
    </header>
  );
}
