import type { WorkspaceSetup } from "../workspace/workspaceData";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getFinancialYearStartLabel(month: number) {
  return monthNames[month - 1] ?? "Not set";
}

export function getCompletedSetupCount(setup: WorkspaceSetup) {
  return [
    setup.reportingYearsReady,
    setup.ghgActivitySelectionReady,
    setup.fieldConfigurationReady,
  ].filter(Boolean).length;
}

export function getSetupStatusLabel(setup: WorkspaceSetup) {
  return getCompletedSetupCount(setup) === 3 ? "Ready" : "In progress";
}
