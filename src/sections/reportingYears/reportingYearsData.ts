export type ReportingYearRecord = {
  id: string;
  companyId: string;
  label: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  selectedGhgActivityCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateReportingYearValues = {
  label: string;
  startDate: string;
  endDate: string;
};

export const demoReportingYears: ReportingYearRecord[] = [
  {
    id: "fy-2025-26",
    companyId: "demo-company",
    label: "FY 2025-26",
    startDate: "2025-04-01",
    endDate: "2026-03-31",
    isActive: true,
    selectedGhgActivityCount: 186,
    createdAt: "2025-04-01T09:00:00.000Z",
    updatedAt: "2025-04-01T09:00:00.000Z",
  },
  {
    id: "fy-2024-25",
    companyId: "demo-company",
    label: "FY 2024-25",
    startDate: "2024-04-01",
    endDate: "2025-03-31",
    isActive: true,
    selectedGhgActivityCount: 142,
    createdAt: "2024-04-01T09:00:00.000Z",
    updatedAt: "2024-04-01T09:00:00.000Z",
  },
];

