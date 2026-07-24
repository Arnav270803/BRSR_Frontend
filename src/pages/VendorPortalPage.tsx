import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LogOut,
  MapPin,
  Store,
} from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { logout } from "../api/auth";
import { ApiError } from "../api/client";
import {
  getVendorPortalContext,
  listVendorPortalRequests,
  updateVendorPortalProfile,
} from "../api/vendorPortal";
import type { VendorDataRequestStatus } from "../api/vendors";
import { WorkspacePageState } from "../sections/workspace/WorkspacePageState";

const statusLabels: Record<VendorDataRequestStatus, string> = {
  DRAFT: "Draft",
  SENT: "Ready to start",
  IN_PROGRESS: "In progress",
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  CHANGES_REQUESTED: "Changes requested",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

function statusClass(status: VendorDataRequestStatus) {
  if (status === "APPROVED") {
    return "border-[#b9d6c1] bg-[#edf7ef] text-[#2e6b43]";
  }
  if (status === "SUBMITTED") {
    return "border-[#b9cde0] bg-[#eef5fb] text-[#285d83]";
  }
  if (status === "CHANGES_REQUESTED" || status === "OVERDUE") {
    return "border-[#e2c6bd] bg-[#fff5f0] text-[#92452f]";
  }

  return "border-[#ded2b4] bg-[#fbf6e9] text-[#775d20]";
}

export function VendorPortalPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const contextQuery = useQuery({
    queryKey: ["vendor-portal", vendorId],
    queryFn: () => getVendorPortalContext(vendorId!),
    enabled: Boolean(vendorId),
  });
  const requestsQuery = useQuery({
    queryKey: ["vendor-portal-requests", vendorId],
    queryFn: () => listVendorPortalRequests(vendorId!),
    enabled: Boolean(vendorId),
  });
  const profileMutation = useMutation({
    mutationFn: (input: Parameters<typeof updateVendorPortalProfile>[1]) =>
      updateVendorPortalProfile(vendorId!, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vendor-portal", vendorId] });
      setProfileMessage("Supplier profile updated.");
      setProfileOpen(false);
    },
    onError: (error) =>
      setProfileMessage(
        error instanceof ApiError ? error.message : "Unable to update supplier profile.",
      ),
  });
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  if (!vendorId) {
    return <Navigate replace to="/login" />;
  }
  if (contextQuery.isLoading || requestsQuery.isLoading) {
    return <WorkspacePageState message="Loading supplier portal..." />;
  }
  if (contextQuery.isError || requestsQuery.isError) {
    return <WorkspacePageState message="Unable to load supplier portal." tone="error" />;
  }

  const context = contextQuery.data!.data;
  const requests = requestsQuery.data!.data;
  const actionRequests = requests.filter((request) =>
    ["SENT", "IN_PROGRESS", "CHANGES_REQUESTED", "OVERDUE"].includes(request.status),
  );
  const submittedCount = requests.filter((request) => request.status === "SUBMITTED").length;
  const approvedCount = requests.filter((request) => request.status === "APPROVED").length;
  const sortedRequests = useMemo(
    () =>
      [...requests].sort(
        (left, right) =>
          new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime(),
      ),
    [requests],
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="relative mx-auto min-h-screen w-full max-w-[1540px] px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
        <header className="rounded-lg border border-white/70 bg-white/60 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#1f5135] text-white">
                <Store className="size-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-[#142019]">
                  {context.vendor.displayName}
                </p>
                <p className="truncate text-xs text-[#68756d]">
                  Supplier portal for {context.company.displayName}
                </p>
              </div>
            </div>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#cdd9d1] bg-white/70 px-3 text-sm font-semibold text-[#243128]"
              disabled={logoutMutation.isPending}
              type="button"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="size-4" strokeWidth={1.8} />
              Sign out
            </button>
          </div>
        </header>

        <section className="mt-3 rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:mt-4 sm:p-6">
          <p className="text-sm font-semibold text-[#426a52]">Data collaboration</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#142019] sm:text-3xl">
            Your reporting requests
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#647169]">
            Submit activity quantities requested by {context.company.displayName}. The
            company reviews each submission before it enters its emissions reporting.
          </p>
        </section>

        <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
          <PortalMetric label="Needs action" value={actionRequests.length} />
          <PortalMetric label="In review" value={submittedCount} />
          <PortalMetric label="Approved" value={approvedCount} />
        </div>

        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
          <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#426a52]">Requests</p>
                <h2 className="mt-1 text-xl font-semibold text-[#142019]">
                  Reporting queue
                </h2>
              </div>
              <ClipboardList className="size-5 text-[#426a52]" strokeWidth={1.8} />
            </div>

            <div className="mt-5 grid gap-3">
              {sortedRequests.length > 0 ? (
                sortedRequests.map((request) => (
                  <Link
                    className="grid gap-3 rounded-lg border border-[#dbe5df] bg-white/60 p-4 transition hover:border-[#a9c2b0] hover:bg-white sm:grid-cols-[minmax(0,1fr)_auto]"
                    key={request.id}
                    to={`/vendor/${vendorId}/requests/${request.id}`}
                  >
                    <span className="min-w-0">
                      <span className="block text-base font-semibold text-[#203128]">
                        {request.title}
                      </span>
                      <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6b786f]">
                        <span>{request.reportingYear.label}</span>
                        <span>{request.site.name}</span>
                        <span>{request.items.length} activities</span>
                      </span>
                      <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#526158]">
                        <CalendarDays className="size-3.5" strokeWidth={1.8} />
                        Due {new Date(request.dueDate).toLocaleDateString("en-IN")}
                      </span>
                    </span>
                    <span
                      className={`h-fit w-fit rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(
                        request.status,
                      )}`}
                    >
                      {statusLabels[request.status]}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-[#c8d6cd] bg-white/45 p-8 text-center">
                  <CheckCircle2 className="mx-auto size-6 text-[#426a52]" strokeWidth={1.8} />
                  <p className="mt-3 text-sm font-semibold text-[#243128]">
                    No reporting requests yet
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#6b786f]">
                    New requests from the company will appear here.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="grid content-start gap-3 sm:gap-4">
            <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#426a52]">Supplier profile</p>
                  <h2 className="mt-1 text-lg font-semibold text-[#142019]">
                    Registered details
                  </h2>
                </div>
                <Building2 className="size-5 text-[#426a52]" strokeWidth={1.8} />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <ProfileValue label="Legal name" value={context.vendor.legalName} />
                <ProfileValue label="Primary email" value={context.vendor.primaryEmail} />
                <ProfileValue
                  label="Location"
                  value={[context.vendor.city, context.vendor.state, context.vendor.country]
                    .filter(Boolean)
                    .join(", ")}
                />
                <ProfileValue
                  label="Vendor code"
                  value={context.vendor.vendorCode ?? "Not assigned"}
                />
              </div>

              {context.membership.role === "VENDOR_ADMIN" ? (
                <button
                  className="mt-4 h-10 w-full rounded-md border border-[#cbd8d0] bg-white/70 px-3 text-sm font-semibold text-[#24342a]"
                  type="button"
                  onClick={() => setProfileOpen((current) => !current)}
                >
                  {profileOpen ? "Close profile editor" : "Update profile"}
                </button>
              ) : null}

              {profileOpen ? (
                <form
                  className="mt-4 grid gap-3 border-t border-[#dce5df] pt-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const form = new FormData(event.currentTarget);
                    profileMutation.mutate({
                      legalName: String(form.get("legalName") ?? "").trim(),
                      displayName: String(form.get("displayName") ?? "").trim(),
                      primaryPhone: String(form.get("primaryPhone") ?? "").trim() || null,
                      website: String(form.get("website") ?? "").trim() || null,
                      industry: String(form.get("industry") ?? "").trim() || null,
                      country: String(form.get("country") ?? "").trim(),
                      state: String(form.get("state") ?? "").trim(),
                      city: String(form.get("city") ?? "").trim(),
                      address: String(form.get("address") ?? "").trim() || null,
                      taxId: String(form.get("taxId") ?? "").trim() || null,
                    });
                  }}
                >
                  <ProfileInput
                    defaultValue={context.vendor.legalName}
                    label="Legal name"
                    name="legalName"
                    required
                  />
                  <ProfileInput
                    defaultValue={context.vendor.displayName}
                    label="Display name"
                    name="displayName"
                    required
                  />
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <ProfileInput
                      defaultValue={context.vendor.primaryPhone ?? ""}
                      label="Phone"
                      name="primaryPhone"
                    />
                    <ProfileInput
                      defaultValue={context.vendor.website ?? ""}
                      label="Website"
                      name="website"
                    />
                  </div>
                  <ProfileInput
                    defaultValue={context.vendor.industry ?? ""}
                    label="Industry"
                    name="industry"
                  />
                  <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    <ProfileInput
                      defaultValue={context.vendor.city}
                      label="City"
                      name="city"
                      required
                    />
                    <ProfileInput
                      defaultValue={context.vendor.state}
                      label="State"
                      name="state"
                      required
                    />
                    <ProfileInput
                      defaultValue={context.vendor.country}
                      label="Country"
                      name="country"
                      required
                    />
                  </div>
                  <ProfileInput
                    defaultValue={context.vendor.address ?? ""}
                    label="Address"
                    name="address"
                  />
                  <ProfileInput
                    defaultValue={context.vendor.taxId ?? ""}
                    label="Tax ID"
                    name="taxId"
                  />
                  <button
                    className="h-10 rounded-md bg-[#1f5135] px-3 text-sm font-semibold text-white disabled:opacity-60"
                    disabled={profileMutation.isPending}
                    type="submit"
                  >
                    {profileMutation.isPending ? "Saving..." : "Save profile"}
                  </button>
                </form>
              ) : null}

              {profileMessage ? (
                <p className="mt-3 rounded-md border border-[#d9e2dc] bg-white/55 px-3 py-2 text-xs leading-5 text-[#526158]">
                  {profileMessage}
                </p>
              ) : null}
            </section>

            <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur-2xl">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-[#426a52]" strokeWidth={1.8} />
                <p className="text-sm font-semibold text-[#243128]">Assigned sites</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {context.sites.map((site) => (
                  <span
                    className="rounded-md border border-[#d2ded6] bg-white/65 px-2.5 py-1.5 text-xs font-semibold text-[#526158]"
                    key={site.id}
                  >
                    {site.name}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function PortalMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/55 px-3 py-3 shadow-sm backdrop-blur-xl sm:px-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold tracking-[0.08em] text-[#718079] uppercase">
          {label}
        </p>
        <Clock3 className="size-3.5 text-[#426a52]" strokeWidth={1.8} />
      </div>
      <p className="mt-1 text-xl font-semibold text-[#17231d]">{value}</p>
    </div>
  );
}

function ProfileValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3">
      <p className="text-[10px] font-semibold tracking-[0.08em] text-[#718079] uppercase">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-[#243128]">{value}</p>
    </div>
  );
}

function ProfileInput({
  defaultValue,
  label,
  name,
  required = false,
}: {
  defaultValue: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="text-xs font-semibold text-[#526158]">{label}</span>
      <input
        className="mt-1.5 h-10 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 text-sm outline-none focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
        defaultValue={defaultValue}
        name={name}
        required={required}
      />
    </label>
  );
}
