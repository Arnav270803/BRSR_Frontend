import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  MailPlus,
  MapPin,
  Plus,
  Search,
  Send,
  Store,
  Users,
  XCircle,
} from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import { ApiError } from "../api/client";
import { updateCompanySettings } from "../api/companies";
import { listGhgActivitySelections } from "../api/ghg";
import {
  createVendor,
  createVendorDataRequest,
  cancelVendorDataRequest,
  getVendorAnalytics,
  inviteVendor,
  listVendorDataRequests,
  listVendors,
  reviewVendorDataRequest,
  sendVendorDataRequest,
  updateVendor,
  updateVendorSites,
  type CreateVendorInput,
  type Vendor,
  type VendorAnalytics,
  type VendorDataRequest,
  type VendorDataRequestStatus,
} from "../api/vendors";
import { getCompanyWorkspace } from "../api/workspace";
import { WorkspacePageState } from "../sections/workspace/WorkspacePageState";
import { WorkspaceSidebar } from "../sections/workspace/WorkspaceSidebar";

type ViewKey = "vendors" | "requests" | "analytics";

const statusLabels: Record<VendorDataRequestStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  IN_PROGRESS: "In progress",
  SUBMITTED: "Awaiting review",
  APPROVED: "Approved",
  CHANGES_REQUESTED: "Changes requested",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

function requestStatusClass(status: VendorDataRequestStatus) {
  if (status === "APPROVED") {
    return "border-[#b9d6c1] bg-[#edf7ef] text-[#2e6b43]";
  }
  if (status === "SUBMITTED") {
    return "border-[#b9cde0] bg-[#eef5fb] text-[#285d83]";
  }
  if (status === "OVERDUE" || status === "CHANGES_REQUESTED") {
    return "border-[#e2c6bd] bg-[#fff5f0] text-[#92452f]";
  }
  if (status === "CANCELLED") {
    return "border-[#d9d9d9] bg-[#f4f4f4] text-[#666]";
  }

  return "border-[#ded2b4] bg-[#fbf6e9] text-[#775d20]";
}

export function CompanyVendorsPage() {
  const { companyId } = useParams();
  const queryClient = useQueryClient();
  const [view, setView] = useState<ViewKey>("vendors");
  const [search, setSearch] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [analyticsSiteId, setAnalyticsSiteId] = useState("");
  const [analyticsReportingYearId, setAnalyticsReportingYearId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");

  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });
  const vendorTrackingEnabled =
    workspaceQuery.data?.data.company.vendorTrackingEnabled ?? false;
  const vendorsQuery = useQuery({
    queryKey: ["vendors", companyId],
    queryFn: () => listVendors(companyId!),
    enabled: Boolean(companyId && vendorTrackingEnabled),
  });
  const requestsQuery = useQuery({
    queryKey: ["vendor-data-requests", companyId],
    queryFn: () => listVendorDataRequests(companyId!),
    enabled: Boolean(companyId && vendorTrackingEnabled),
  });
  const analyticsQuery = useQuery({
    queryKey: [
      "vendor-analytics",
      companyId,
      analyticsSiteId,
      analyticsReportingYearId,
    ],
    queryFn: () =>
      getVendorAnalytics(companyId!, {
        siteId: analyticsSiteId || undefined,
        reportingYearId: analyticsReportingYearId || undefined,
      }),
    enabled: Boolean(companyId && vendorTrackingEnabled),
  });
  const enableTrackingMutation = useMutation({
    mutationFn: () => updateCompanySettings(companyId!, { vendorTrackingEnabled: true }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["company-workspace", companyId] });
      setMessageTone("success");
      setMessage("Vendor tracking is enabled. Add your first vendor.");
    },
  });
  const refreshVendorData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["vendors", companyId] }),
      queryClient.invalidateQueries({ queryKey: ["vendor-data-requests", companyId] }),
      queryClient.invalidateQueries({ queryKey: ["vendor-analytics", companyId] }),
      queryClient.invalidateQueries({ queryKey: ["company-workspace", companyId] }),
    ]);
  };

  if (!companyId) {
    return <Navigate replace to="/login" />;
  }
  if (workspaceQuery.isLoading) {
    return <WorkspacePageState message="Loading vendors and suppliers..." />;
  }
  if (workspaceQuery.isError) {
    return (
      <WorkspacePageState
        message="Unable to load the company vendor workspace."
        tone="error"
      />
    );
  }

  const workspace = workspaceQuery.data!.data;
  const activeSite = workspace.sites[0];
  const vendors = vendorsQuery.data?.data ?? [];
  const requests = requestsQuery.data?.data ?? [];
  const analytics = analyticsQuery.data?.data;
  const selectedVendor =
    vendors.find((vendor) => vendor.id === selectedVendorId) ?? vendors[0] ?? null;
  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ??
    requests.find((request) => request.status === "SUBMITTED") ??
    requests[0] ??
    null;

  if (workspace.viewerRole === "USER") {
    return (
      <WorkspacePageState
        message="Vendor management is available to company administrators."
        tone="error"
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:flex-row lg:px-5 xl:gap-5 2xl:px-8">
        <WorkspaceSidebar
          activeItem="vendors"
          companyId={workspace.company.id}
          companyName={workspace.company.displayName}
          currentSiteId={activeSite?.id}
          isPlatformOwner={workspace.isPlatformOwner}
          reportingYears={workspace.reportingYears}
          sites={workspace.sites}
          viewerRole={workspace.viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <header className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 xl:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#1f5135] text-white">
                  <Store className="size-6" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#426a52]">
                    Scope 3 collaboration
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold text-[#142019] sm:text-3xl">
                    Vendors &amp; Suppliers
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#647169]">
                    Register suppliers, request activity data, review submissions, and
                    include only approved records in company emissions.
                  </p>
                </div>
              </div>
              {vendorTrackingEnabled ? (
                <span className="w-fit rounded-md border border-[#b9d6c1] bg-[#edf7ef] px-3 py-2 text-xs font-semibold text-[#2e6b43]">
                  Vendor tracking active
                </span>
              ) : null}
            </div>
          </header>

          {!vendorTrackingEnabled ? (
            <section className="rounded-lg border border-[#d9e2dc] bg-white/55 p-5 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-6">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold text-[#426a52]">Company opt-in</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#142019]">
                  Enable supplier data collection
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#647169]">
                  This keeps existing company workflows unchanged. After enabling it,
                  choose which selected GHG activities are optional or required from
                  vendors, then create supplier requests here.
                </p>
                <button
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] disabled:opacity-60"
                  disabled={enableTrackingMutation.isPending}
                  type="button"
                  onClick={() => enableTrackingMutation.mutate()}
                >
                  <CheckCircle2 className="size-4" strokeWidth={1.8} />
                  {enableTrackingMutation.isPending
                    ? "Enabling..."
                    : "Enable vendor tracking"}
                </button>
                {enableTrackingMutation.isError ? (
                  <p className="mt-3 text-sm font-semibold text-[#9b3a32]">
                    {errorMessage(
                      enableTrackingMutation.error,
                      "Unable to enable vendor tracking.",
                    )}
                  </p>
                ) : null}
              </div>
            </section>
          ) : (
            <>
              <VendorMetrics vendors={vendors} requests={requests} analytics={analytics} />

              <div className="flex gap-1 overflow-x-auto rounded-lg border border-[#d9e2dc] bg-white/55 p-1.5 shadow-sm backdrop-blur-xl">
                {(
                  [
                    ["vendors", "Directory", Store],
                    ["requests", "Data requests", ClipboardCheck],
                    ["analytics", "Analytics", BarChart3],
                  ] as const
                ).map(([key, label, Icon]) => (
                  <button
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
                      view === key
                        ? "bg-[#1f5135] text-white"
                        : "text-[#617069] hover:bg-white/75 hover:text-[#243128]"
                    }`}
                    key={key}
                    type="button"
                    onClick={() => setView(key)}
                  >
                    <Icon className="size-4" strokeWidth={1.8} />
                    {label}
                  </button>
                ))}
              </div>

              {message ? (
                <p
                  className={`rounded-md border px-4 py-3 text-sm font-semibold ${
                    messageTone === "error"
                      ? "border-[#e2c6bd] bg-[#fff7f3] text-[#8a3f2a]"
                      : "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
                  }`}
                >
                  {message}
                </p>
              ) : null}

              {vendorsQuery.isLoading || requestsQuery.isLoading ? (
                <WorkspacePageState message="Loading supplier records..." />
              ) : vendorsQuery.isError || requestsQuery.isError ? (
                <WorkspacePageState
                  message="Unable to load supplier records."
                  tone="error"
                />
              ) : view === "vendors" ? (
                <VendorDirectoryView
                  companyId={companyId}
                  search={search}
                  selectedVendor={selectedVendor}
                  sites={workspace.sites}
                  vendors={vendors}
                  onMessage={(nextMessage, tone) => {
                    setMessage(nextMessage);
                    setMessageTone(tone);
                  }}
                  onRefresh={refreshVendorData}
                  onSearch={setSearch}
                  onSelectVendor={setSelectedVendorId}
                />
              ) : view === "requests" ? (
                <VendorRequestsView
                  companyId={companyId}
                  reportingYears={workspace.reportingYears}
                  requests={requests}
                  selectedRequest={selectedRequest}
                  sites={workspace.sites}
                  vendors={vendors}
                  onMessage={(nextMessage, tone) => {
                    setMessage(nextMessage);
                    setMessageTone(tone);
                  }}
                  onRefresh={refreshVendorData}
                  onSelectRequest={setSelectedRequestId}
                />
              ) : (
                <VendorAnalyticsView
                  analytics={analytics}
                  reportingYearId={analyticsReportingYearId}
                  reportingYears={workspace.reportingYears}
                  siteId={analyticsSiteId}
                  sites={workspace.sites}
                  onReportingYearChange={setAnalyticsReportingYearId}
                  onSiteChange={setAnalyticsSiteId}
                />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function VendorMetrics({
  analytics,
  requests,
  vendors,
}: {
  analytics: VendorAnalytics | undefined;
  requests: VendorDataRequest[];
  vendors: Vendor[];
}) {
  const activeVendors = vendors.filter((vendor) => vendor.status === "ACTIVE").length;
  const openRequests = requests.filter((request) =>
    ["SENT", "IN_PROGRESS", "CHANGES_REQUESTED", "OVERDUE"].includes(request.status),
  ).length;
  const reviewCount = requests.filter((request) => request.status === "SUBMITTED").length;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
      <CompactMetric label="Active vendors" value={activeVendors} />
      <CompactMetric label="Open requests" value={openRequests} />
      <CompactMetric label="Awaiting review" value={reviewCount} />
      <CompactMetric
        label="Request coverage"
        value={`${analytics?.summary.requestCoveragePercent ?? 0}%`}
      />
    </div>
  );
}

function CompactMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/55 px-3 py-3 shadow-sm backdrop-blur-xl sm:px-4">
      <p className="text-[10px] font-semibold tracking-[0.1em] text-[#718079] uppercase">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-[#17231d]">{value}</p>
    </div>
  );
}

function VendorDirectoryView({
  companyId,
  onMessage,
  onRefresh,
  onSearch,
  onSelectVendor,
  search,
  selectedVendor,
  sites,
  vendors,
}: {
  companyId: string;
  onMessage: (message: string, tone: "success" | "error") => void;
  onRefresh: () => Promise<void>;
  onSearch: (value: string) => void;
  onSelectVendor: (id: string) => void;
  search: string;
  selectedVendor: Vendor | null;
  sites: Array<{ id: string; name: string }>;
  vendors: Vendor[];
}) {
  const normalizedSearch = search.trim().toLowerCase();
  const filteredVendors = vendors.filter((vendor) =>
    [vendor.displayName, vendor.legalName, vendor.primaryEmail, vendor.vendorCode]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedSearch)),
  );

  return (
    <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_440px]">
      <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#426a52]">Supplier directory</p>
            <h2 className="mt-1 text-xl font-semibold text-[#142019]">
              Registered vendors
            </h2>
          </div>
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-[#d2ded6] bg-white/75 px-3 sm:w-72">
            <Search className="size-4 shrink-0 text-[#6f7d74]" strokeWidth={1.8} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              placeholder="Search name, email, code"
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
            />
          </label>
        </div>

        <div className="mt-5 grid gap-2">
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <button
                className={`grid gap-3 rounded-lg border p-4 text-left transition sm:grid-cols-[minmax(0,1fr)_auto] ${
                  selectedVendor?.id === vendor.id
                    ? "border-[#aac8b4] bg-[#edf6ef]"
                    : "border-[#dce5df] bg-white/55 hover:border-[#b8cbbf] hover:bg-white/80"
                }`}
                key={vendor.id}
                type="button"
                onClick={() => onSelectVendor(vendor.id)}
              >
                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold text-[#17231d]">
                    {vendor.displayName}
                  </span>
                  <span className="mt-1 block truncate text-sm text-[#65736b]">
                    {vendor.primaryEmail} / {vendor.city}, {vendor.country}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {vendor.sites.map((site) => (
                      <span
                        className="rounded-md border border-[#d4dfd7] bg-white/70 px-2 py-1 text-[11px] font-semibold text-[#596960]"
                        key={site.id}
                      >
                        {site.name}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="rounded-md border border-[#d4dfd7] bg-white/70 px-2 py-1 text-xs font-semibold text-[#596960]">
                    {vendor.requestCount} requests
                  </span>
                  <span
                    className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                      vendor.status === "ACTIVE"
                        ? "border-[#b9d6c1] bg-[#edf7ef] text-[#2e6b43]"
                        : "border-[#ded2b4] bg-[#fbf6e9] text-[#775d20]"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-[#c8d6cd] bg-white/45 p-6 text-sm text-[#617069]">
              No vendor matches this search.
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-4">
        <CreateVendorPanel
          companyId={companyId}
          sites={sites}
          onMessage={onMessage}
          onRefresh={onRefresh}
        />
        {selectedVendor ? (
          <VendorDetailPanel
            key={selectedVendor.id}
            companyId={companyId}
            sites={sites}
            vendor={selectedVendor}
            onMessage={onMessage}
            onRefresh={onRefresh}
          />
        ) : null}
      </div>
    </div>
  );
}

function CreateVendorPanel({
  companyId,
  onMessage,
  onRefresh,
  sites,
}: {
  companyId: string;
  onMessage: (message: string, tone: "success" | "error") => void;
  onRefresh: () => Promise<void>;
  sites: Array<{ id: string; name: string }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [siteIds, setSiteIds] = useState<string[]>(sites[0] ? [sites[0].id] : []);
  const createMutation = useMutation({
    mutationFn: (input: CreateVendorInput) => createVendor(companyId, input),
    onSuccess: async (response) => {
      await onRefresh();
      setIsOpen(false);
      onMessage(
        response.data.invitation?.emailSent
          ? "Vendor created and invitation email sent."
          : "Vendor created. The invitation link is available in its profile.",
        "success",
      );
    },
    onError: (error) => onMessage(errorMessage(error, "Unable to create vendor."), "error"),
  });

  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
      <button
        className="flex w-full items-center justify-between gap-3 text-left"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>
          <span className="block text-sm font-semibold text-[#426a52]">New vendor</span>
          <span className="mt-1 block text-lg font-semibold text-[#142019]">
            Register supplier
          </span>
        </span>
        <span className="grid size-10 place-items-center rounded-md bg-[#1f5135] text-white">
          <Plus className="size-5" strokeWidth={1.8} />
        </span>
      </button>

      {isOpen ? (
        <form
          className="mt-5 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            createMutation.mutate({
              legalName: String(form.get("legalName") ?? "").trim(),
              displayName: String(form.get("displayName") ?? "").trim(),
              vendorCode: String(form.get("vendorCode") ?? "").trim() || undefined,
              primaryEmail: String(form.get("primaryEmail") ?? "").trim(),
              industry: String(form.get("industry") ?? "").trim() || undefined,
              country: String(form.get("country") ?? "").trim(),
              state: String(form.get("state") ?? "").trim(),
              city: String(form.get("city") ?? "").trim(),
              siteIds,
              sendInvitation: form.get("sendInvitation") === "on",
              invitationRole: "VENDOR_ADMIN",
            });
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Legal name" name="legalName" required />
            <TextInput label="Display name" name="displayName" required />
            <TextInput label="Primary email" name="primaryEmail" required type="email" />
            <TextInput label="Vendor code" name="vendorCode" />
            <TextInput label="Industry" name="industry" />
            <TextInput label="Country" name="country" required />
            <TextInput label="State" name="state" required />
            <TextInput label="City" name="city" required />
          </div>
          <fieldset className="rounded-md border border-[#d9e2dc] bg-white/55 p-3">
            <legend className="px-1 text-sm font-semibold text-[#253229]">
              Assigned sites
            </legend>
            <div className="mt-1 grid gap-2 sm:grid-cols-2">
              {sites.map((site) => (
                <label className="flex items-center gap-2 text-sm text-[#526158]" key={site.id}>
                  <input
                    checked={siteIds.includes(site.id)}
                    className="size-4 accent-[#1f5135]"
                    type="checkbox"
                    onChange={(event) =>
                      setSiteIds((current) =>
                        event.target.checked
                          ? [...new Set([...current, site.id])]
                          : current.filter((id) => id !== site.id),
                      )
                    }
                  />
                  {site.name}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex items-start gap-3 rounded-md border border-[#d9e2dc] bg-white/55 p-3 text-sm text-[#526158]">
            <input
              className="mt-0.5 size-4 accent-[#1f5135]"
              defaultChecked
              name="sendInvitation"
              type="checkbox"
            />
            <span>
              <span className="block font-semibold text-[#253229]">
                Email portal invitation
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#65736b]">
                The vendor signs in with the invited email and sees only their requests.
              </span>
            </span>
          </label>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white disabled:opacity-60"
            disabled={createMutation.isPending || siteIds.length === 0}
            type="submit"
          >
            <Plus className="size-4" strokeWidth={1.8} />
            {createMutation.isPending ? "Creating..." : "Create vendor"}
          </button>
        </form>
      ) : null}
    </section>
  );
}

function VendorDetailPanel({
  companyId,
  onMessage,
  onRefresh,
  sites,
  vendor,
}: {
  companyId: string;
  onMessage: (message: string, tone: "success" | "error") => void;
  onRefresh: () => Promise<void>;
  sites: Array<{ id: string; name: string }>;
  vendor: Vendor;
}) {
  const [siteIds, setSiteIds] = useState<string[]>(vendor.sites.map((site) => site.id));
  const siteMutation = useMutation({
    mutationFn: () => updateVendorSites(companyId, vendor.id, siteIds),
    onSuccess: async () => {
      await onRefresh();
      onMessage("Vendor site access updated.", "success");
    },
    onError: (error) =>
      onMessage(errorMessage(error, "Unable to update vendor sites."), "error"),
  });
  const statusMutation = useMutation({
    mutationFn: (status: Vendor["status"]) => updateVendor(companyId, vendor.id, { status }),
    onSuccess: async () => {
      await onRefresh();
      onMessage("Vendor status updated.", "success");
    },
    onError: (error) =>
      onMessage(errorMessage(error, "Unable to update vendor status."), "error"),
  });
  const invitationMutation = useMutation({
    mutationFn: (input: {
      email: string;
      role: "VENDOR_ADMIN" | "VENDOR_CONTRIBUTOR";
    }) => inviteVendor(companyId, vendor.id, input),
    onSuccess: async (response) => {
      await onRefresh();
      onMessage(
        response.data.emailSent
          ? "Vendor portal invitation sent."
          : `Invitation created. Link: ${response.data.inviteLink}`,
        "success",
      );
    },
    onError: (error) =>
      onMessage(errorMessage(error, "Unable to invite vendor user."), "error"),
  });

  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#426a52]">Vendor profile</p>
          <h2 className="mt-1 truncate text-xl font-semibold text-[#142019]">
            {vendor.displayName}
          </h2>
          <p className="mt-1 truncate text-sm text-[#65736b]">{vendor.primaryEmail}</p>
        </div>
        <select
          className="h-9 rounded-md border border-[#d2ded6] bg-white/75 px-2 text-xs font-semibold text-[#243128]"
          value={vendor.status}
          onChange={(event) =>
            statusMutation.mutate(event.target.value as Vendor["status"])
          }
        >
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <SmallInfo label="Members" value={vendor.members.length} />
        <SmallInfo label="Approved records" value={vendor.approvedRecordCount} />
        <SmallInfo label="Location" value={`${vendor.city}, ${vendor.country}`} />
        <SmallInfo label="Code" value={vendor.vendorCode ?? "Not set"} />
      </div>

      <div className="mt-4 rounded-md border border-[#d9e2dc] bg-white/55 p-3">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-[#426a52]" strokeWidth={1.8} />
          <p className="text-sm font-semibold text-[#253229]">Site assignments</p>
        </div>
        <div className="mt-3 grid gap-2">
          {sites.map((site) => (
            <label className="flex items-center gap-2 text-sm text-[#526158]" key={site.id}>
              <input
                checked={siteIds.includes(site.id)}
                className="size-4 accent-[#1f5135]"
                type="checkbox"
                onChange={(event) =>
                  setSiteIds((current) =>
                    event.target.checked
                      ? [...new Set([...current, site.id])]
                      : current.filter((id) => id !== site.id),
                  )
                }
              />
              {site.name}
            </label>
          ))}
        </div>
        <button
          className="mt-3 h-9 rounded-md border border-[#bfd2c4] bg-[#edf6ef] px-3 text-xs font-semibold text-[#2f6b45] disabled:opacity-60"
          disabled={siteMutation.isPending || siteIds.length === 0}
          type="button"
          onClick={() => siteMutation.mutate()}
        >
          Save site access
        </button>
      </div>

      <form
        className="mt-4 rounded-md border border-[#d9e2dc] bg-white/55 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          invitationMutation.mutate({
            email: String(form.get("email") ?? "").trim(),
            role: String(form.get("role")) as
              | "VENDOR_ADMIN"
              | "VENDOR_CONTRIBUTOR",
          });
        }}
      >
        <div className="flex items-center gap-2">
          <MailPlus className="size-4 text-[#426a52]" strokeWidth={1.8} />
          <p className="text-sm font-semibold text-[#253229]">Invite portal user</p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_150px_40px]">
          <input
            className="h-10 min-w-0 flex-1 rounded-md border border-[#d2ded6] bg-white/75 px-3 text-sm outline-none"
            defaultValue={vendor.primaryEmail}
            name="email"
            required
            type="email"
          />
          <select
            className="h-10 rounded-md border border-[#d2ded6] bg-white/75 px-2 text-sm text-[#243128] outline-none"
            defaultValue="VENDOR_CONTRIBUTOR"
            name="role"
          >
            <option value="VENDOR_CONTRIBUTOR">Contributor</option>
            <option value="VENDOR_ADMIN">Vendor admin</option>
          </select>
          <button
            aria-label="Send vendor invitation"
            className="grid size-10 shrink-0 place-items-center rounded-md bg-[#1f5135] text-white disabled:opacity-60"
            disabled={invitationMutation.isPending}
            title="Send invitation"
            type="submit"
          >
            <Send className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </form>

      <div className="mt-5 border-t border-[#d9e2dc] pt-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#253229]">Portal users</h3>
          <span className="text-xs font-semibold text-[#65736b]">
            {vendor.members.length} active
          </span>
        </div>
        <div className="mt-3 grid gap-2">
          {vendor.members.length ? (
            vendor.members.map((member) => (
              <div
                className="flex items-center justify-between gap-3 border-b border-[#e2e9e4] pb-2 last:border-0 last:pb-0"
                key={member.membershipId}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#253229]">
                    {member.user.name ?? member.user.email}
                  </span>
                  <span className="block truncate text-xs text-[#65736b]">
                    {member.user.email}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-[#426a52]">
                  {member.role === "VENDOR_ADMIN" ? "Vendor admin" : "Contributor"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#65736b]">No portal user has accepted yet.</p>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-[#d9e2dc] pt-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#253229]">Recent invitations</h3>
          <span className="text-xs font-semibold text-[#65736b]">
            {vendor.recentInvitations.length} shown
          </span>
        </div>
        <div className="mt-3 grid gap-2">
          {vendor.recentInvitations.length ? (
            vendor.recentInvitations.map((invitation) => {
              const invitationStatus = invitation.acceptedAt
                ? "Accepted"
                : invitation.revokedAt
                  ? "Revoked"
                  : new Date(invitation.expiresAt).getTime() < Date.now()
                    ? "Expired"
                    : "Pending";

              return (
                <div
                  className="flex items-center justify-between gap-3 border-b border-[#e2e9e4] pb-2 last:border-0 last:pb-0"
                  key={invitation.id}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#253229]">
                      {invitation.email}
                    </span>
                    <span className="block text-xs text-[#65736b]">
                      {invitation.role === "VENDOR_ADMIN"
                        ? "Vendor admin"
                        : "Contributor"}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-[#65736b]">
                    {invitationStatus}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-[#65736b]">No invitations have been created.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function VendorRequestsView({
  companyId,
  onMessage,
  onRefresh,
  onSelectRequest,
  reportingYears,
  requests,
  selectedRequest,
  sites,
  vendors,
}: {
  companyId: string;
  onMessage: (message: string, tone: "success" | "error") => void;
  onRefresh: () => Promise<void>;
  onSelectRequest: (id: string) => void;
  reportingYears: Array<{ id: string; label: string }>;
  requests: VendorDataRequest[];
  selectedRequest: VendorDataRequest | null;
  sites: Array<{ id: string; name: string }>;
  vendors: Vendor[];
}) {
  return (
    <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_460px]">
      <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Collection workflow</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">Vendor requests</h2>
        </div>
        <div className="mt-5 grid gap-2">
          {requests.length > 0 ? (
            requests.map((request) => (
              <button
                className={`grid gap-3 rounded-lg border p-4 text-left transition sm:grid-cols-[minmax(0,1fr)_auto] ${
                  selectedRequest?.id === request.id
                    ? "border-[#aac8b4] bg-[#edf6ef]"
                    : "border-[#dce5df] bg-white/55 hover:border-[#b8cbbf]"
                }`}
                key={request.id}
                type="button"
                onClick={() => onSelectRequest(request.id)}
              >
                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold text-[#17231d]">
                    {request.title}
                  </span>
                  <span className="mt-1 block text-sm text-[#65736b]">
                    {request.vendor.displayName} / {request.site.name} /{" "}
                    {request.reportingYear.label}
                  </span>
                  <span className="mt-2 block text-xs text-[#718079]">
                    Due {new Date(request.dueDate).toLocaleDateString("en-IN")} /{" "}
                    {request.items.length} activities / {request.submissionRecords.length} records
                  </span>
                </span>
                <span
                  className={`h-fit rounded-md border px-2.5 py-1 text-xs font-semibold ${requestStatusClass(
                    request.status,
                  )}`}
                >
                  {statusLabels[request.status]}
                </span>
              </button>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-[#c8d6cd] bg-white/45 p-6 text-sm text-[#617069]">
              No vendor data requests exist yet.
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-4">
        <CreateVendorRequestPanel
          companyId={companyId}
          reportingYears={reportingYears}
          sites={sites}
          vendors={vendors}
          onMessage={onMessage}
          onRefresh={onRefresh}
        />
        {selectedRequest ? (
          <VendorRequestReviewPanel
            key={selectedRequest.id}
            companyId={companyId}
            request={selectedRequest}
            onMessage={onMessage}
            onRefresh={onRefresh}
          />
        ) : null}
      </div>
    </div>
  );
}

function CreateVendorRequestPanel({
  companyId,
  onMessage,
  onRefresh,
  reportingYears,
  sites,
  vendors,
}: {
  companyId: string;
  onMessage: (message: string, tone: "success" | "error") => void;
  onRefresh: () => Promise<void>;
  reportingYears: Array<{ id: string; label: string }>;
  sites: Array<{ id: string; name: string }>;
  vendors: Vendor[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? "");
  const [siteId, setSiteId] = useState(sites[0]?.id ?? "");
  const [reportingYearId, setReportingYearId] = useState(reportingYears[0]?.id ?? "");
  const [activitySelectionIds, setActivitySelectionIds] = useState<string[]>([]);
  const availableVendors = useMemo(
    () =>
      vendors.filter((vendor) =>
        vendor.sites.some((site) => site.id === siteId),
      ),
    [siteId, vendors],
  );

  useEffect(() => {
    if (!siteId && sites[0]) {
      setSiteId(sites[0].id);
    }
  }, [siteId, sites]);

  useEffect(() => {
    if (!reportingYearId && reportingYears[0]) {
      setReportingYearId(reportingYears[0].id);
    }
  }, [reportingYearId, reportingYears]);

  useEffect(() => {
    if (!availableVendors.some((vendor) => vendor.id === vendorId)) {
      setVendorId(availableVendors[0]?.id ?? "");
    }
  }, [availableVendors, vendorId]);

  useEffect(() => {
    setActivitySelectionIds([]);
  }, [reportingYearId, siteId]);

  const selectionsQuery = useQuery({
    queryKey: ["ghg-selections", companyId, siteId, reportingYearId],
    queryFn: () => listGhgActivitySelections(companyId, reportingYearId, siteId),
    enabled: Boolean(isOpen && siteId && reportingYearId),
  });
  const trackedSelections = useMemo(
    () =>
      (selectionsQuery.data?.data.selectedActivities ?? []).filter(
        (selection) => selection.vendorTrackingMode !== "NONE",
      ),
    [selectionsQuery.data],
  );
  const createMutation = useMutation({
    mutationFn: (input: Parameters<typeof createVendorDataRequest>[1]) =>
      createVendorDataRequest(companyId, input),
    onSuccess: async (response) => {
      await onRefresh();
      setIsOpen(false);
      setActivitySelectionIds([]);
      onMessage(
        response.data.status === "SENT"
          ? "Vendor data request sent."
          : "Vendor data request saved as draft.",
        "success",
      );
    },
    onError: (error) =>
      onMessage(errorMessage(error, "Unable to create vendor request."), "error"),
  });

  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
      <button
        className="flex w-full items-center justify-between gap-3 text-left"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>
          <span className="block text-sm font-semibold text-[#426a52]">New request</span>
          <span className="mt-1 block text-lg font-semibold text-[#142019]">
            Ask for supplier data
          </span>
        </span>
        <span className="grid size-10 place-items-center rounded-md bg-[#1f5135] text-white">
          <Plus className="size-5" strokeWidth={1.8} />
        </span>
      </button>

      {isOpen ? (
        <form
          className="mt-5 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            createMutation.mutate({
              vendorId,
              siteId,
              reportingYearId,
              title: String(form.get("title") ?? "").trim(),
              instructions: String(form.get("instructions") ?? "").trim() || undefined,
              dueDate: String(form.get("dueDate") ?? ""),
              activitySelectionIds,
              sendNow: form.get("sendNow") === "on",
            });
          }}
        >
          <SelectInput label="Vendor" value={vendorId} onChange={setVendorId}>
            {availableVendors.length === 0 ? (
              <option value="">No active vendor assigned to this site</option>
            ) : null}
            {availableVendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.displayName} ({vendor.status})
              </option>
            ))}
          </SelectInput>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectInput label="Site" value={siteId} onChange={setSiteId}>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </SelectInput>
            <SelectInput
              label="Reporting year"
              value={reportingYearId}
              onChange={setReportingYearId}
            >
              {reportingYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.label}
                </option>
              ))}
            </SelectInput>
          </div>
          <TextInput label="Request title" name="title" required />
          <TextInput label="Due date" name="dueDate" required type="date" />
          <label>
            <span className="text-sm font-semibold text-[#253229]">Instructions</span>
            <textarea
              className="mt-2 min-h-20 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 py-2 text-sm outline-none"
              name="instructions"
              placeholder="What documents or source details should the vendor use?"
            />
          </label>
          <fieldset className="max-h-64 overflow-y-auto rounded-md border border-[#d9e2dc] bg-white/55 p-3">
            <legend className="px-1 text-sm font-semibold text-[#253229]">
              Vendor-tracked activities
            </legend>
            {selectionsQuery.isLoading ? (
              <p className="text-sm text-[#65736b]">Loading configured activities...</p>
            ) : trackedSelections.length > 0 ? (
              <div className="grid gap-2">
                {trackedSelections.map((selection) => (
                  <label
                    className="flex items-start gap-2 rounded-md border border-[#e0e8e2] bg-white/60 p-2.5"
                    key={selection.selectionId}
                  >
                    <input
                      checked={activitySelectionIds.includes(selection.selectionId)}
                      className="mt-0.5 size-4 accent-[#1f5135]"
                      type="checkbox"
                      onChange={(event) =>
                        setActivitySelectionIds((current) =>
                          event.target.checked
                            ? [...new Set([...current, selection.selectionId])]
                            : current.filter((id) => id !== selection.selectionId),
                        )
                      }
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[#243128]">
                        {selection.customLabel ?? selection.activity.activity}
                      </span>
                      <span className="mt-1 block text-xs text-[#65736b]">
                        {selection.activity.category.name} / {selection.activity.scope} /{" "}
                        {selection.vendorTrackingMode}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-[#65736b]">
                No selected activity is marked Optional or Required for vendors. Configure
                tracking modes in GHG setup first.
              </p>
            )}
          </fieldset>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#253229]">
            <input
              className="size-4 accent-[#1f5135]"
              name="sendNow"
              type="checkbox"
            />
            Send immediately
          </label>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white disabled:opacity-60"
            disabled={
              createMutation.isPending ||
              !vendorId ||
              !siteId ||
              !reportingYearId ||
              activitySelectionIds.length === 0
            }
            type="submit"
          >
            <ClipboardCheck className="size-4" strokeWidth={1.8} />
            {createMutation.isPending ? "Creating..." : "Create request"}
          </button>
        </form>
      ) : null}
    </section>
  );
}

function VendorRequestReviewPanel({
  companyId,
  onMessage,
  onRefresh,
  request,
}: {
  companyId: string;
  onMessage: (message: string, tone: "success" | "error") => void;
  onRefresh: () => Promise<void>;
  request: VendorDataRequest;
}) {
  const [reviewNotes, setReviewNotes] = useState(request.reviewNotes ?? "");
  const sendMutation = useMutation({
    mutationFn: () => sendVendorDataRequest(companyId, request.id),
    onSuccess: async () => {
      await onRefresh();
      onMessage("Vendor data request sent.", "success");
    },
    onError: (error) =>
      onMessage(errorMessage(error, "Unable to send vendor request."), "error"),
  });
  const reviewMutation = useMutation({
    mutationFn: (action: "APPROVE" | "REQUEST_CHANGES") =>
      reviewVendorDataRequest(companyId, request.id, {
        action,
        notes: reviewNotes.trim() || undefined,
      }),
    onSuccess: async (response) => {
      await onRefresh();
      onMessage(
        response.data.status === "APPROVED"
          ? "Submission approved and emissions records created."
          : "Correction request sent back to the vendor.",
        "success",
      );
    },
    onError: (error) =>
      onMessage(errorMessage(error, "Unable to review vendor submission."), "error"),
  });
  const cancelMutation = useMutation({
    mutationFn: () => cancelVendorDataRequest(companyId, request.id),
    onSuccess: async () => {
      await onRefresh();
      onMessage("Vendor data request cancelled.", "success");
    },
    onError: (error) =>
      onMessage(errorMessage(error, "Unable to cancel vendor request."), "error"),
  });
  const canCancel = !["APPROVED", "CANCELLED"].includes(request.status);

  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#426a52]">Request details</p>
          <h2 className="mt-1 truncate text-lg font-semibold text-[#142019]">
            {request.title}
          </h2>
          <p className="mt-1 text-sm text-[#65736b]">{request.vendor.displayName}</p>
        </div>
        <span
          className={`rounded-md border px-2 py-1 text-xs font-semibold ${requestStatusClass(
            request.status,
          )}`}
        >
          {statusLabels[request.status]}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <SmallInfo label="Site" value={request.site.name} />
        <SmallInfo label="Year" value={request.reportingYear.label} />
        <SmallInfo label="Activities" value={request.items.length} />
        <SmallInfo label="Submitted rows" value={request.submissionRecords.length} />
      </div>

      <div className="mt-4 max-h-56 space-y-2 overflow-y-auto">
        {request.items.map((item) => {
          const itemRecords = request.submissionRecords.filter(
            (record) => record.requestItemId === item.id,
          );

          return (
            <div className="rounded-md border border-[#d9e2dc] bg-white/55 p-3" key={item.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#243128]">
                    {item.activity.label}
                  </p>
                  <p className="mt-1 text-xs text-[#65736b]">
                    {item.activity.scope} / {item.activity.unit} / {item.trackingMode}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#426a52]">
                  {itemRecords.length} rows
                </span>
              </div>
              {itemRecords.map((record) => (
                <p className="mt-2 text-xs text-[#65736b]" key={record.id}>
                  {record.recordDate}: {record.quantity} {item.activity.unit}
                  {record.notes ? ` / ${record.notes}` : ""}
                </p>
              ))}
            </div>
          );
        })}
      </div>

      {request.status === "DRAFT" ? (
        <button
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1f5135] px-3 text-sm font-semibold text-white disabled:opacity-60"
          disabled={sendMutation.isPending}
          type="button"
          onClick={() => sendMutation.mutate()}
        >
          <Send className="size-4" strokeWidth={1.8} />
          Send to vendor
        </button>
      ) : null}

      {request.status === "SUBMITTED" ? (
        <div className="mt-4">
          <label>
            <span className="text-sm font-semibold text-[#253229]">Review notes</span>
            <textarea
              className="mt-2 min-h-20 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 py-2 text-sm outline-none"
              placeholder="Optional approval note, required context for corrections"
              value={reviewNotes}
              onChange={(event) => setReviewNotes(event.target.value)}
            />
          </label>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              className="h-10 rounded-md border border-[#d7c6c1] bg-white/75 px-3 text-sm font-semibold text-[#8a3f2a] disabled:opacity-60"
              disabled={reviewMutation.isPending || reviewNotes.trim().length === 0}
              type="button"
              onClick={() => reviewMutation.mutate("REQUEST_CHANGES")}
            >
              Request changes
            </button>
            <button
              className="h-10 rounded-md bg-[#1f5135] px-3 text-sm font-semibold text-white disabled:opacity-60"
              disabled={reviewMutation.isPending}
              type="button"
              onClick={() => reviewMutation.mutate("APPROVE")}
            >
              Approve submission
            </button>
          </div>
        </div>
      ) : null}

      {canCancel ? (
        <button
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#d7c6c1] bg-white/75 px-3 text-sm font-semibold text-[#8a3f2a] disabled:opacity-60"
          disabled={
            sendMutation.isPending ||
            reviewMutation.isPending ||
            cancelMutation.isPending
          }
          type="button"
          onClick={() => {
            if (window.confirm("Cancel this vendor data request?")) {
              cancelMutation.mutate();
            }
          }}
        >
          <XCircle className="size-4" strokeWidth={1.8} />
          {cancelMutation.isPending ? "Cancelling..." : "Cancel request"}
        </button>
      ) : null}

      {request.reviewNotes ? (
        <p className="mt-4 rounded-md border border-[#e0e8e2] bg-white/55 p-3 text-sm leading-6 text-[#65736b]">
          {request.reviewNotes}
        </p>
      ) : null}
    </section>
  );
}

function VendorAnalyticsView({
  analytics,
  onReportingYearChange,
  onSiteChange,
  reportingYearId,
  reportingYears,
  siteId,
  sites,
}: {
  analytics: Awaited<ReturnType<typeof getVendorAnalytics>>["data"] | undefined;
  onReportingYearChange: (value: string) => void;
  onSiteChange: (value: string) => void;
  reportingYearId: string;
  reportingYears: Array<{ id: string; label: string }>;
  siteId: string;
  sites: Array<{ id: string; name: string }>;
}) {
  if (!analytics) {
    return <WorkspacePageState message="Loading vendor analytics..." />;
  }

  return (
    <div className="grid gap-4">
      <section className="flex flex-col gap-3 rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Analytics scope</p>
          <p className="mt-1 text-sm text-[#65736b]">
            Filter approved vendor emissions and collection coverage.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <SelectInput label="Site" value={siteId} onChange={onSiteChange}>
            <option value="">All sites</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            label="Reporting year"
            value={reportingYearId}
            onChange={onReportingYearChange}
          >
            <option value="">All reporting years</option>
            {reportingYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.label}
              </option>
            ))}
          </SelectInput>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
        <p className="text-sm font-semibold text-[#426a52]">Approved emissions</p>
        <h2 className="mt-1 text-xl font-semibold text-[#142019]">Top vendors</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-[#d9e2dc] bg-white/55">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-[#d9e2dc] bg-[#f3f7f4]/80 text-[11px] font-semibold tracking-[0.1em] text-[#65716a] uppercase">
                <tr>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Approved records</th>
                  <th className="px-4 py-3 text-right">kg CO2e</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e8e2]">
                {analytics.vendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="px-4 py-3 font-semibold text-[#243128]">
                      {vendor.displayName}
                    </td>
                    <td className="px-4 py-3 text-[#65736b]">{vendor.status}</td>
                    <td className="px-4 py-3 text-right text-[#65736b]">
                      {vendor.approvedRecordCount}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#183f2a]">
                      {Number(vendor.totalKgCo2e).toLocaleString("en-IN", {
                        maximumFractionDigits: 3,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
        <p className="text-sm font-semibold text-[#426a52]">Collection health</p>
        <h2 className="mt-1 text-xl font-semibold text-[#142019]">Request status</h2>
        <div className="mt-5 grid gap-2">
          {analytics.requestStatuses.map((row) => (
            <div
              className="flex items-center justify-between gap-3 rounded-md border border-[#d9e2dc] bg-white/55 px-3 py-3"
              key={row.status}
            >
              <span className="text-sm font-semibold text-[#526158]">
                {statusLabels[row.status]}
              </span>
              <span className="text-lg font-semibold text-[#17231d]">{row.count}</span>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}

function TextInput({
  label,
  name,
  required = false,
  type = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label>
      <span className="text-sm font-semibold text-[#253229]">{label}</span>
      <input
        className="mt-2 h-10 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 text-sm outline-none focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function SelectInput({
  children,
  label,
  onChange,
  value,
}: {
  children: React.ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label>
      <span className="text-sm font-semibold text-[#253229]">{label}</span>
      <select
        className="mt-2 h-10 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 text-sm outline-none focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </label>
  );
}

function SmallInfo({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3">
      <p className="text-[10px] font-semibold tracking-[0.08em] text-[#718079] uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-[#243128]">{value}</p>
    </div>
  );
}
