import type { MaritimeWidget } from "@/types";

/**
 * Custom tool: Maritime Widget Catalog
 * Agents invoke this to look up standard maritime UI patterns and props.
 */

export const MARITIME_WIDGET_CATALOG: MaritimeWidget[] = [
  {
    id: "voyage-progress",
    name: "VoyageProgressTracker",
    category: "voyage",
    description: "Displays current voyage leg, ETA, distance remaining, and route waypoints on a timeline.",
    suggestedProps: ["voyageId", "origin", "destination", "eta", "progressPercent", "waypoints"],
    tailwindPatterns: ["bg-gradient-to-r from-maritime-600 to-maritime-400 h-2 rounded-full", "flex items-center gap-4"],
  },
  {
    id: "fuel-gauge",
    name: "FuelGaugeCard",
    category: "fuel",
    description: "Circular or bar gauge showing fuel levels (HFO, MDO, LNG) with consumption rate.",
    suggestedProps: ["fuelType", "currentLevel", "capacity", "consumptionRate", "unit"],
    tailwindPatterns: ["rounded-xl border border-maritime-200 p-4 shadow-sm", "text-maritime-700 font-semibold"],
  },
  {
    id: "crew-certification",
    name: "CrewCertificationStatus",
    category: "crew",
    description: "Table or card grid showing crew member certifications, expiry dates, and compliance status.",
    suggestedProps: ["crewMembers", "certifications", "expiryThreshold"],
    tailwindPatterns: ["divide-y divide-gray-200", "badge bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs"],
  },
  {
    id: "alert-panel",
    name: "MaritimeAlertPanel",
    category: "alerts",
    description: "Priority-sorted alert list for engine faults, weather warnings, and regulatory notices.",
    suggestedProps: ["alerts", "severityFilter", "onAcknowledge"],
    tailwindPatterns: ["border-l-4 border-red-500 bg-red-50 p-3", "border-l-4 border-amber-500 bg-amber-50 p-3"],
  },
  {
    id: "vessel-position",
    name: "VesselPositionMap",
    category: "navigation",
    description: "Mini map or coordinate display showing vessel lat/lon, heading, and speed over ground.",
    suggestedProps: ["latitude", "longitude", "heading", "speedKnots", "lastUpdated"],
    tailwindPatterns: ["bg-ocean-deep text-white rounded-lg p-4", "font-mono text-sm"],
  },
  {
    id: "engine-monitoring",
    name: "EngineMonitoringDashboard",
    category: "monitoring",
    description: "Real-time engine RPM, temperature, oil pressure gauges with threshold indicators.",
    suggestedProps: ["engines", "rpm", "temperature", "oilPressure", "thresholds"],
    tailwindPatterns: ["grid grid-cols-2 md:grid-cols-4 gap-4", "bg-white rounded-lg shadow p-4"],
  },
  {
    id: "weather-widget",
    name: "WeatherConditionsCard",
    category: "monitoring",
    description: "Current sea state, wind speed/direction, wave height, and forecast summary.",
    suggestedProps: ["windSpeed", "windDirection", "waveHeight", "seaState", "forecast"],
    tailwindPatterns: ["flex flex-col gap-2", "text-2xl font-bold text-maritime-800"],
  },
  {
    id: "cargo-status",
    name: "CargoStatusPanel",
    category: "monitoring",
    description: "Cargo hold levels, temperature monitoring, and loading/unloading progress.",
    suggestedProps: ["holds", "cargoType", "fillLevel", "temperature"],
    tailwindPatterns: ["h-24 bg-maritime-100 rounded relative overflow-hidden", "absolute bottom-0 w-full bg-maritime-500"],
  },
];

export interface WidgetSearchResult {
  query: string;
  matches: MaritimeWidget[];
  totalInCatalog: number;
}

export function searchMaritimeWidgets(query: string, category?: string): WidgetSearchResult {
  const q = query.toLowerCase();
  let matches = MARITIME_WIDGET_CATALOG.filter(
    (w) =>
      w.name.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q) ||
      w.category.includes(q) ||
      w.suggestedProps.some((p) => p.toLowerCase().includes(q))
  );

  if (category) {
    matches = matches.filter((w) => w.category === category);
  }

  return {
    query,
    matches,
    totalInCatalog: MARITIME_WIDGET_CATALOG.length,
  };
}

export function getWidgetById(id: string): MaritimeWidget | undefined {
  return MARITIME_WIDGET_CATALOG.find((w) => w.id === id);
}

export function getWidgetsByCategory(category: MaritimeWidget["category"]): MaritimeWidget[] {
  return MARITIME_WIDGET_CATALOG.filter((w) => w.category === category);
}

/** Tool definition for agent tool-calling */
export const maritimeWidgetCatalogTool = {
  name: "search_maritime_widgets",
  description:
    "Search the maritime UI widget catalog for standard components like voyage trackers, fuel gauges, crew certification panels, and alert widgets. Use when designing the component tree.",
  input_schema: {
    type: "object" as const,
    properties: {
      query: { type: "string", description: "Search terms e.g. fuel, voyage, crew, alerts" },
      category: {
        type: "string",
        enum: ["navigation", "monitoring", "crew", "alerts", "fuel", "voyage", "general"],
        description: "Optional category filter",
      },
    },
    required: ["query"],
  },
};

export function executeMaritimeWidgetSearch(input: { query: string; category?: string }): WidgetSearchResult {
  return searchMaritimeWidgets(input.query, input.category);
}
