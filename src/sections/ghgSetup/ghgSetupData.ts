export type GhgCategory = {
  id: string;
  name: string;
  sourceSheet: string;
  scope: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  activityCount: number;
};

export type GhgActivity = {
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
  sortOrder: number;
  isActive: boolean;
};

export type GhgActivitySelectionsPayload = {
  activityIds: string[];
};

export const demoGhgCategories: GhgCategory[] = [
  {
    id: "cat-electricity",
    name: "Purchased electricity",
    sourceSheet: "Electricity",
    scope: "Scope 2",
    description: "Electricity consumption and location-based factors.",
    sortOrder: 1,
    isActive: true,
    activityCount: 3,
  },
  {
    id: "cat-stationary",
    name: "Stationary combustion",
    sourceSheet: "Fuels",
    scope: "Scope 1",
    description: "Fuel used in boilers, furnaces, and generators.",
    sortOrder: 2,
    isActive: true,
    activityCount: 3,
  },
  {
    id: "cat-transport",
    name: "Business travel",
    sourceSheet: "Passenger vehicles",
    scope: "Scope 3",
    description: "Employee travel and transport-related emissions.",
    sortOrder: 3,
    isActive: true,
    activityCount: 3,
  },
];

export const demoGhgActivities: GhgActivity[] = [
  {
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
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "act-renewable-electricity",
    categoryId: "cat-electricity",
    category: {
      id: "cat-electricity",
      name: "Purchased electricity",
      sourceSheet: "Electricity",
    },
    sourceSheet: "Electricity",
    sourceYear: 2025,
    sourceVersion: "2025",
    sourceRow: 13,
    scope: "Scope 2",
    activity: "Renewable electricity",
    subtype: "Contracted",
    variant: "Market based",
    unit: "kWh",
    factorKgCo2e: "0",
    factorData: null,
    sortOrder: 2,
    isActive: true,
  },
  {
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
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "act-natural-gas-boiler",
    categoryId: "cat-stationary",
    category: {
      id: "cat-stationary",
      name: "Stationary combustion",
      sourceSheet: "Fuels",
    },
    sourceSheet: "Fuels",
    sourceYear: 2025,
    sourceVersion: "2025",
    sourceRow: 36,
    scope: "Scope 1",
    activity: "Natural gas boiler",
    subtype: "Natural gas",
    variant: "Gross CV",
    unit: "kWh",
    factorKgCo2e: "0.183",
    factorData: null,
    sortOrder: 4,
    isActive: true,
  },
  {
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
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "act-domestic-flight",
    categoryId: "cat-transport",
    category: {
      id: "cat-transport",
      name: "Business travel",
      sourceSheet: "Passenger vehicles",
    },
    sourceSheet: "Passenger vehicles",
    sourceYear: 2025,
    sourceVersion: "2025",
    sourceRow: 67,
    scope: "Scope 3",
    activity: "Domestic flight",
    subtype: "Passenger air travel",
    variant: "Average passenger",
    unit: "passenger-km",
    factorKgCo2e: "0.246",
    factorData: null,
    sortOrder: 6,
    isActive: true,
  },
];

export const demoSelectedActivityIds = [
  "act-grid-electricity-india",
  "act-diesel-generator",
  "act-company-car-petrol",
];
