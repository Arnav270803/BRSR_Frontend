import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import {
  createReportingYear as createReportingYearApi,
  listReportingYears,
} from "../api/reportingYears";
import { getCompanyWorkspace } from "../api/workspace";
import { CreateReportingYearPanel } from "../sections/reportingYears/CreateReportingYearPanel";
import { ReportingYearMetrics } from "../sections/reportingYears/ReportingYearMetrics";
import { ReportingYearsHeader } from "../sections/reportingYears/ReportingYearsHeader";
import { ReportingYearsList } from "../sections/reportingYears/ReportingYearsList";
import type { CreateReportingYearValues } from "../sections/reportingYears/reportingYearsData";
import { WorkspacePageState } from "../sections/workspace/WorkspacePageState";
import { WorkspaceSidebar } from "../sections/workspace/WorkspaceSidebar";

export function CompanyReportingYearsPage() {
  const { companyId } = useParams();
  const queryClient = useQueryClient();
  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });
  const reportingYearsQuery = useQuery({
    queryKey: ["reporting-years", companyId],
    queryFn: () => listReportingYears(companyId!),
    enabled: Boolean(companyId),
  });
  const createReportingYearMutation = useMutation({
    mutationFn: (values: CreateReportingYearValues) =>
      createReportingYearApi(companyId!, values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reporting-years", companyId] }),
        queryClient.invalidateQueries({ queryKey: ["company-workspace", companyId] }),
      ]);
    },
  });

  if (!companyId) {
    return <Navigate replace to="/login" />;
  }

  if (workspaceQuery.isLoading || reportingYearsQuery.isLoading) {
    return <ReportingYearsShell message="Loading reporting years..." />;
  }

  if (workspaceQuery.isError || reportingYearsQuery.isError) {
    return <ReportingYearsShell message="Unable to load reporting years." tone="error" />;
  }

  const workspace = workspaceQuery.data!.data;
  const company = workspace.company;
  const reportingYears = reportingYearsQuery.data!.data;
  const viewerRole = workspace.viewerRole;
  const canCreateReportingYear = viewerRole !== "USER";
  const totalSelectedActivities = reportingYears.reduce(
    (total, reportingYear) => total + reportingYear.selectedGhgActivityCount,
    0,
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:flex-row lg:px-5 xl:gap-5 2xl:px-8">
        <WorkspaceSidebar
          activeItem="reportingYears"
          companyId={company.id}
          companyName={company.displayName}
          reportingYears={reportingYears}
          viewerRole={viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <ReportingYearsHeader
            canCreateReportingYear={canCreateReportingYear}
            company={company}
            companyId={company.id}
            defaultReportingYearId={reportingYears[0]?.id}
            viewerRole={viewerRole}
          />

          <ReportingYearMetrics
            reportingYears={reportingYears}
            totalSelectedActivities={totalSelectedActivities}
          />

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-5 2xl:grid-cols-[minmax(0,1fr)_460px]">
            <ReportingYearsList
              canManageSetup={canCreateReportingYear}
              companyId={company.id}
              reportingYears={reportingYears}
            />
            <CreateReportingYearPanel
              canCreate={canCreateReportingYear}
              createReportingYear={(values) => createReportingYearMutation.mutateAsync(values).then(() => undefined)}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function ReportingYearsShell({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  return <WorkspacePageState message={message} tone={tone} />;
}
