import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CheckCircle2, MapPin, Plus, Star, Workflow } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  createCompanySite,
  listCompanySites,
  updateCompanySite,
  type CreateCompanySiteInput,
} from "../api/sites";
import { getCompanyWorkspace } from "../api/workspace";
import { WorkspacePageState } from "../sections/workspace/WorkspacePageState";
import { WorkspaceSidebar } from "../sections/workspace/WorkspaceSidebar";
import type { CompanySite } from "../sections/workspace/workspaceData";

const siteTypes = ["OFFICE", "PLANT", "WAREHOUSE", "BRANCH", "FACTORY", "OTHER"] as const;

const emptySiteForm: CreateCompanySiteInput = {
  name: "",
  type: "OTHER",
  country: "",
  state: "",
  city: "",
  address: "",
  isPrimary: false,
};

function fieldClass() {
  return "mt-2 h-11 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 text-sm text-[#16211b] shadow-sm outline-none transition placeholder:text-[#9aa39d] focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15";
}

export function CompanySitesPage() {
  const { companyId } = useParams();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateCompanySiteInput>(emptySiteForm);
  const [message, setMessage] = useState<string | null>(null);

  const workspaceQuery = useQuery({
    queryKey: ["company-workspace", companyId],
    queryFn: () => getCompanyWorkspace(companyId!),
    enabled: Boolean(companyId),
  });
  const sitesQuery = useQuery({
    queryKey: ["company-sites", companyId],
    queryFn: () => listCompanySites(companyId!),
    enabled: Boolean(companyId),
  });
  const createSiteMutation = useMutation({
    mutationFn: (values: CreateCompanySiteInput) => createCompanySite(companyId!, values),
    onSuccess: async () => {
      setForm(emptySiteForm);
      setMessage("Site created.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["company-sites", companyId] }),
        queryClient.invalidateQueries({ queryKey: ["company-workspace", companyId] }),
      ]);
    },
  });
  const markPrimaryMutation = useMutation({
    mutationFn: (siteId: string) => updateCompanySite(companyId!, siteId, { isPrimary: true }),
    onSuccess: async () => {
      setMessage("Primary site updated.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["company-sites", companyId] }),
        queryClient.invalidateQueries({ queryKey: ["company-workspace", companyId] }),
      ]);
    },
  });

  if (!companyId) {
    return <Navigate replace to="/login" />;
  }

  if (workspaceQuery.isLoading || sitesQuery.isLoading) {
    return <WorkspacePageState message="Loading sites..." />;
  }

  if (workspaceQuery.isError || sitesQuery.isError) {
    return <WorkspacePageState message="Unable to load company sites." tone="error" />;
  }

  const workspace = workspaceQuery.data!.data;
  const sites = sitesQuery.data!.data;
  const canManageSites = workspace.viewerRole !== "USER";
  const activeSite = workspace.sites[0];

  async function submitSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!form.name.trim() || !form.country.trim() || !form.state.trim() || !form.city.trim()) {
      setMessage("Site name, country, state, and city are required.");
      return;
    }

    await createSiteMutation.mutateAsync({
      ...form,
      name: form.name.trim(),
      country: form.country.trim(),
      state: form.state.trim(),
      city: form.city.trim(),
      address: form.address?.trim() || undefined,
    });
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:flex-row lg:px-5 xl:gap-5 2xl:px-8">
        <WorkspaceSidebar
          activeItem="sites"
          companyId={workspace.company.id}
          companyName={workspace.company.displayName}
          currentSiteId={activeSite?.id}
          reportingYears={workspace.reportingYears}
          sites={workspace.sites}
          viewerRole={workspace.viewerRole}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:py-2 xl:gap-5">
          <header className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#1f5135] text-white shadow-sm sm:size-14">
                  <MapPin className="size-6" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#426a52]">Company sites</p>
                  <h1 className="mt-1 text-3xl font-semibold tracking-normal text-[#142019] sm:text-4xl">
                    Site workspace setup
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#65716a] sm:text-base">
                    Manage the offices, plants, warehouses, and branches that keep separate GHG setup,
                    data entry, and reports under {workspace.company.displayName}.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 xl:w-[520px]">
                <Metric label="Sites" value={sites.length.toString()} />
                <Metric
                  label="Primary"
                  value={sites.find((site) => site.isPrimary)?.name ?? "Not set"}
                />
                <Metric label="Access" value={canManageSites ? "Admin" : "Assigned"} />
              </div>
            </div>
          </header>

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-5 2xl:grid-cols-[minmax(0,1fr)_480px]">
            <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#426a52]">Active sites</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#142019]">Site-level workspaces</h2>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#eef4f0] text-[#315f42]">
                  <Workflow className="size-5" strokeWidth={1.8} />
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {sites.map((site) => (
                  <SiteCard
                    canManageSites={canManageSites}
                    defaultReportingYearId={workspace.reportingYears[0]?.id}
                    isSaving={markPrimaryMutation.isPending}
                    key={site.id}
                    markPrimary={(siteId) => markPrimaryMutation.mutate(siteId)}
                    site={site}
                  />
                ))}
              </div>
            </section>

            <aside className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#426a52]">New site</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#142019]">Add workspace</h2>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#eef4f0] text-[#315f42]">
                  <Building2 className="size-5" strokeWidth={1.8} />
                </span>
              </div>

              {canManageSites ? (
                <form className="mt-5 grid gap-4" onSubmit={submitSite}>
                  <label>
                    <span className="text-sm font-semibold text-[#253229]">Site name</span>
                    <input
                      className={fieldClass()}
                      onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
                      placeholder="Delhi Plant"
                      value={form.name}
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-[#253229]">Site type</span>
                    <select
                      className={fieldClass()}
                      onChange={(event) => setForm((value) => ({ ...value, type: event.target.value }))}
                      value={form.type}
                    >
                      {siteTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-semibold text-[#253229]">Country</span>
                      <input
                        className={fieldClass()}
                        onChange={(event) => setForm((value) => ({ ...value, country: event.target.value }))}
                        placeholder="India"
                        value={form.country}
                      />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-[#253229]">State</span>
                      <input
                        className={fieldClass()}
                        onChange={(event) => setForm((value) => ({ ...value, state: event.target.value }))}
                        placeholder="Delhi"
                        value={form.state}
                      />
                    </label>
                  </div>

                  <label>
                    <span className="text-sm font-semibold text-[#253229]">City</span>
                    <input
                      className={fieldClass()}
                      onChange={(event) => setForm((value) => ({ ...value, city: event.target.value }))}
                      placeholder="New Delhi"
                      value={form.city}
                    />
                  </label>

                  <label>
                    <span className="text-sm font-semibold text-[#253229]">Address</span>
                    <textarea
                      className="mt-2 min-h-24 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 py-3 text-sm text-[#16211b] shadow-sm outline-none transition placeholder:text-[#9aa39d] focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
                      onChange={(event) => setForm((value) => ({ ...value, address: event.target.value }))}
                      placeholder="Optional address"
                      value={form.address ?? ""}
                    />
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border border-[#d9e2dc] bg-white/45 p-3 text-sm font-semibold text-[#253229]">
                    <input
                      checked={Boolean(form.isPrimary)}
                      className="size-4 accent-[#1f5135]"
                      onChange={(event) =>
                        setForm((value) => ({ ...value, isPrimary: event.target.checked }))
                      }
                      type="checkbox"
                    />
                    Mark as primary site
                  </label>

                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#8fa797]"
                    disabled={createSiteMutation.isPending}
                    type="submit"
                  >
                    <Plus className="size-4" strokeWidth={1.8} />
                    {createSiteMutation.isPending ? "Creating..." : "Create site"}
                  </button>
                </form>
              ) : (
                <div className="mt-5 rounded-lg border border-[#d9e2dc] bg-white/55 p-4 text-sm leading-6 text-[#65716a]">
                  Your role can work only inside assigned sites. Admins manage company site setup.
                </div>
              )}

              {message ? <p className="mt-4 text-sm font-semibold text-[#2f6b45]">{message}</p> : null}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d9e2dc] bg-white/50 p-3">
      <p className="text-[11px] font-semibold tracking-[0.1em] text-[#69756e] uppercase">
        {label}
      </p>
      <p className="mt-2 truncate text-base font-semibold text-[#142019]">{value}</p>
    </div>
  );
}

function SiteCard({
  canManageSites,
  defaultReportingYearId,
  isSaving,
  markPrimary,
  site,
}: {
  canManageSites: boolean;
  defaultReportingYearId?: string;
  isSaving: boolean;
  markPrimary: (siteId: string) => void;
  site: CompanySite;
}) {
  return (
    <article className="rounded-lg border border-[#d9e2dc] bg-white/55 p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-[#142019]">{site.name}</h3>
            {site.isPrimary ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-[#bcdac7] bg-[#edf8f1] px-2 py-1 text-xs font-semibold text-[#2f6b45]">
                <CheckCircle2 className="size-3.5" strokeWidth={2} />
                Primary
              </span>
            ) : null}
            <span className="rounded-md border border-[#d9e2dc] bg-white/65 px-2 py-1 text-xs font-semibold text-[#65716a]">
              {site.type}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#65716a]">
            {[site.city, site.state, site.country].filter(Boolean).join(", ")}
          </p>
          {site.address ? (
            <p className="mt-1 text-sm leading-6 text-[#65716a]">{site.address}</p>
          ) : null}
        </div>

        <div className="grid shrink-0 gap-2 sm:grid-cols-3 lg:w-[360px]">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#cdd9d1] bg-white/70 px-3 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white"
            to={`/app/${site.companyId}/sites/${site.id}`}
          >
            Open
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#cdd9d1] bg-white/70 px-3 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white"
            to={
              defaultReportingYearId
                ? `/app/${site.companyId}/sites/${site.id}/reporting-years/${defaultReportingYearId}/ghg-setup`
                : `/app/${site.companyId}/reporting-years`
            }
          >
            GHG setup
          </Link>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#cdd9d1] bg-white/70 px-3 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white disabled:cursor-not-allowed disabled:text-[#95a099]"
            disabled={!canManageSites || site.isPrimary || isSaving}
            onClick={() => markPrimary(site.id)}
            type="button"
          >
            <Star className="size-4" strokeWidth={1.8} />
            Primary
          </button>
        </div>
      </div>
    </article>
  );
}
