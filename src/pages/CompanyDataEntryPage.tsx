import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  createDataRecord,
  deleteDataRecord,
  listDataRecordsForSite,
} from "../api/dataRecords";
import { listGhgActivitySelections } from "../api/ghg";
import { getCurrentSession } from "../api/auth";
import { getCompanyWorkspace } from "../api/workspace";
import { DataEntryHeader } from "../sections/dataEntry/DataEntryHeader";
import { DataEntryMetrics } from "../sections/dataEntry/DataEntryMetrics";
import { DataRecordForm } from "../sections/dataEntry/DataRecordForm";
import { DataRecordsList } from "../sections/dataEntry/DataRecordsList";
import {
  type CreateDataRecordValues,
} from "../sections/dataEntry/dataEntryData";
import { toCreateRecordPayload } from "../sections/dataEntry/dataEntryUtils";
import { WorkspacePageState } from "../sections/workspace/WorkspacePageState";
import { WorkspaceSidebar } from "../sections/workspace/WorkspaceSidebar";

export function CompanyDataEntryPage() {
  const { companyId, siteId, reportingYearId } = useParams();
  const formRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentSession,
    retry: false,
    staleTime: 60_000,
  });
  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });
  const resolvedSiteId =
    workspaceQuery.data?.data.sites.find((site) => site.id === siteId)?.id ??
    workspaceQuery.data?.data.sites[0]?.id;
  const selectionsQuery = useQuery({
    queryKey: ["ghg-selections", companyId, resolvedSiteId, reportingYearId],
    queryFn: () => listGhgActivitySelections(companyId!, reportingYearId!, resolvedSiteId),
    enabled: Boolean(companyId && reportingYearId && resolvedSiteId),
  });
  const recordsQuery = useQuery({
    queryKey: ["data-records", companyId, resolvedSiteId, reportingYearId],
    queryFn: () => listDataRecordsForSite(companyId!, resolvedSiteId, reportingYearId!),
    enabled: Boolean(companyId && reportingYearId && resolvedSiteId),
  });
  const createRecordMutation = useMutation({
    mutationFn: (values: CreateDataRecordValues) =>
      createDataRecord(companyId!, reportingYearId!, toCreateRecordPayload(values), resolvedSiteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["data-records", companyId, resolvedSiteId, reportingYearId] });
    },
  });
  const deleteRecordMutation = useMutation({
    mutationFn: (dataRecordId: string) =>
      deleteDataRecord(companyId!, reportingYearId!, dataRecordId, resolvedSiteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["data-records", companyId, resolvedSiteId, reportingYearId] });
    },
  });

  useEffect(() => {
    if (
      !sessionQuery.isSuccess ||
      !workspaceQuery.isSuccess ||
      !selectionsQuery.isSuccess ||
      !recordsQuery.isSuccess ||
      !window.matchMedia("(max-width: 1023px)").matches
    ) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 160);

    return () => window.clearTimeout(scrollTimer);
  }, [
    recordsQuery.isSuccess,
    reportingYearId,
    selectionsQuery.isSuccess,
    sessionQuery.isSuccess,
    siteId,
    workspaceQuery.isSuccess,
  ]);

  if (!companyId || !reportingYearId) {
    return <Navigate replace to="/login" />;
  }

  if (
    sessionQuery.isLoading ||
    workspaceQuery.isLoading ||
    selectionsQuery.isLoading ||
    recordsQuery.isLoading
  ) {
    return <DataEntryShell message="Loading data entry..." />;
  }

  if (
    sessionQuery.isError ||
    workspaceQuery.isError ||
    selectionsQuery.isError ||
    recordsQuery.isError
  ) {
    return <DataEntryShell message="Unable to load data entry." tone="error" />;
  }

  const session = sessionQuery.data!.data;
  const workspace = workspaceQuery.data!.data;
  const company = workspace.company;
  const activeSite = workspace.sites.find((site) => site.id === siteId) ?? workspace.sites[0];

  if (!activeSite) {
    return <DataEntryShell message="Create a site before entering data." tone="error" />;
  }

  if (!siteId || siteId !== activeSite.id) {
    return (
      <Navigate
        replace
        to={`/app/${companyId}/sites/${activeSite.id}/reporting-years/${reportingYearId}/data`}
      />
    );
  }

  const reportingYear = selectionsQuery.data!.data.reportingYear;
  const viewerRole = workspace.viewerRole;
  const selectedActivities = selectionsQuery.data!.data.selectedActivities;
  const records = recordsQuery.data!.data;
  const totalEmissions = records.reduce(
    (total, record) => total + Number(record.calculatedKgCo2e ?? 0),
    0,
  );
  const latestRecord = records[0] ?? null;

  async function addRecord(values: CreateDataRecordValues) {
    await createRecordMutation.mutateAsync(values);
  }

  function removeRecord(recordId: string) {
    deleteRecordMutation.mutate(recordId);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:flex-row lg:px-5 xl:gap-5 2xl:px-8">
        <WorkspaceSidebar
          activeItem="dataEntry"
          companyId={company.id}
          companyName={company.displayName}
          currentSiteId={activeSite.id}
          currentReportingYearId={reportingYear.id}
          isPlatformOwner={workspace.isPlatformOwner}
          reportingYears={workspace.reportingYears}
          sites={workspace.sites}
          viewerRole={viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <DataEntryHeader
            company={company}
            reportingYear={reportingYear}
            selectedActivityCount={selectedActivities.length}
            siteId={activeSite.id}
            viewerRole={viewerRole}
          />

          <DataEntryMetrics
            latestRecord={latestRecord}
            recordCount={records.length}
            selectedActivityCount={selectedActivities.length}
            totalEmissions={totalEmissions}
          />

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_430px] xl:gap-5 2xl:grid-cols-[minmax(0,1fr)_500px]">
            <DataRecordsList
              currentUserId={session.user.id}
              records={records}
              onDeleteRecord={removeRecord}
              viewerRole={viewerRole}
            />
            <div ref={formRef} className="order-first scroll-mt-28 xl:order-none">
              <DataRecordForm
                onAddRecord={addRecord}
                records={records}
                selectedActivities={selectedActivities}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DataEntryShell({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  return <WorkspacePageState message={message} tone={tone} />;
}
