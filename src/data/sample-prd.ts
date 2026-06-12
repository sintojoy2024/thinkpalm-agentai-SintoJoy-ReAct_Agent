export const SAMPLE_PRD = `# Vessel Monitoring Dashboard — Product Requirements Document

## 1. Overview
Build a real-time vessel monitoring dashboard for the MV BridgeView, a 180,000 DWT bulk carrier. The dashboard provides the captain, chief engineer, and fleet operations center with a unified view of voyage progress, fuel consumption, engine health, crew certification compliance, and safety alerts.

## 2. Target Users
- **Captain**: Voyage planning, navigation, weather decisions
- **Chief Engineer**: Engine monitoring, fuel management
- **Fleet Manager** (shore-side): Multi-vessel oversight, compliance reporting

## 3. Core Features

### 3.1 Voyage Progress Tracker
- Display current voyage leg with origin/destination ports
- Show ETA, distance remaining, and percentage complete on a visual timeline
- List upcoming waypoints with ETAs
- Support multiple active voyage legs

### 3.2 Fuel Gauge Cards
- Individual cards for HFO, MDO, and LNG tanks
- Circular gauge showing fill percentage
- Display current level, capacity, and daily consumption rate
- Color-coded thresholds: green (>50%), amber (20-50%), red (<20%)

### 3.3 Engine Monitoring Dashboard
- Real-time RPM, coolant temperature, and oil pressure for main and auxiliary engines
- Threshold indicators with visual alerts when values exceed limits
- Historical trend sparklines (last 24 hours)

### 3.4 Crew Certification Status
- Table of all crew members with their active certifications
- Show certification type, issue date, expiry date, and compliance status
- Highlight certifications expiring within 30 days
- Filter by department (deck, engine, catering)

### 3.5 Maritime Alert Panel
- Priority-sorted alert list: Critical, Warning, Info
- Alert types: engine faults, weather warnings, regulatory notices, AIS anomalies
- Acknowledge/dismiss functionality
- Audio notification for critical alerts

### 3.6 Vessel Position Display
- Current latitude/longitude with last update timestamp
- Heading, speed over ground (SOG), and course over ground (COG)
- Mini map placeholder with vessel icon

### 3.7 Weather Conditions
- Current wind speed and direction, wave height, sea state
- 24-hour forecast summary
- Weather routing recommendations

## 4. Data Entities
- Vessel (IMO, name, type, flag)
- Voyage (legs, waypoints, ETAs)
- FuelTank (type, level, capacity, consumption)
- Engine (id, RPM, temperature, oil pressure)
- CrewMember (name, rank, department, certifications)
- Alert (severity, type, message, timestamp, acknowledged)
- Position (lat, lon, heading, speed, timestamp)

## 5. Technical Constraints
- Responsive layout: desktop (3-column grid), tablet (2-column), mobile (single column)
- Tailwind CSS for all styling — maritime color palette (blues, ocean tones)
- React functional components with TypeScript
- Mock data for demo; API integration points clearly marked
- Accessibility: WCAG 2.1 AA compliance for color contrast
- Performance: initial render < 2 seconds with mock data

## 6. Non-Functional Requirements
- Support offline mode with cached last-known data
- Auto-refresh every 30 seconds when online
- Role-based view filtering (captain sees all, engineer sees engine/fuel focus)
`;
