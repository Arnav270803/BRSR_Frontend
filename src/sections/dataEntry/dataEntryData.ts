import type { WorkspaceRole } from "../workspace/workspaceData";

export type SelectedGhgActivity = {
  selectionId: string;
  customLabel: string | null;
  selectedAt: string;
  activity: {
    id: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
      sourceSheet: string;
    };
    sourceSheet: string;
    sourceYear: number | null;
    sourceVersion: string | null;
    sourceRow: number;
    scope: string | null;
    activity: string;
    subtype: string | null;
    variant: string | null;
    unit: string;
    factorKgCo2e: string | null;
    factorData: unknown;
  };
};

export type DataRecord = {
  id: string;
  companyId: string;
  siteId: string;
  reportingYearId: string;
  ghgActivitySelectionId: string;
  ghgActivityId: string;
  recordDate: string;
  quantity: string;
  unit: string;
  factorKgCo2e: string | null;
  calculatedKgCo2e: string | null;
  scope: string | null;
  factorSourceSheet: string | null;
  factorSourceYear: number | null;
  factorSourceVersion: string | null;
  notes: string | null;
  metadata: unknown;
  createdByUserId: string;
  createdBy?: {
    id: string;
    email: string;
    name: string | null;
  };
  deletedByUserId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  ghgActivity?: {
    id: string;
    category: {
      id: string;
      name: string;
    };
    sourceSheet: string;
    scope: string | null;
    activity: string;
    subtype: string | null;
    variant: string | null;
  };
};

export type CreateDataRecordValues = {
  ghgActivitySelectionId: string;
  recordDate: string;
  quantity: string;
  notes: string;
};

export type CreateDataRecordPayload = {
  ghgActivitySelectionId: string;
  recordDate: string;
  quantity: number;
  notes?: string;
};

export function canDeleteRecord(viewerRole: WorkspaceRole, record: DataRecord, userId: string) {
  return viewerRole !== "USER" || record.createdByUserId === userId;
}

export const demoSelectedGhgActivities: SelectedGhgActivity[] = [
  {
    selectionId: "sel-grid-electricity",
    customLabel: null,
    selectedAt: "2025-04-01T09:30:00.000Z",
    activity: {
      id: "act-grid-electricity-india",
      categoryId: "cat-electricity",
      category: {
        id: "cat-electricity",
        name: "Purchased electricity",
        sourceSheet: "Electricity",
      },
      sourceSheet: "Electricity",
      sourceYear: 2025,
      sourceVersion: "2025",
      sourceRow: 12,
      scope: "Scope 2",
      activity: "Grid electricity",
      subtype: "India",
      variant: "Location based",
      unit: "kWh",
      factorKgCo2e: "0.716",
      factorData: null,
    },
  },
  {
    selectionId: "sel-diesel-generator",
    customLabel: null,
    selectedAt: "2025-04-01T09:32:00.000Z",
    activity: {
      id: "act-diesel-generator",
      categoryId: "cat-stationary",
      category: {
        id: "cat-stationary",
        name: "Stationary combustion",
        sourceSheet: "Fuels",
      },
      sourceSheet: "Fuels",
      sourceYear: 2025,
      sourceVersion: "2025",
      sourceRow: 31,
      scope: "Scope 1",
      activity: "Diesel generator fuel",
      subtype: "Gas oil / diesel",
      variant: "Stationary equipment",
      unit: "litre",
      factorKgCo2e: "2.512",
      factorData: null,
    },
  },
  {
    selectionId: "sel-business-car",
    customLabel: null,
    selectedAt: "2025-04-01T09:34:00.000Z",
    activity: {
      id: "act-company-car-petrol",
      categoryId: "cat-transport",
      category: {
        id: "cat-transport",
        name: "Business travel",
        sourceSheet: "Passenger vehicles",
      },
      sourceSheet: "Passenger vehicles",
      sourceYear: 2025,
      sourceVersion: "2025",
      sourceRow: 52,
      scope: "Scope 3",
      activity: "Business travel by car",
      subtype: "Petrol car",
      variant: "Average car",
      unit: "km",
      factorKgCo2e: "0.171",
      factorData: null,
    },
  },
];

export const demoDataRecords: DataRecord[] = [
  {
    id: "record-electricity-apr",
    companyId: "demo-company",
    siteId: "delhi-plant",
    reportingYearId: "fy-2025-26",
    ghgActivitySelectionId: "sel-grid-electricity",
    ghgActivityId: "act-grid-electricity-india",
    recordDate: "2025-04-30",
    quantity: "12500",
    unit: "kWh",
    factorKgCo2e: "0.716",
    calculatedKgCo2e: "8950",
    scope: "Scope 2",
    factorSourceSheet: "Electricity",
    factorSourceYear: 2025,
    factorSourceVersion: "2025",
    notes: "April electricity bill",
    metadata: null,
    createdByUserId: "user-admin",
    createdBy: {
      id: "user-admin",
      email: "admin@acmeindustries.com",
      name: "Company Admin",
    },
    deletedByUserId: null,
    deletedAt: null,
    createdAt: "2025-05-01T10:00:00.000Z",
    updatedAt: "2025-05-01T10:00:00.000Z",
    ghgActivity: {
      id: "act-grid-electricity-india",
      category: {
        id: "cat-electricity",
        name: "Purchased electricity",
      },
      sourceSheet: "Electricity",
      scope: "Scope 2",
      activity: "Grid electricity",
      subtype: "India",
      variant: "Location based",
    },
  },
  {
    id: "record-diesel-apr",
    companyId: "demo-company",
    siteId: "delhi-plant",
    reportingYearId: "fy-2025-26",
    ghgActivitySelectionId: "sel-diesel-generator",
    ghgActivityId: "act-diesel-generator",
    recordDate: "2025-04-18",
    quantity: "640",
    unit: "litre",
    factorKgCo2e: "2.512",
    calculatedKgCo2e: "1607.680",
    scope: "Scope 1",
    factorSourceSheet: "Fuels",
    factorSourceYear: 2025,
    factorSourceVersion: "2025",
    notes: "Backup generator diesel purchase",
    metadata: null,
    createdByUserId: "user-employee",
    createdBy: {
      id: "user-employee",
      email: "operations@acmeindustries.com",
      name: "Operations User",
    },
    deletedByUserId: null,
    deletedAt: null,
    createdAt: "2025-04-18T12:00:00.000Z",
    updatedAt: "2025-04-18T12:00:00.000Z",
    ghgActivity: {
      id: "act-diesel-generator",
      category: {
        id: "cat-stationary",
        name: "Stationary combustion",
      },
      sourceSheet: "Fuels",
      scope: "Scope 1",
      activity: "Diesel generator fuel",
      subtype: "Gas oil / diesel",
      variant: "Stationary equipment",
    },
  },
];
