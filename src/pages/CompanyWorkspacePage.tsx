import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { listDataRecords } from "../api/dataRecords";
import { getCompanyWorkspace } from "../api/workspace";
import { ReportingYearsPanel } from "../sections/workspace/ReportingYearsPanel";
import { SetupProgress } from "../sections/workspace/SetupProgress";
import { WorkspaceHeader } from "../sections/workspace/WorkspaceHeader";
import { WorkspaceMetricCards } from "../sections/workspace/WorkspaceMetricCards";
import { WorkspaceSidebar } from "../sections/workspace/WorkspaceSidebar";

export function CompanyWorkspacePage() {
  const { companyId } = useParams();
  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });
  const defaultReportingYearId = workspaceQuery.data?.data.reportingYears[0]?.id;
  const dataRecordsQuery = useQuery({
    queryKey: ["data-records", companyId, defaultReportingYearId, "dashboard"],
    queryFn: () => listDataRecords(companyId!, defaultReportingYearId!),
    enabled: Boolean(companyId && defaultReportingYearId),
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

  const workspace = workspaceQuery.data!.data;
  const totalSelectedActivities = workspace.reportingYears.reduce(
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
          companyId={workspace.company.id}
          companyName={workspace.company.displayName}
          reportingYears={workspace.reportingYears}
          viewerRole={workspace.viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <WorkspaceHeader workspace={workspace} />

          <WorkspaceMetricCards
            activeMemberCount={workspace.activeMemberCount}
            reportingYearCount={workspace.reportingYears.length}
            setup={workspace.setup}
            totalSelectedActivities={totalSelectedActivities}
          />

          <SetupProgress
            activeReportingYear={workspace.reportingYears[0]}
            companyId={workspace.company.id}
            dataRecordCount={dataRecordsQuery.data?.data.length ?? 0}
            isDataRecordCountLoading={dataRecordsQuery.isLoading}
            workspace={workspace}
          />

          <ReportingYearsPanel
            companyId={workspace.company.id}
            reportingYears={workspace.reportingYears}
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
