import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Store } from "lucide-react";
import { updateCompanySettings } from "../../api/companies";
import { ApiError } from "../../api/client";
import type { CompanyWorkspace } from "../workspace/workspaceData";

export function VendorTrackingSettingsPanel({
  workspace,
}: {
  workspace: CompanyWorkspace;
}) {
  const queryClient = useQueryClient();
  const canEdit = workspace.isPlatformOwner || workspace.viewerRole === "ADMIN";
  const mutation = useMutation({
    mutationFn: (vendorTrackingEnabled: boolean) =>
      updateCompanySettings(workspace.company.id, { vendorTrackingEnabled }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["company-workspace", workspace.company.id],
      });
    },
  });
  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : "Unable to update vendor tracking.";

  return (
    <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.09)] backdrop-blur-2xl sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#2f6d48]">Scope 3 collaboration</p>
          <h2 className="mt-1 text-lg font-semibold text-[#18251d]">
            Vendor data collection
          </h2>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#edf5f0] text-[#2f6d48]">
          <Store className="size-5" strokeWidth={1.8} />
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#66736b]">
        Enable a separate supplier directory, activity requests, review workflow, and
        approved vendor emissions. Existing internal records remain unchanged.
      </p>

      <label className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-[#dbe5df] bg-white/55 p-4">
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-[#203128]">
            Vendor tracking
          </span>
          <span className="mt-1 block text-xs leading-5 text-[#6b786f]">
            {workspace.company.vendorTrackingEnabled
              ? "Active for this company"
              : "Off for this company"}
          </span>
        </span>
        <input
          checked={workspace.company.vendorTrackingEnabled}
          className="size-5 shrink-0 accent-[#1f5135]"
          disabled={!canEdit || mutation.isPending}
          type="checkbox"
          onChange={(event) => mutation.mutate(event.target.checked)}
        />
      </label>

      {!canEdit ? (
        <p className="mt-3 text-xs leading-5 text-[#6b786f]">
          Only a company administrator can change this setting.
        </p>
      ) : null}

      {mutation.isError ? (
        <p className="mt-3 rounded-md border border-[#e2c6bd] bg-[#fff7f3] px-3 py-2 text-sm font-semibold text-[#8a3f2a]">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
