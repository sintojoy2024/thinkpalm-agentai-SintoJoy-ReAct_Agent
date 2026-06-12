import { SAMPLE_PRD } from "@/data/sample-prd";

export interface PRDTemplate {
  id: string;
  title: string;
  description: string;
  widgets: string[];
  content: string;
}

export const CREW_WELFARE_PRD = `# Crew Welfare Portal — Product Requirements Document

## 1. Overview
Build a crew welfare portal for MV BridgeView to help ship managers track crew wellbeing, certification compliance, rest hours, and onboard amenities. Shore-side HR and the captain need a single dashboard for crew status and welfare alerts.

## 2. Target Users
- **Captain**: Crew roster oversight, certification compliance
- **Crew Manager** (shore): Welfare metrics, training schedules
- **Chief Cook**: Galley and provisioning status

## 3. Core Features

### 3.1 Crew Certification Status
- Table of all crew with active certifications and expiry dates
- Highlight certifications expiring within 30 days
- Filter by department: deck, engine, catering

### 3.2 Rest Hours Compliance
- Weekly rest-hour charts per crew member
- MLC 2006 compliance indicators
- Violation alerts with acknowledgment workflow

### 3.3 Welfare Check-in Panel
- Daily mood/wellness check-in summary
- Anonymous feedback submission stats
- Mental health resource links

### 3.4 Crew Roster Cards
- Onboard headcount by rank and nationality
- Contract end dates and relief planning
- Emergency contact quick view

### 3.5 Maritime Alert Panel
- Certification expiry warnings
- Rest hour violations
- Medical certificate renewals

### 3.6 Provisioning Status
- Fresh water, provisions, and medical supplies levels
- Next port resupply schedule

## 4. Technical Constraints
- Responsive Tailwind CSS layout (mobile-first for onboard tablets)
- React + TypeScript components
- Maritime color palette (blues, calm greens for welfare)
- Role-based views for captain vs shore manager
`;

export const NAVIGATION_PRD = `# Navigation & Route Planning Dashboard — Product Requirements Document

## 1. Overview
Build a navigation dashboard for MV BridgeView providing real-time vessel position, voyage progress, weather routing, and waypoint management for the bridge team during Atlantic crossings.

## 2. Target Users
- **Captain / Officer of the Watch**: Route monitoring, weather decisions
- **Navigator**: Waypoint planning, passage preparation
- **Fleet Manager**: ETA tracking across fleet

## 3. Core Features

### 3.1 Vessel Position Map
- Current latitude/longitude with last AIS update
- Heading, speed over ground, course over ground
- Mini chart with vessel icon and track history

### 3.2 Voyage Progress Tracker
- Active leg: origin → destination with ETA
- Distance remaining and percentage complete
- Upcoming waypoints with ETAs on timeline

### 3.3 Weather Conditions Card
- Wind speed/direction, wave height, sea state
- 24-hour forecast summary
- Weather routing recommendations

### 3.4 Route Deviation Alerts
- Cross-track error from planned route
- Speed advisory for fuel optimization
- Geofence entry/exit notifications

### 3.5 Maritime Alert Panel
- NAVAREA warnings, ice reports, piracy alerts
- CPA/TCPA proximity alerts for nearby vessels

### 3.6 Passage Planning Table
- Waypoint list with courses and distances
- UKC (under keel clearance) per leg
- Tidal window indicators for port approach

## 4. Technical Constraints
- Dark-mode friendly bridge display option
- Tailwind CSS with high-contrast maritime palette
- React + TypeScript, mock AIS/weather data
- Responsive: bridge monitor (desktop) and tablet
`;

export const PRD_TEMPLATES: PRDTemplate[] = [
  {
    id: "vessel-monitoring",
    title: "Vessel Monitoring",
    description: "Real-time fuel, engine, voyage, and alert dashboard for bulk carriers.",
    widgets: ["Voyage Tracker", "Fuel Gauges", "Engine Monitor", "Alerts"],
    content: SAMPLE_PRD,
  },
  {
    id: "crew-welfare",
    title: "Crew Welfare",
    description: "Certifications, rest hours, welfare check-ins, and crew roster management.",
    widgets: ["Crew Certs", "Rest Hours", "Welfare Panel", "Roster"],
    content: CREW_WELFARE_PRD,
  },
  {
    id: "navigation",
    title: "Navigation",
    description: "Position tracking, route planning, weather overlay, and passage management.",
    widgets: ["Position Map", "Voyage Progress", "Weather", "Waypoints"],
    content: NAVIGATION_PRD,
  },
];

export function getPRDTemplateById(id: string): PRDTemplate | undefined {
  return PRD_TEMPLATES.find((t) => t.id === id);
}
