import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { listDataRecordsForSite } from "../api/dataRecords";
import { getCompanyWorkspace } from "../api/workspace";
import { ReportingYearsPanel } from "../sections/workspace/ReportingYearsPanel";
import { SetupProgress } from "../sections/workspace/SetupProgress";
import { WorkspaceHeader } from "../sections/workspace/WorkspaceHeader";
import { WorkspaceMetricCards } from "../sections/workspace/WorkspaceMetricCards";
import { WorkspacePageState } from "../sections/workspace/WorkspacePageState";
import { WorkspaceSidebar } from "../sections/workspace/WorkspaceSidebar";

export function CompanyWorkspacePage() {
  const { companyId, siteId } = useParams();
  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });
  const workspace = workspaceQuery.data?.data;
  const activeSite = workspace?.sites.find((site) => site.id === siteId) ?? workspace?.sites[0];
  const defaultReportingYearId = workspaceQuery.data?.data.reportingYears[0]?.id;
  const dataRecordsQuery = useQuery({
    queryKey: ["data-records", companyId, activeSite?.id, defaultReportingYearId, "dashboard"],
    queryFn: () => listDataRecordsForSite(companyId!, activeSite!.id, defaultReportingYearId!),
    enabled: Boolean(companyId && activeSite && defaultReportingYearId),
  });

  if (!companyId) {
    return <Navigate replace to="/login" />;
  }

  if (workspaceQuery.isLoading) {
    return <WorkspaceShell message="Loading workspace..." />;
  }

  if (workspaceQuery.isError) {
    return <WorkspaceShell message="Unable to load this company workspace." tone="error" />;
  }

  const currentWorkspace = workspaceQuery.data!.data;
  const currentSite = activeSite;

  if (!currentSite) {
    return <WorkspaceShell message="Create a site before opening the workspace." tone="error" />;
  }

  if (!siteId || siteId !== currentSite.id) {
    return <Navigate replace to={`/app/${companyId}/sites/${currentSite.id}`} />;
  }

  const totalSelectedActivities = currentWorkspace.reportingYears.reduce(
    (total, reportingYear) => total + reportingYear.selectedGhgActivityCount,
    0,
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:flex-row lg:px-5 xl:gap-5 2xl:px-8">
        <WorkspaceSidebar
          activeItem="dashboard"
          companyId={currentWorkspace.company.id}
          companyName={currentWorkspace.company.displayName}
          currentSiteId={currentSite.id}
          reportingYears={currentWorkspace.reportingYears}
          sites={currentWorkspace.sites}
          viewerRole={currentWorkspace.viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <WorkspaceHeader activeSite={currentSite} workspace={currentWorkspace} />

          <WorkspaceMetricCards
            activeMemberCount={currentWorkspace.activeMemberCount}
            reportingYearCount={currentWorkspace.reportingYears.length}
            setup={currentWorkspace.setup}
            siteCount={currentWorkspace.sites.length}
            totalSelectedActivities={totalSelectedActivities}
          />

          <SetupProgress
            activeReportingYear={currentWorkspace.reportingYears[0]}
            companyId={currentWorkspace.company.id}
            dataRecordCount={dataRecordsQuery.data?.data.length ?? 0}
            isDataRecordCountLoading={dataRecordsQuery.isLoading}
            siteId={currentSite.id}
            workspace={currentWorkspace}
          />

          <ReportingYearsPanel
            companyId={currentWorkspace.company.id}
            reportingYears={currentWorkspace.reportingYears}
            siteId={currentSite.id}
          />
        </section>
      </div>
    </main>
  );
}

function WorkspaceShell({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  return <WorkspacePageState message={message} tone={tone} />;
}
