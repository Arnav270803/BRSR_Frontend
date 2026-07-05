import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import {
  listGhgActivities,
  listGhgActivitySelections,
  listGhgCategories,
  updateGhgActivitySelections,
} from "../api/ghg";
import { getCompanyWorkspace } from "../api/workspace";
import { GhgActivityCatalog } from "../sections/ghgSetup/GhgActivityCatalog";
import { GhgSelectedPreview } from "../sections/ghgSetup/GhgSelectedPreview";
import { GhgSetupHeader } from "../sections/ghgSetup/GhgSetupHeader";
import { GhgSetupMetrics } from "../sections/ghgSetup/GhgSetupMetrics";
import { WorkspacePageState } from "../sections/workspace/WorkspacePageState";
import { WorkspaceSidebar } from "../sections/workspace/WorkspaceSidebar";

function areSetsEqual(left: Set<string>, right: Set<string>) {
  if (left.size !== right.size) {
    return false;
  }

  for (const value of left) {
    if (!right.has(value)) {
      return false;
    }
  }

  return true;
}

export function CompanyGhgSetupPage() {
  const { companyId, siteId, reportingYearId } = useParams();
  const catalogRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });
  const resolvedSiteId =
    workspaceQuery.data?.data.sites.find((site) => site.id === siteId)?.id ??
    workspaceQuery.data?.data.sites[0]?.id;
  const categoriesQuery = useQuery({
    queryKey: ["ghg-categories"],
    queryFn: listGhgCategories,
  });
  const activitiesQuery = useQuery({
    queryKey: ["ghg-activities"],
    queryFn: listGhgActivities,
  });
  const selectionsQuery = useQuery({
    queryKey: ["ghg-selections", companyId, resolvedSiteId, reportingYearId],
    queryFn: () => listGhgActivitySelections(companyId!, reportingYearId!, resolvedSiteId),
    enabled: Boolean(companyId && reportingYearId && resolvedSiteId),
  });
  const saveSelectionsMutation = useMutation({
    mutationFn: (activityIds: string[]) =>
      updateGhgActivitySelections(companyId!, reportingYearId!, activityIds, resolvedSiteId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["ghg-selections", companyId, resolvedSiteId, reportingYearId] }),
        queryClient.invalidateQueries({ queryKey: ["company-workspace", companyId] }),
        queryClient.invalidateQueries({ queryKey: ["reporting-years", companyId] }),
      ]);
    },
  });
  const [selectedActivityIds, setSelectedActivityIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const initialSelectedIds = useMemo(
    () =>
      new Set(
        selectionsQuery.data?.data.selectedActivities.map((selection) => selection.activity.id) ??
          [],
      ),
    [selectionsQuery.data],
  );

  useEffect(() => {
    if (selectionsQuery.data) {
      setSelectedActivityIds(initialSelectedIds);
    }
  }, [initialSelectedIds, selectionsQuery.data]);

  useEffect(() => {
    if (
      !workspaceQuery.isSuccess ||
      !categoriesQuery.isSuccess ||
      !activitiesQuery.isSuccess ||
      !selectionsQuery.isSuccess ||
      !window.matchMedia("(max-width: 1023px)").matches
    ) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 160);

    return () => window.clearTimeout(scrollTimer);
  }, [
    activitiesQuery.isSuccess,
    categoriesQuery.isSuccess,
    reportingYearId,
    selectionsQuery.isSuccess,
    siteId,
    workspaceQuery.isSuccess,
  ]);

  if (!companyId || !reportingYearId) {
    return <Navigate replace to="/login" />;
  }

  if (
    workspaceQuery.isLoading ||
    categoriesQuery.isLoading ||
    activitiesQuery.isLoading ||
    selectionsQuery.isLoading
  ) {
    return <GhgSetupShell message="Loading GHG setup..." />;
  }

  if (
    workspaceQuery.isError ||
    categoriesQuery.isError ||
    activitiesQuery.isError ||
    selectionsQuery.isError
  ) {
    return <GhgSetupShell message="Unable to load GHG setup." tone="error" />;
  }

  const workspace = workspaceQuery.data!.data;
  const company = workspace.company;
  const activeSite = workspace.sites.find((site) => site.id === siteId) ?? workspace.sites[0];

  if (!activeSite) {
    return <GhgSetupShell message="Create a site before configuring GHG setup." tone="error" />;
  }

  if (!siteId || siteId !== activeSite.id) {
    return (
      <Navigate
        replace
        to={`/app/${companyId}/sites/${activeSite.id}/reporting-years/${reportingYearId}/ghg-setup`}
      />
    );
  }

  const viewerRole = workspace.viewerRole;
  const canEdit = viewerRole !== "USER";
  const reportingYear = selectionsQuery.data!.data.reportingYear;
  const categories = categoriesQuery.data!.data;
  const activities = activitiesQuery.data!.data;
  const hasUnsavedChanges = !areSetsEqual(selectedActivityIds, initialSelectedIds);
  const selectedActivities = activities.filter((activity) =>
    selectedActivityIds.has(activity.id),
  );
  const selectedCategoryCount = new Set(
    selectedActivities.map((activity) => activity.categoryId),
  ).size;

  function toggleActivity(activityId: string) {
    if (!canEdit) {
      return;
    }

    setStatusMessage(null);
    setSelectedActivityIds((current) => {
      const next = new Set(current);

      if (next.has(activityId)) {
        next.delete(activityId);
      } else {
        next.add(activityId);
      }

      return next;
    });
  }

  function selectCategory(categoryId: string) {
    if (!canEdit) {
      return;
    }

    setStatusMessage(null);
    setSelectedActivityIds((current) => {
      const next = new Set(current);
      for (const activity of activities) {
        if (activity.categoryId === categoryId) {
          next.add(activity.id);
        }
      }

      return next;
    });
  }

  function clearSelections() {
    if (!canEdit) {
      return;
    }

    setStatusMessage(null);
    setSelectedActivityIds(new Set());
  }

  async function saveSelections() {
    if (!canEdit) {
      return;
    }

    if (selectedActivityIds.size === 0) {
      setStatusMessage("Select at least one activity before saving.");
      return;
    }

    try {
      await saveSelectionsMutation.mutateAsync([...selectedActivityIds]);
      setStatusMessage(`Saved ${selectedActivityIds.size} selected activities.`);
    } catch {
      setStatusMessage("Unable to save selected activities.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:flex-row lg:px-5 xl:gap-5 2xl:px-8">
        <WorkspaceSidebar
          activeItem="ghgSetup"
          companyId={company.id}
          companyName={company.displayName}
          currentSiteId={activeSite.id}
          currentReportingYearId={reportingYear.id}
          reportingYears={workspace.reportingYears}
          sites={workspace.sites}
          viewerRole={viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <GhgSetupHeader
            canEdit={canEdit}
            company={company}
            hasUnsavedChanges={hasUnsavedChanges}
            reportingYear={reportingYear}
            saveSelections={saveSelections}
            siteId={activeSite.id}
            viewerRole={viewerRole}
          />

          <GhgSetupMetrics
            categoryCount={categories.length}
            hasUnsavedChanges={hasUnsavedChanges}
            selectedCategoryCount={selectedCategoryCount}
            selectedCount={selectedActivityIds.size}
            totalActivities={activities.length}
          />

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-5 2xl:grid-cols-[minmax(0,1fr)_500px]">
            <div ref={catalogRef} className="scroll-mt-28">
              <GhgActivityCatalog
                activities={activities}
                canEdit={canEdit}
                categories={categories}
                selectedActivityIds={selectedActivityIds}
                selectCategory={selectCategory}
                toggleActivity={toggleActivity}
              />
            </div>
            <GhgSelectedPreview
              canEdit={canEdit}
              categories={categories}
              clearSelections={clearSelections}
              hasUnsavedChanges={hasUnsavedChanges}
              saveSelections={saveSelections}
              selectedActivities={selectedActivities}
              statusMessage={statusMessage}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function GhgSetupShell({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  return <WorkspacePageState message={message} tone={tone} />;
}
