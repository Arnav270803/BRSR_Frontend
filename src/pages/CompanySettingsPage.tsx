import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { getCompanyWorkspace } from "../api/workspace";
import { AccessAndIntegrationPanel } from "../sections/settings/AccessAndIntegrationPanel";
import { CompanyProfilePanel } from "../sections/settings/CompanyProfilePanel";
import { SettingsHeader } from "../sections/settings/SettingsHeader";
import { SettingsMetrics } from "../sections/settings/SettingsMetrics";
import { WorkspaceReadinessPanel } from "../sections/settings/WorkspaceReadinessPanel";
import { WorkspaceSidebar } from "../sections/workspace/WorkspaceSidebar";

export function CompanySettingsPage() {
  const { companyId } = useParams();
  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });

  if (!companyId) {
    return <Navigate replace to="/login" />;
  }

  if (workspaceQuery.isLoading) {
    return <SettingsShell message="Loading company settings..." />;
  }

  if (workspaceQuery.isError) {
    return <SettingsShell message="Unable to load company settings." tone="error" />;
  }

  const workspace = workspaceQuery.data!.data;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1920px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:flex-row lg:px-5 xl:gap-5 2xl:px-8">
        <WorkspaceSidebar
          activeItem="settings"
          companyId={workspace.company.id}
          companyName={workspace.company.displayName}
          reportingYears={workspace.reportingYears}
          viewerRole={workspace.viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <SettingsHeader workspace={workspace} />
          <SettingsMetrics workspace={workspace} />

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_430px] xl:gap-5 2xl:grid-cols-[minmax(0,1fr)_500px]">
            <div className="grid gap-3 sm:gap-4 xl:gap-5">
              <CompanyProfilePanel workspace={workspace} />
              <WorkspaceReadinessPanel workspace={workspace} />
            </div>
            <AccessAndIntegrationPanel workspace={workspace} />
          </div>
        </section>
      </div>
    </main>
  );
}

function SettingsShell({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef3ef] px-4 text-[#16211b]">
      <div
        className={`rounded-lg border p-5 text-sm font-semibold shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl ${
          tone === "error"
            ? "border-[#e2c6bd] bg-[#fff7f3] text-[#8a3f2a]"
            : "border-white/70 bg-white/60"
        }`}
      >
        {message}
      </div>
    </main>
  );
}
