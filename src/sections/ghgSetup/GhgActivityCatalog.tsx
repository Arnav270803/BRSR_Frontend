import { Check, ChevronDown, Layers3, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { GhgActivity, GhgCategory } from "./ghgSetupData";

const allCategoriesValue = "all";
const allScopesValue = "all";

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

function getActivityDetail(activity: GhgActivity) {
  return uniqueTextParts([
    activity.scope,
    activity.category.name,
    activity.sourceSheet,
    activity.unit,
  ]).join(" / ");
}

export function GhgActivityCatalog({
  activities,
  canEdit,
  categories,
  selectedActivityIds,
  selectCategory,
  toggleActivity,
}: {
  activities: GhgActivity[];
  canEdit: boolean;
  categories: GhgCategory[];
  selectedActivityIds: Set<string>;
  selectCategory: (categoryId: string) => void;
  toggleActivity: (activityId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(allCategoriesValue);
  const [scope, setScope] = useState(allScopesValue);
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState<Set<string>>(
    () => new Set(),
  );
  const scopes = useMemo(
    () => [...new Set(activities.map((activity) => activity.scope).filter(Boolean))],
    [activities],
  );
  const normalizedSearch = search.trim().toLowerCase();
  const filteredActivities = activities.filter((activity) => {
    const searchText = [
      getActivityLabel(activity),
      getActivityDetail(activity),
      activity.factorKgCo2e,
      `row ${activity.sourceRow}`,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (categoryId === allCategoriesValue || activity.categoryId === categoryId) &&
      (scope === allScopesValue || activity.scope === scope) &&
      (!selectedOnly || selectedActivityIds.has(activity.id)) &&
      searchText.includes(normalizedSearch)
    );
  });
  const categoriesWithActivities = categories
    .map((category) => ({
      category,
      activities: filteredActivities.filter((activity) => activity.categoryId === category.id),
      selectedCount: activities.filter(
        (activity) => activity.categoryId === category.id && selectedActivityIds.has(activity.id),
      ).length,
      totalCount: activities.filter((activity) => activity.categoryId === category.id).length,
    }))
    .filter((group) => group.activities.length > 0);

  function toggleCategoryCollapse(nextCategoryId: string) {
    setCollapsedCategoryIds((current) => {
      const next = new Set(current);

      if (next.has(nextCategoryId)) {
        next.delete(nextCategoryId);
      } else {
        next.add(nextCategoryId);
      }

      return next;
    });
  }

  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-3 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-4 lg:p-5 2xl:p-6">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold text-[#426a52] sm:text-sm">Activity catalog</p>
          <h2 className="mt-0.5 text-lg font-semibold text-[#142019] sm:mt-1 sm:text-xl">
            Choose fields by category
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="w-fit rounded-md border border-[#d5dfd8] bg-white/70 px-2.5 py-1 text-xs font-semibold text-[#5f6f66] sm:px-3 sm:py-1.5">
            {filteredActivities.length} visible
          </span>
          <span className="w-fit rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2.5 py-1 text-xs font-semibold text-[#2f6b45] sm:px-3 sm:py-1.5">
            {selectedActivityIds.size} selected
          </span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:mt-5 lg:grid-cols-[minmax(0,1fr)_220px_180px] lg:gap-3">
        <label className="relative">
          <span className="sr-only">Search GHG activities</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6f7b73]"
            strokeWidth={1.8}
          />
          <input
            className="h-10 w-full rounded-md border border-[#d2ded6] bg-white/75 pr-3 pl-10 text-sm text-[#16211b] shadow-sm outline-none transition placeholder:text-[#9aa39d] focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15 lg:h-11"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search activity, subtype, unit, source..."
            type="search"
            value={search}
          />
        </label>

        <label>
          <span className="sr-only">Category</span>
          <select
            className="h-10 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 text-sm text-[#16211b] shadow-sm outline-none transition focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15 lg:h-11"
            onChange={(event) => setCategoryId(event.target.value)}
            value={categoryId}
          >
            <option value={allCategoriesValue}>All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Scope</span>
          <select
            className="h-10 w-full rounded-md border border-[#d2ded6] bg-white/75 px-3 text-sm text-[#16211b] shadow-sm outline-none transition focus:border-[#678c72] focus:ring-3 focus:ring-[#426a52]/15 lg:h-11"
            onChange={(event) => setScope(event.target.value)}
            value={scope}
          >
            <option value={allScopesValue}>All scopes</option>
            {scopes.map((scopeValue) => (
              <option key={scopeValue} value={scopeValue ?? ""}>
                {scopeValue}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-col gap-2 rounded-lg border border-[#d9e2dc] bg-white/45 p-2.5 sm:flex-row sm:items-center sm:justify-between lg:mt-4 lg:p-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#243128]">
          <input
            checked={selectedOnly}
            className="size-4 accent-[#1f5135]"
            type="checkbox"
            onChange={(event) => setSelectedOnly(event.target.checked)}
          />
          Show selected only
        </label>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#66736b]">
          <Layers3 className="size-4 text-[#426a52]" strokeWidth={1.8} />
          {categoriesWithActivities.length} matching categories
        </div>
      </div>

      <div className="mt-3 grid gap-2 lg:mt-5 lg:gap-3">
        {categoriesWithActivities.length > 0 ? (
          categoriesWithActivities.map((group) => {
            const isCollapsed = collapsedCategoryIds.has(group.category.id);

            return (
              <section
                className="overflow-hidden rounded-lg border border-[#d9e2dc] bg-white/50"
                key={group.category.id}
              >
                <div className="flex flex-col gap-2 border-b border-[#d9e2dc] bg-[#f7faf7]/75 p-2.5 sm:flex-row sm:items-center sm:justify-between lg:p-3">
                  <button
                    className="flex min-w-0 items-center gap-3 text-left focus:ring-3 focus:ring-[#426a52]/15 focus:outline-none"
                    type="button"
                    onClick={() => toggleCategoryCollapse(group.category.id)}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/75 text-[#315f42] sm:size-9">
                      <ChevronDown
                        className={`size-4 transition ${isCollapsed ? "-rotate-90" : ""}`}
                        strokeWidth={1.8}
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#142019]">
                        {group.category.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#68756d] sm:mt-1">
                        {group.category.scope ?? "Scope not set"} / {group.activities.length} visible
                      </span>
                    </span>
                  </button>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2.5 py-1 text-xs font-semibold text-[#2f6b45]">
                      {group.selectedCount}/{group.totalCount} selected
                    </span>
                    {canEdit ? (
                      <button
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-[#cdd9d1] bg-white/75 px-2.5 text-xs font-semibold text-[#1d2a22] transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none sm:h-9 sm:gap-2 sm:px-3"
                        onClick={() => selectCategory(group.category.id)}
                        type="button"
                      >
                        <SlidersHorizontal className="size-3.5" strokeWidth={1.8} />
                        Select category
                      </button>
                    ) : null}
                  </div>
                </div>

                {!isCollapsed ? (
                  <div className="grid gap-2 p-2.5 lg:gap-3 lg:p-3">
                    {group.activities.map((activity) => (
                      <ActivityRow
                        activity={activity}
                        canEdit={canEdit}
                        isSelected={selectedActivityIds.has(activity.id)}
                        key={activity.id}
                        toggleActivity={toggleActivity}
                      />
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-[#c8d6cd] bg-white/45 p-6 text-sm leading-6 text-[#617069]">
            No GHG activities match the current filters.
          </div>
        )}
      </div>
    </section>
  );
}

function ActivityRow({
  activity,
  canEdit,
  isSelected,
  toggleActivity,
}: {
  activity: GhgActivity;
  canEdit: boolean;
  isSelected: boolean;
  toggleActivity: (activityId: string) => void;
}) {
  return (
    <article
      className={`rounded-lg border p-3 transition lg:p-4 ${
        isSelected
          ? "border-[#9fc5aa] bg-[#f0f7f2]"
          : "border-[#d9e2dc] bg-white/60 hover:border-[#b7c9bd]"
      }`}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-[#d1ddd5] bg-white/65 px-2 py-1 text-xs font-semibold text-[#52635a]">
              {activity.scope ?? "Scope not set"}
            </span>
            <span className="rounded-md border border-[#d1ddd5] bg-white/65 px-2 py-1 text-xs font-semibold text-[#52635a]">
              {activity.unit}
            </span>
            {isSelected ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-[#bdd3c3] bg-white/75 px-2 py-1 text-xs font-semibold text-[#2f6b45]">
                <Check className="size-3.5" strokeWidth={2} />
                Selected
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 text-sm font-semibold text-[#142019] sm:text-base lg:mt-3">
            {getActivityLabel(activity)}
          </h3>
          <p className="mt-1 text-xs leading-5 text-[#65716a] sm:mt-2 sm:text-sm sm:leading-6">
            {getActivityDetail(activity)}
          </p>
        </div>

        <button
          aria-pressed={isSelected}
          className={`inline-flex h-9 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-semibold transition focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none lg:h-10 lg:px-4 ${
            isSelected
              ? "border-[#24563a] bg-[#1f5135] text-white hover:bg-[#183f2a]"
              : "border-[#cdd9d1] bg-white/75 text-[#1d2a22] hover:border-[#9fb5a6] hover:bg-white"
          } ${!canEdit ? "cursor-not-allowed opacity-70" : ""}`}
          disabled={!canEdit}
          onClick={() => toggleActivity(activity.id)}
          type="button"
        >
          {isSelected ? "Selected" : "Select"}
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:mt-4 lg:gap-3">
        <ActivityMeta label="Factor kg CO2e" value={activity.factorKgCo2e ?? "Not set"} />
        <ActivityMeta label="Source" value={activity.sourceSheet} />
        <ActivityMeta label="Row" value={String(activity.sourceRow)} />
      </div>
    </article>
  );
}

function ActivityMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#e0e8e2] bg-white/55 p-2.5 lg:p-3">
      <p className="text-[11px] font-semibold tracking-[0.08em] text-[#69756e] uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-[#16211b]">{value}</p>
    </div>
  );
}
