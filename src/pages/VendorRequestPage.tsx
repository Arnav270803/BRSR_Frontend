import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Plus,
  Save,
  Send,
  Store,
  Trash2,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ApiError } from "../api/client";
import {
  getVendorPortalContext,
  getVendorPortalRequest,
  saveVendorSubmission,
  submitVendorDataRequest,
  type VendorSubmissionInput,
} from "../api/vendorPortal";
import type {
  VendorDataRequestItem,
  VendorDataRequestStatus,
} from "../api/vendors";
import { WorkspacePageState } from "../sections/workspace/WorkspacePageState";

type DraftRow = {
  clientId: string;
  requestItemId: string;
  recordDate: string;
  quantity: string;
  notes: string;
};

const editableStatuses: VendorDataRequestStatus[] = [
  "SENT",
  "IN_PROGRESS",
  "CHANGES_REQUESTED",
  "OVERDUE",
];

function newRow(requestItemId: string): DraftRow {
  return {
    clientId: crypto.randomUUID(),
    requestItemId,
    recordDate: "",
    quantity: "",
    notes: "",
  };
}

function activityLabel(item: VendorDataRequestItem) {
  return [item.activity.activity, item.activity.subtype, item.activity.variant]
    .filter(Boolean)
    .join(" - ");
}

export function VendorRequestPage() {
  const { vendorId, requestId } = useParams();
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const contextQuery = useQuery({
    queryKey: ["vendor-portal", vendorId],
    queryFn: () => getVendorPortalContext(vendorId!),
    enabled: Boolean(vendorId),
  });
  const requestQuery = useQuery({
    queryKey: ["vendor-portal-request", vendorId, requestId],
    queryFn: () => getVendorPortalRequest(vendorId!, requestId!),
    enabled: Boolean(vendorId && requestId),
  });
  const refreshRequest = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["vendor-portal-request", vendorId, requestId],
      }),
      queryClient.invalidateQueries({ queryKey: ["vendor-portal-requests", vendorId] }),
    ]);
  };
  const saveMutation = useMutation({
    mutationFn: (input: VendorSubmissionInput) =>
      saveVendorSubmission(vendorId!, requestId!, input),
    onSuccess: async () => {
      await refreshRequest();
      setMessageTone("success");
      setMessage("Draft saved.");
    },
    onError: (error) => {
      setMessageTone("error");
      setMessage(error instanceof ApiError ? error.message : "Unable to save this draft.");
    },
  });
  const submitMutation = useMutation({
    mutationFn: async (input: VendorSubmissionInput) => {
      await saveVendorSubmission(vendorId!, requestId!, input);
      return submitVendorDataRequest(vendorId!, requestId!);
    },
    onSuccess: async () => {
      await refreshRequest();
      setMessageTone("success");
      setMessage("Submission sent to the company for review.");
    },
    onError: (error) => {
      setMessageTone("error");
      setMessage(
        error instanceof ApiError ? error.message : "Unable to submit this request.",
      );
    },
  });

  const request = requestQuery.data?.data;
  useEffect(() => {
    if (!request) {
      return;
    }

    if (request.submissionRecords.length > 0) {
      setRows(
        request.submissionRecords.map((record) => ({
          clientId: record.id,
          requestItemId: record.requestItemId,
          recordDate: record.recordDate.slice(0, 10),
          quantity: record.quantity,
          notes: record.notes ?? "",
        })),
      );
      return;
    }

    setRows(
      request.items
        .filter((item) => item.trackingMode === "REQUIRED")
        .map((item) => newRow(item.id)),
    );
  }, [request]);

  if (!vendorId || !requestId) {
    return <Navigate replace to="/login" />;
  }
  if (contextQuery.isLoading || requestQuery.isLoading) {
    return <WorkspacePageState message="Loading supplier request..." />;
  }
  if (contextQuery.isError || requestQuery.isError || !request) {
    return <WorkspacePageState message="Unable to load supplier request." tone="error" />;
  }

  const context = contextQuery.data!.data;
  const isEditable = editableStatuses.includes(request.status);
  const groupedRows = Object.fromEntries(
    request.items.map((item) => [
      item.id,
      rows.filter((row) => row.requestItemId === item.id),
    ]),
  ) as Record<string, DraftRow[]>;

  function updateRow(clientId: string, patch: Partial<DraftRow>) {
    setMessage(null);
    setRows((current) =>
      current.map((row) => (row.clientId === clientId ? { ...row, ...patch } : row)),
    );
  }

  function removeRow(clientId: string) {
    setMessage(null);
    setRows((current) => current.filter((row) => row.clientId !== clientId));
  }

  function buildPayload(): VendorSubmissionInput | null {
    const incompleteRow = rows.find(
      (row) =>
        (row.recordDate && !row.quantity) ||
        (!row.recordDate && row.quantity) ||
        Number(row.quantity) <= 0,
    );

    if (incompleteRow) {
      setMessageTone("error");
      setMessage("Every started row needs a date and a quantity greater than zero.");
      return null;
    }

    return {
      records: rows
        .filter((row) => row.recordDate && row.quantity)
        .map((row) => ({
          requestItemId: row.requestItemId,
          recordDate: row.recordDate,
          quantity: Number(row.quantity),
          notes: row.notes.trim() || undefined,
        })),
    };
  }

  function saveDraft() {
    const payload = buildPayload();
    if (payload) {
      saveMutation.mutate(payload);
    }
  }

  function submitRequest() {
    const payload = buildPayload();
    if (!payload) {
      return;
    }

    const submittedItemIds = new Set(payload.records.map((record) => record.requestItemId));
    const missingRequired = request!.items.find(
      (item) => item.trackingMode === "REQUIRED" && !submittedItemIds.has(item.id),
    );

    if (missingRequired) {
      setMessageTone("error");
      setMessage(`Add at least one record for required activity: ${activityLabel(missingRequired)}.`);
      return;
    }
    if (payload.records.length === 0) {
      setMessageTone("error");
      setMessage("Add at least one activity record before submitting.");
      return;
    }

    submitMutation.mutate(payload);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef3ef] text-[#16211b]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e9f1ed_46%,#f7efe4_100%)]" />
      <div className="relative mx-auto min-h-screen w-full max-w-[1440px] px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
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
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#cdd9d1] bg-white/70 px-3 text-sm font-semibold text-[#243128]"
              to={`/vendor/${vendorId}`}
            >
              <ArrowLeft className="size-4" strokeWidth={1.8} />
              All requests
            </Link>
          </div>
        </header>

        <section className="mt-3 rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:mt-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#426a52]">Data request</p>
              <h1 className="mt-1 text-2xl font-semibold text-[#142019] sm:text-3xl">
                {request.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#647169]">
                {request.instructions ?? "Enter the requested activity data below."}
              </p>
            </div>
            <div className="grid min-w-60 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              <RequestMeta label="Status" value={request.status.replaceAll("_", " ")} />
              <RequestMeta label="Site" value={request.site.name} />
              <RequestMeta label="Year" value={request.reportingYear.label} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-md border border-[#d9e2dc] bg-white/55 px-3 py-2 text-sm text-[#526158]">
            <CalendarDays className="size-4 shrink-0 text-[#426a52]" strokeWidth={1.8} />
            Due {new Date(request.dueDate).toLocaleDateString("en-IN")}
          </div>

          {request.reviewNotes ? (
            <div className="mt-4 rounded-md border border-[#e2c6bd] bg-[#fff7f3] p-3">
              <p className="text-xs font-semibold tracking-[0.08em] text-[#92452f] uppercase">
                Company review
              </p>
              <p className="mt-1 text-sm leading-6 text-[#713c34]">{request.reviewNotes}</p>
            </div>
          ) : null}
        </section>

        <section className="mt-3 rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.08)] backdrop-blur-2xl sm:mt-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#426a52]">Activity data</p>
              <h2 className="mt-1 text-xl font-semibold text-[#142019]">
                Requested records
              </h2>
            </div>
            <ClipboardCheck className="size-5 text-[#426a52]" strokeWidth={1.8} />
          </div>

          <div className="mt-5 grid gap-4">
            {request.items.map((item) => (
              <section
                className="rounded-lg border border-[#dbe5df] bg-white/55 p-3 sm:p-4"
                key={item.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#203128]">
                        {activityLabel(item)}
                      </h3>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          item.trackingMode === "REQUIRED"
                            ? "border-[#e1c4ba] bg-[#fff5f0] text-[#8a3f2a]"
                            : "border-[#d2ded6] bg-[#f4f8f5] text-[#526158]"
                        }`}
                      >
                        {item.trackingMode}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-[#68756d]">
                      {item.activity.category.name} / {item.activity.scope ?? "Scope not set"} /{" "}
                      {item.activity.unit}
                    </p>
                  </div>
                  {isEditable ? (
                    <button
                      className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-[#cdd9d1] bg-white/75 px-3 text-xs font-semibold text-[#243128]"
                      type="button"
                      onClick={() =>
                        setRows((current) => [...current, newRow(item.id)])
                      }
                    >
                      <Plus className="size-3.5" strokeWidth={1.8} />
                      Add row
                    </button>
                  ) : null}
                </div>

                <div className="mt-3 grid gap-2">
                  {(groupedRows[item.id] ?? []).map((row) => (
                    <div
                      className="grid gap-2 rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3 md:grid-cols-[160px_150px_minmax(0,1fr)_40px]"
                      key={row.clientId}
                    >
                      <label>
                        <span className="text-[10px] font-semibold tracking-[0.06em] text-[#718079] uppercase">
                          Date
                        </span>
                        <input
                          className="mt-1 h-9 w-full rounded-md border border-[#d2ded6] bg-white/80 px-2 text-sm outline-none"
                          disabled={!isEditable}
                          type="date"
                          value={row.recordDate}
                          onChange={(event) =>
                            updateRow(row.clientId, { recordDate: event.target.value })
                          }
                        />
                      </label>
                      <label>
                        <span className="text-[10px] font-semibold tracking-[0.06em] text-[#718079] uppercase">
                          Quantity ({item.activity.unit})
                        </span>
                        <input
                          className="mt-1 h-9 w-full rounded-md border border-[#d2ded6] bg-white/80 px-2 text-sm outline-none"
                          disabled={!isEditable}
                          min="0"
                          step="any"
                          type="number"
                          value={row.quantity}
                          onChange={(event) =>
                            updateRow(row.clientId, { quantity: event.target.value })
                          }
                        />
                      </label>
                      <label>
                        <span className="text-[10px] font-semibold tracking-[0.06em] text-[#718079] uppercase">
                          Notes
                        </span>
                        <input
                          className="mt-1 h-9 w-full rounded-md border border-[#d2ded6] bg-white/80 px-2 text-sm outline-none"
                          disabled={!isEditable}
                          placeholder="Invoice, meter, or source note"
                          value={row.notes}
                          onChange={(event) =>
                            updateRow(row.clientId, { notes: event.target.value })
                          }
                        />
                      </label>
                      {isEditable ? (
                        <button
                          aria-label="Remove record row"
                          className="mt-4 grid size-9 place-items-center rounded-md border border-[#dfcdc7] bg-white/80 text-[#8a3f2a]"
                          type="button"
                          onClick={() => removeRow(row.clientId)}
                        >
                          <Trash2 className="size-4" strokeWidth={1.8} />
                        </button>
                      ) : null}
                    </div>
                  ))}

                  {(groupedRows[item.id] ?? []).length === 0 ? (
                    <div className="rounded-md border border-dashed border-[#c8d6cd] bg-white/40 px-3 py-4 text-center text-xs text-[#6b786f]">
                      No record added for this activity.
                    </div>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          {message ? (
            <p
              className={`mt-4 rounded-md border px-3 py-2 text-sm font-semibold ${
                messageTone === "error"
                  ? "border-[#e2c6bd] bg-[#fff7f3] text-[#8a3f2a]"
                  : "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
              }`}
            >
              {message}
            </p>
          ) : null}

          {isEditable ? (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#cbd8d0] bg-white/75 px-4 text-sm font-semibold text-[#24342a] disabled:opacity-60"
                disabled={saveMutation.isPending || submitMutation.isPending}
                type="button"
                onClick={saveDraft}
              >
                <Save className="size-4" strokeWidth={1.8} />
                {saveMutation.isPending ? "Saving..." : "Save draft"}
              </button>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white disabled:opacity-60"
                disabled={saveMutation.isPending || submitMutation.isPending}
                type="button"
                onClick={submitRequest}
              >
                <Send className="size-4" strokeWidth={1.8} />
                {submitMutation.isPending ? "Submitting..." : "Submit for review"}
              </button>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-2 rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-3 py-3 text-sm font-semibold text-[#2f6b45]">
              <CheckCircle2 className="size-4" strokeWidth={1.8} />
              {request.status === "APPROVED"
                ? "This submission has been approved."
                : "This submission is locked while the company reviews it."}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function RequestMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#d9e2dc] bg-white/55 px-3 py-2">
      <p className="text-[10px] font-semibold tracking-[0.08em] text-[#718079] uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-[#243128]">{value}</p>
    </div>
  );
}
