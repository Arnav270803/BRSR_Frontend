import type { ReportingYearRecord } from "./reportingYearsData";

export const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function getReportingYearStatus(reportingYear: ReportingYearRecord) {
  if (!reportingYear.isActive) {
    return "Inactive";
  }

  return reportingYear.selectedGhgActivityCount > 0 ? "Ready" : "Needs setup";
}

export function getLatestReportingYear(reportingYears: ReportingYearRecord[]) {
  return reportingYears[0] ?? null;
}

