export type WorkspaceRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export type ReportingYear = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  selectedGhgActivityCount: number;
};

export type WorkspaceSetup = {
  reportingYearsReady: boolean;
  ghgActivitySelectionReady: boolean;
  fieldConfigurationReady: boolean;
};

export type CompanyWorkspace = {
  company: {
    id: string;
    legalName: string;
    displayName: string;
    primaryDomain: string;
    industry: string;
    country: string;
    state: string;
    city: string;
    financialYearStartMonth: number;
    status: string;
  };
  viewerRole: WorkspaceRole;
  activeMemberCount: number;
  reportingYears: ReportingYear[];
  setup: WorkspaceSetup;
};

export const demoWorkspace: CompanyWorkspace = {
  company: {
    id: "demo-company",
    legalName: "Acme Industries Limited",
    displayName: "Acme Industries",
    primaryDomain: "acmeindustries.com",
    industry: "Manufacturing",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    financialYearStartMonth: 4,
    status: "ACTIVE",
  },
  viewerRole: "ADMIN",
  activeMemberCount: 24,
  reportingYears: [
    {
      id: "fy-2025-26",
      label: "FY 2025-26",
      startDate: "2025-04-01",
      endDate: "2026-03-31",
      selectedGhgActivityCount: 186,
    },
    {
      id: "fy-2024-25",
      label: "FY 2024-25",
      startDate: "2024-04-01",
      endDate: "2025-03-31",
      selectedGhgActivityCount: 142,
    },
  ],
  setup: {
    reportingYearsReady: true,
    ghgActivitySelectionReady: true,
    fieldConfigurationReady: true,
  },
};
