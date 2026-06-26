import { useEffect, useMemo, useState } from "react";
import { Calculator, Check, Plus, Search } from "lucide-react";
import { type FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError } from "../../api/client";
import type { CreateDataRecordValues, SelectedGhgActivity } from "./dataEntryData";
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
  onAddRecord,
  selectedActivities,
}: {
  onAddRecord: (values: CreateDataRecordValues) => Promise<void>;
  selectedActivities: SelectedGhgActivity[];
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
  const quantity = watch("quantity");
  const selectedActivity = useMemo(
    () => getSelectedActivity(selectedActivities, selectedActivityId),
    [selectedActivities, selectedActivityId],
  );
  const calculatedKgCo2e = selectedActivity
    ? calculateKgCo2e(quantity, selectedActivity.activity.factorKgCo2e)
    : null;

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
  onChange,
  selectedActivities,
  value,
}: {
  error?: FieldError;
  onChange: (selectionId: string) => void;
  selectedActivities: SelectedGhgActivity[];
  value: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const selectedActivity = useMemo(
    () => getSelectedActivity(selectedActivities, value),
    [selectedActivities, value],
  );
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredActivities = useMemo(() => {
    if (!normalizedSearchTerm) {
      return selectedActivities;
    }

    return selectedActivities.filter((selection) =>
      getActivitySearchText(selection).includes(normalizedSearchTerm),
    );
  }, [normalizedSearchTerm, selectedActivities]);

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
        <div className="border-b border-[#e0e8e2] bg-[#f7faf7] px-3 py-2">
          <p className="text-sm font-semibold text-[#142019]">
            {getActivityLabel(selectedActivity)}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#647169]">
            {getActivityMetaLabel(selectedActivity)}
          </p>
        </div>
      ) : null}

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
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-[#c8d6cd] bg-white/45 p-4 text-sm leading-6 text-[#617069]">
            No selected activity matches your search.
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
