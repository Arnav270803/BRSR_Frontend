import type {
  CreateDataRecordPayload,
  CreateDataRecordValues,
  DataRecord,
  SelectedGhgActivity,
} from "./dataEntryData";

export const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const numberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 3,
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatNumber(value: string | number | null) {
  if (value === null) {
    return "Not calculated";
  }

  return numberFormatter.format(Number(value));
}

export function calculateKgCo2e(quantity: string | number, factorKgCo2e: string | null) {
  if (!factorKgCo2e) {
    return null;
  }

  const quantityNumber = Number(quantity);
  const factorNumber = Number(factorKgCo2e);

  if (!Number.isFinite(quantityNumber) || !Number.isFinite(factorNumber)) {
    return null;
  }

  return quantityNumber * factorNumber;
}

export function toCreateRecordPayload(
  values: CreateDataRecordValues,
): CreateDataRecordPayload {
  const notes = values.notes.trim();

  return {
    ghgActivitySelectionId: values.ghgActivitySelectionId,
    recordDate: values.recordDate,
    quantity: Number(values.quantity),
    ...(notes ? { notes } : {}),
  };
}

export function getSelectedActivity(
  selectedActivities: SelectedGhgActivity[],
  selectionId: string,
) {
  return selectedActivities.find((selection) => selection.selectionId === selectionId) ?? null;
}

function uniqueTextParts(parts: Array<string | null | undefined>) {
  const seen = new Set<string>();

  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .filter((part) => {
      const key = part.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

export function getActivityLabel(selection: SelectedGhgActivity) {
  if (selection.customLabel) {
    return selection.customLabel;
  }

  return uniqueTextParts([
    selection.activity.activity,
    selection.activity.subtype,
    selection.activity.variant,
  ]).join(" - ");
}

export function getActivityMetaLabel(selection: SelectedGhgActivity) {
  return uniqueTextParts([
    selection.activity.category.name,
    selection.activity.scope,
    selection.activity.sourceSheet,
    `Row ${selection.activity.sourceRow}`,
    selection.activity.unit,
  ]).join(" / ");
}

export function getActivitySearchText(selection: SelectedGhgActivity) {
  return uniqueTextParts([
    getActivityLabel(selection),
    getActivityMetaLabel(selection),
    selection.activity.factorKgCo2e,
  ])
    .join(" ")
    .toLowerCase();
}

export function getRecordActivityName(record: DataRecord) {
  if (!record.ghgActivity) {
    return "Unknown activity";
  }

  return uniqueTextParts([
    record.ghgActivity.activity,
    record.ghgActivity.subtype,
    record.ghgActivity.variant,
  ]).join(" - ");
}
