import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { downloadReportingYearReportPdf, getReportingYearReport } from "../api/reports";
import { getCompanyWorkspace } from "../api/workspace";
import { ReportControls } from "../sections/reports/ReportControls";
import { ReportPreview } from "../sections/reports/ReportPreview";
import { ReportsHeader } from "../sections/reports/ReportsHeader";
import { WorkspacePageState } from "../sections/workspace/WorkspacePageState";
import { WorkspaceSidebar } from "../sections/workspace/WorkspaceSidebar";

export function CompanyReportsPage() {
  const { companyId, siteId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [generatedReportingYearId, setGeneratedReportingYearId] = useState<string>();
  const [isDownloading, setIsDownloading] = useState(false);
  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });
  const workspace = workspaceQuery.data?.data;
  const reportingYears = workspace?.reportingYears ?? [];
  const activeSite = workspace?.sites.find((site) => site.id === siteId) ?? workspace?.sites[0];
  const requestedYearId = searchParams.get("year");
  const selectedReportingYearId = useMemo(() => {
    const requestedYear = reportingYears.find((year) => year.id === requestedYearId);

    return requestedYear?.id ?? reportingYears[0]?.id ?? "";
  }, [reportingYears, requestedYearId]);
  const reportQuery = useQuery({
    queryKey: ["report", companyId, activeSite?.id, generatedReportingYearId],
    queryFn: () => getReportingYearReport(companyId!, generatedReportingYearId!, activeSite?.id),
    enabled: Boolean(companyId && activeSite && generatedReportingYearId),
  });

  useEffect(() => {
    if (!requestedYearId && selectedReportingYearId) {
      setSearchParams({ year: selectedReportingYearId }, { replace: true });
    }
  }, [requestedYearId, selectedReportingYearId, setSearchParams]);

  if (!companyId) {
    return <Navigate replace to="/login" />;
  }

  if (workspaceQuery.isLoading) {
    return <WorkspacePageState message="Loading reports..." />;
  }

  if (workspaceQuery.isError || !workspace) {
    return <WorkspacePageState message="Unable to load reports." tone="error" />;
  }

  const currentWorkspace = workspace;
  const currentSite = activeSite;
  if (!currentSite) {
    return <WorkspacePageState message="Create a site before generating reports." tone="error" />;
  }

  if (!siteId || siteId !== currentSite.id) {
    return <Navigate replace to={`/app/${companyId}/sites/${currentSite.id}/reports`} />;
  }

  const currentSiteId = currentSite.id;
  const report = reportQuery.data?.data;
  const visibleReport =
    report?.reportingYear.id === selectedReportingYearId ? report : undefined;
  const canDownload = Boolean(
    visibleReport && generatedReportingYearId === selectedReportingYearId
  );

  function selectReportingYear(reportingYearId: string) {
    setSearchParams({ year: reportingYearId });
  }

  function generateReport() {
    if (selectedReportingYearId) {
      setGeneratedReportingYearId(selectedReportingYearId);
    }
  }

  async function downloadReport() {
    if (!generatedReportingYearId || generatedReportingYearId !== selectedReportingYearId) {
      return;
    }

    setIsDownloading(true);

    try {
      const { blob, filename } = await downloadReportingYearReportPdf(
        currentWorkspace.company.id,
        generatedReportingYearId,
        currentSiteId,
      );
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = filename ?? `${currentWorkspace.company.displayName}-BRSR-report.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:flex-row lg:px-5 xl:gap-5 2xl:px-8">
        <WorkspaceSidebar
          activeItem="reports"
          companyId={currentWorkspace.company.id}
          companyName={currentWorkspace.company.displayName}
          currentSiteId={currentSite.id}
          currentReportingYearId={selectedReportingYearId}
          isPlatformOwner={currentWorkspace.isPlatformOwner}
          reportingYears={reportingYears}
          sites={currentWorkspace.sites}
          viewerRole={currentWorkspace.viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <ReportsHeader
            canDownload={canDownload}
            companyName={currentWorkspace.company.displayName}
            isDownloading={isDownloading}
            viewerRole={currentWorkspace.viewerRole}
            onDownload={downloadReport}
          />

          {reportingYears.length > 0 ? (
            <>
              <ReportControls
                generatedReportingYearId={generatedReportingYearId}
                isGenerating={reportQuery.isFetching}
                reportingYears={reportingYears}
                selectedReportingYearId={selectedReportingYearId}
                onGenerate={generateReport}
                onReportingYearChange={selectReportingYear}
              />
              {reportQuery.isError ? (
                <section className="rounded-lg border border-[#e2c6bd] bg-[#fff7f3]/80 p-5 text-sm font-semibold text-[#8a3f2a] shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl">
                  Unable to generate this report.
                </section>
              ) : (
                <ReportPreview isLoading={reportQuery.isFetching} report={visibleReport} />
              )}
            </>
          ) : (
            <section className="rounded-lg border border-white/70 bg-white/55 p-6 text-sm font-semibold text-[#243128] shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl">
              Create a reporting year before generating a report.
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
