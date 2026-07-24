import { useEffect, useMemo, useState } from "react";
import { Calculator, Check, Plus, Search } from "lucide-react";
import { type FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError } from "../../api/client";
import type { VendorOption } from "../../api/vendors";
import type {
  CreateDataRecordValues,
  DataRecord,
  SelectedGhgActivity,
} from "./dataEntryData";
import {
  calculateKgCo2e,
  formatNumber,
  getActivityLabel,
  getActivityMetaLabel,
  getActivitySearchText,
  getSelectedActivity,
} from "./dataEntryUtils";

const createDataRecordSchema = z.object({
  ghgActivitySelectionId: z.string().trim().min(1, "Select a GHG activity"),
  vendorId: z.string().trim(),
  recordDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .min(1, "Record date is required"),
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required")
    .refine((value) => Number(value) > 0, "Quantity must be greater than zero"),
  notes: z.string().trim().max(2000, "Notes must be 2000 characters or less").optional(),
});

const defaultValues: CreateDataRecordValues = {
  ghgActivitySelectionId: "",
  vendorId: "",
  recordDate: "",
  quantity: "",
  notes: "",
};

function fieldClass(hasError?: boolean) {
  const base =
    "mt-2 h-11 w-full rounded-md border bg-white/75 px-3 text-sm text-[#16211b] shadow-sm outline-none transition placeholder:text-[#9aa39d] focus:ring-3";

  if (hasError) {
    return `${base} border-[#c9756c] focus:border-[#9b3a32] focus:ring-[#9b3a32]/15`;
  }

  return `${base} border-[#d2ded6] focus:border-[#678c72] focus:ring-[#426a52]/15`;
}

function FieldMessage({ error }: { error?: FieldError }) {
  if (!error?.message) {
    return null;
  }

  return <p className="mt-2 text-xs font-medium text-[#9b3a32]">{error.message}</p>;
}

export function DataRecordForm({
  initialScope,
  onAddRecord,
  records,
  selectedActivities,
  vendors,
}: {
  initialScope?: string | null;
  onAddRecord: (values: CreateDataRecordValues) => Promise<void>;
  records: DataRecord[];
  selectedActivities: SelectedGhgActivity[];
  vendors: VendorOption[];
}) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success">("success");
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = useForm<CreateDataRecordValues>({
    defaultValues,
  });
  const selectedActivityId = watch("ghgActivitySelectionId");
  const selectedVendorId = watch("vendorId");
  const quantity = watch("quantity");
  const selectedActivity = useMemo(
    () => getSelectedActivity(selectedActivities, selectedActivityId),
    [selectedActivities, selectedActivityId],
  );
  const recentSelectionIds = useMemo(() => {
    const seen = new Set<string>();

    for (const record of records) {
      if (!seen.has(record.ghgActivitySelectionId)) {
        seen.add(record.ghgActivitySelectionId);
      }
    }

    return seen;
  }, [records]);
  const calculatedKgCo2e = selectedActivity
    ? calculateKgCo2e(quantity, selectedActivity.activity.factorKgCo2e)
    : null;
  const vendorTrackingMode = selectedActivity?.vendorTrackingMode ?? "NONE";

  useEffect(() => {
    if (vendorTrackingMode === "NONE" && selectedVendorId) {
      setValue("vendorId", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [selectedVendorId, setValue, vendorTrackingMode]);

  async function onSubmit(values: CreateDataRecordValues) {
    clearErrors();
    setStatusMessage(null);
    setStatusTone("success");
    const result = createDataRecordSchema.safeParse(values);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof CreateDataRecordValues | undefined;

        if (fieldName) {
          setError(fieldName, {
            message: issue.message,
            type: "manual",
          });
        }
      }

      return;
    }

    if (vendorTrackingMode === "REQUIRED" && !result.data.vendorId) {
      setError("vendorId", {
        message: "Select the vendor associated with this activity",
        type: "manual",
      });
      return;
    }

    try {
      await onAddRecord(values);
      setStatusTone("success");
      setStatusMessage("Record added.");
      reset(defaultValues);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof ApiError ? error.message : "Unable to add record.");
    }
  }

  return (
    <aside className="order-first rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 xl:order-none 2xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Add record</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">Activity data</h2>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#eef4f0] text-[#315f42]">
          <Calculator className="size-5" strokeWidth={1.8} />
        </span>
      </div>

      {selectedActivities.length > 0 ? (
        <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label>
            <span className="text-sm font-semibold text-[#253229]">GHG activity</span>
            <input type="hidden" {...register("ghgActivitySelectionId")} />
            <ActivitySearchPicker
              error={errors.ghgActivitySelectionId}
              initialScope={initialScope}
              recentSelectionIds={recentSelectionIds}
              selectedActivities={selectedActivities}
              value={selectedActivityId}
              onChange={(selectionId) => {
                setValue("ghgActivitySelectionId", selectionId, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
            />
            <FieldMessage error={errors.ghgActivitySelectionId} />
          </label>

          {vendorTrackingMode !== "NONE" ? (
            <label>
              <span className="text-sm font-semibold text-[#253229]">
                Vendor{vendorTrackingMode === "OPTIONAL" ? " (optional)" : ""}
              </span>
              <select
                aria-invalid={Boolean(errors.vendorId)}
                className={fieldClass(Boolean(errors.vendorId))}
                {...register("vendorId")}
              >
                <option value="">
                  {vendorTrackingMode === "REQUIRED"
                    ? "Select a vendor"
                    : "No vendor attribution"}
                </option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.displayName}
                    {vendor.vendorCode ? ` (${vendor.vendorCode})` : ""}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs leading-5 text-[#65716a]">
                {vendorTrackingMode === "REQUIRED"
                  ? "This activity is configured to require vendor attribution."
                  : "Link this internal record to a vendor when the source is supplier-related."}
              </p>
              {vendors.length === 0 ? (
                <p className="mt-1 text-xs font-medium text-[#9b5f28]">
                  No active vendor is assigned to this site.
                </p>
              ) : null}
              <FieldMessage error={errors.vendorId} />
            </label>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <label>
              <span className="text-sm font-semibold text-[#253229]">Record date</span>
              <input
                aria-invalid={Boolean(errors.recordDate)}
                className={fieldClass(Boolean(errors.recordDate))}
                type="date"
                {...register("recordDate")}
              />
              <FieldMessage error={errors.recordDate} />
            </label>

            <label>
              <span className="text-sm font-semibold text-[#253229]">Quantity</span>
              <input
                aria-invalid={Boolean(errors.quantity)}
                className={fieldClass(Boolean(errors.quantity))}
                min="0"
                placeholder="12500"
                step="any"
                type="number"
                {...register("quantity")}
              />
              <FieldMessage error={errors.quantity} />
            </label>
          </div>

          <label>
            <span className="text-sm font-semibold text-[#253229]">Notes</span>
            <textarea
              aria-invalid={Boolean(errors.notes)}
              className="mt-2 min-h-24 w-full resize-y rounded-md border border-[#d2ded6] bg-white/75 px-3 py-3 text-sm text-[#16211b] shadow-sm outline-none transition placeholder:text-[#9aa39d] focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
              placeholder="Optional note or source reference"
              {...register("notes")}
            />
            <FieldMessage error={errors.notes} />
          </label>

          <EmissionPreview
            calculatedKgCo2e={calculatedKgCo2e}
            quantity={quantity}
            selectedActivity={selectedActivity}
          />

          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#8fa797]"
            disabled={isSubmitting}
            type="submit"
          >
            <Plus className="size-4" strokeWidth={1.8} />
            {isSubmitting ? "Adding..." : "Add record"}
          </button>

          {statusMessage ? (
            <p
              className={`text-sm font-semibold ${
                statusTone === "error" ? "text-[#9b3a32]" : "text-[#2f6b45]"
              }`}
            >
              {statusMessage}
            </p>
          ) : null}
        </form>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-[#c8d6cd] bg-white/45 p-5 text-sm leading-6 text-[#617069]">
          No selected GHG activities are available for this reporting year.
        </div>
      )}
    </aside>
  );
}

function ActivitySearchPicker({
  error,
  initialScope,
  onChange,
  recentSelectionIds,
  selectedActivities,
  value,
}: {
  error?: FieldError;
  initialScope?: string | null;
  onChange: (selectionId: string) => void;
  recentSelectionIds: Set<string>;
  selectedActivities: SelectedGhgActivity[];
  value: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [scope, setScope] = useState("all");
  const [recentOnly, setRecentOnly] = useState(false);
  const selectedActivity = useMemo(
    () => getSelectedActivity(selectedActivities, value),
    [selectedActivities, value],
  );
  const categories = useMemo(() => {
    const categoryMap = new Map<string, string>();

    for (const selection of selectedActivities) {
      categoryMap.set(selection.activity.category.id, selection.activity.category.name);
    }

    return [...categoryMap.entries()].map(([id, name]) => ({ id, name }));
  }, [selectedActivities]);
  const scopes = useMemo(
    () => [
      ...new Set(
        selectedActivities
          .map((selection) => selection.activity.scope)
          .filter((scopeValue): scopeValue is string => Boolean(scopeValue)),
      ),
    ],
    [selectedActivities],
  );

  useEffect(() => {
    if (!initialScope) {
      return;
    }

    const normalizedInitialScope = initialScope.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const matchingScope = scopes.find(
      (scopeValue) =>
        scopeValue.toLowerCase().replace(/[^a-z0-9]+/g, "") === normalizedInitialScope,
    );

    setScope(matchingScope ?? "all");
  }, [initialScope, scopes]);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredActivities = useMemo(() => {
    const filtered = selectedActivities.filter(
      (selection) =>
        (categoryId === "all" || selection.activity.category.id === categoryId) &&
        (scope === "all" || selection.activity.scope === scope) &&
        (!recentOnly || recentSelectionIds.has(selection.selectionId)) &&
        (!normalizedSearchTerm ||
          getActivitySearchText(selection).includes(normalizedSearchTerm)),
    );

    return [...filtered].sort((left, right) => {
      const leftRecent = recentSelectionIds.has(left.selectionId);
      const rightRecent = recentSelectionIds.has(right.selectionId);

      if (leftRecent === rightRecent) {
        return getActivityLabel(left).localeCompare(getActivityLabel(right));
      }

      return leftRecent ? -1 : 1;
    });
  }, [
    categoryId,
    normalizedSearchTerm,
    recentOnly,
    recentSelectionIds,
    scope,
    selectedActivities,
  ]);

  useEffect(() => {
    if (!selectedActivity) {
      setSearchTerm("");
    }
  }, [selectedActivity]);

  return (
    <div
      className={`mt-2 rounded-md border bg-white/75 shadow-sm transition focus-within:ring-3 ${
        error
          ? "border-[#c9756c] focus-within:border-[#9b3a32] focus-within:ring-[#9b3a32]/15"
          : "border-[#d2ded6] focus-within:border-[#678c72] focus-within:ring-[#426a52]/15"
      }`}
    >
      <div className="flex h-11 items-center gap-2 border-b border-[#e0e8e2] px-3">
        <Search className="size-4 shrink-0 text-[#6f7d74]" strokeWidth={1.8} />
        <input
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#16211b] outline-none placeholder:text-[#9aa39d]"
          placeholder={
            selectedActivity
              ? getActivityLabel(selectedActivity)
              : "Search activity, subtype, sheet, scope, unit"
          }
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {selectedActivity ? (
        <div className="border-b border-[#e0e8e2] bg-[#f7faf7] px-3 py-3">
          <p className="text-xs font-semibold tracking-[0.1em] text-[#6f7b73] uppercase">
            Selected activity
          </p>
          <p className="text-sm font-semibold text-[#142019]">
            {getActivityLabel(selectedActivity)}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#647169]">
            {getActivityMetaLabel(selectedActivity)}
          </p>
        </div>
      ) : null}

      <div className="grid gap-2 border-b border-[#e0e8e2] bg-white/45 p-2 sm:grid-cols-3">
        <label>
          <span className="sr-only">Filter by category</span>
          <select
            className="h-9 w-full rounded-md border border-[#d2ded6] bg-white/75 px-2 text-xs font-semibold text-[#16211b] outline-none focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by scope</span>
          <select
            className="h-9 w-full rounded-md border border-[#d2ded6] bg-white/75 px-2 text-xs font-semibold text-[#16211b] outline-none focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15"
            value={scope}
            onChange={(event) => setScope(event.target.value)}
          >
            <option value="all">All scopes</option>
            {scopes.map((scopeValue) => (
              <option key={scopeValue} value={scopeValue}>
                {scopeValue}
              </option>
            ))}
          </select>
        </label>
        <label className="flex h-9 items-center gap-2 rounded-md border border-[#d2ded6] bg-white/75 px-2 text-xs font-semibold text-[#253229]">
          <input
            checked={recentOnly}
            className="size-3.5 accent-[#1f5135]"
            disabled={recentSelectionIds.size === 0}
            type="checkbox"
            onChange={(event) => setRecentOnly(event.target.checked)}
          />
          Recent only
        </label>
      </div>

      <div className="max-h-72 overflow-y-auto p-2">
        {filteredActivities.length > 0 ? (
          <div className="grid gap-1">
            {filteredActivities.map((selection) => {
              const isSelected = selection.selectionId === value;

              return (
                <button
                  className={`flex min-h-16 w-full items-start gap-3 rounded-md border px-3 py-2 text-left transition focus:ring-3 focus:ring-[#426a52]/15 focus:outline-none ${
                    isSelected
                      ? "border-[#bdd3c3] bg-[#edf6ef]"
                      : "border-transparent hover:border-[#d7e0da] hover:bg-white"
                  }`}
                  key={selection.selectionId}
                  type="button"
                  onClick={() => {
                    onChange(selection.selectionId);
                    setSearchTerm("");
                  }}
                >
                  <span
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border ${
                      isSelected
                        ? "border-[#9fc3aa] bg-[#1f5135] text-white"
                        : "border-[#d1ddd5] bg-white/70 text-transparent"
                    }`}
                  >
                    <Check className="size-3.5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[#16211b]">
                      {getActivityLabel(selection)}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#65716a]">
                      {getActivityMetaLabel(selection)}
                    </span>
                    {recentSelectionIds.has(selection.selectionId) ? (
                      <span className="mt-2 inline-flex rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2 py-0.5 text-[11px] font-semibold text-[#2f6b45]">
                        Recently used
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-[#c8d6cd] bg-white/45 p-4 text-sm leading-6 text-[#617069]">
            No selected activity matches your search and filters.
          </div>
        )}
      </div>
    </div>
  );
}

function EmissionPreview({
  calculatedKgCo2e,
  quantity,
  selectedActivity,
}: {
  calculatedKgCo2e: number | null;
  quantity: string;
  selectedActivity: SelectedGhgActivity | null;
}) {
  return (
    <section className="rounded-lg border border-[#d9e2dc] bg-white/55 p-4">
      <p className="text-sm font-semibold text-[#426a52]">Calculation preview</p>
      {selectedActivity ? (
        <>
          <h3 className="mt-2 text-base font-semibold text-[#142019]">
            {getActivityLabel(selectedActivity)}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <PreviewMeta label="Unit" value={selectedActivity.activity.unit} />
            <PreviewMeta
              label="Factor kg CO2e"
              value={selectedActivity.activity.factorKgCo2e ?? "Not set"}
            />
            <PreviewMeta label="Quantity" value={quantity || "0"} />
            <PreviewMeta
              label="Calculated kg CO2e"
              value={calculatedKgCo2e === null ? "Not calculated" : formatNumber(calculatedKgCo2e)}
            />
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm leading-6 text-[#65716a]">
          Select an activity to see unit, factor, and estimated emissions.
        </p>
      )}
    </section>
  );
}

function PreviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3">
      <p className="text-[11px] font-semibold tracking-[0.08em] text-[#69756e] uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-[#16211b]">{value}</p>
    </div>
  );
}
