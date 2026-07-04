import { Save, Trash2 } from "lucide-react";
import type { GhgActivity, GhgCategory } from "./ghgSetupData";

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

function getActivityLabel(activity: GhgActivity) {
  return uniqueTextParts([activity.activity, activity.subtype, activity.variant]).join(" - ");
}

export function GhgSelectedPreview({
  canEdit,
  categories,
  clearSelections,
  hasUnsavedChanges,
  saveSelections,
  selectedActivities,
  statusMessage,
}: {
  canEdit: boolean;
  categories: GhgCategory[];
  clearSelections: () => void;
  hasUnsavedChanges: boolean;
  saveSelections: () => void;
  selectedActivities: GhgActivity[];
  statusMessage: string | null;
}) {
  return (
    <aside className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto 2xl:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between xl:flex-col 2xl:flex-row">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Selected preview</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">
            {selectedActivities.length} activities
          </h2>
        </div>
        <span
          className={`w-fit rounded-md border px-3 py-1.5 text-xs font-semibold ${
            hasUnsavedChanges
              ? "border-[#ded2b4] bg-[#fbf6e9] text-[#775d20]"
              : "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
          }`}
        >
          {hasUnsavedChanges ? "Unsaved changes" : "Ready"}
        </span>
      </div>

      <div className="sticky top-0 z-10 mt-5 grid gap-2 rounded-lg border border-white/70 bg-white/70 p-2 backdrop-blur-xl sm:grid-cols-2 xl:grid-cols-1">
        {canEdit ? (
          <>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none"
              onClick={saveSelections}
              type="button"
            >
              <Save className="size-4" strokeWidth={1.8} />
              Save selections
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#d7c6c1] bg-white/70 px-4 text-sm font-semibold text-[#713c34] shadow-sm transition hover:border-[#c99990] hover:bg-white focus:ring-3 focus:ring-[#9b3a32]/15 focus:outline-none"
              onClick={clearSelections}
              type="button"
            >
              <Trash2 className="size-4" strokeWidth={1.8} />
              Clear all
            </button>
          </>
        ) : (
          <div className="rounded-lg border border-[#d9e2dc] bg-white/55 p-4 text-sm leading-6 text-[#65716a]">
            Your role can view selected GHG activities but cannot change this setup.
          </div>
        )}
      </div>

      {statusMessage ? (
        <p className="mt-4 rounded-md border border-[#d9e2dc] bg-white/55 px-3 py-2 text-sm font-semibold text-[#426a52]">
          {statusMessage}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3">
        {categories.map((category) => {
          const categoryActivities = selectedActivities.filter(
            (activity) => activity.categoryId === category.id,
          );

          if (categoryActivities.length === 0) {
            return null;
          }

          return (
            <section
              className="rounded-lg border border-[#d9e2dc] bg-white/55 p-4"
              key={category.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-[#142019]">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#65716a]">{category.scope}</p>
                </div>
                <span className="rounded-md border border-[#d1ddd5] bg-white/65 px-2 py-1 text-xs font-semibold text-[#52635a]">
                  {categoryActivities.length}
                </span>
              </div>

              <div className="mt-3 grid gap-2">
                {categoryActivities.map((activity) => (
                  <div
                    className="rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3"
                    key={activity.id}
                  >
                    <p className="text-sm font-semibold text-[#1e2b23]">
                      {getActivityLabel(activity)}
                    </p>
                    <p className="mt-1 text-xs text-[#68756d]">
                      {activity.scope ?? "Scope not set"} / {activity.unit} /{" "}
                      {activity.factorKgCo2e ?? "factor not set"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
