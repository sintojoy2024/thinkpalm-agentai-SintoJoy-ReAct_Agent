# Vessel Monitoring Dashboard — Product Requirements Document

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

### 3.2 Fuel Gauge Cards
- Individual cards for HFO, MDO, and LNG tanks
- Circular gauge showing fill percentage
- Display current level, capacity, and daily consumption rate

### 3.3 Engine Monitoring Dashboard
- Real-time RPM, coolant temperature, and oil pressure
- Threshold indicators with visual alerts

### 3.4 Crew Certification Status
- Table of crew members with certifications and expiry dates
- Highlight certifications expiring within 30 days

### 3.5 Maritime Alert Panel
- Priority-sorted alerts: Critical, Warning, Info
- Engine faults, weather warnings, regulatory notices

### 3.6 Vessel Position Display
- Latitude/longitude, heading, speed over ground

### 3.7 Weather Conditions
- Wind, wave height, sea state, forecast summary

## 4. Technical Constraints
- Responsive Tailwind CSS layout
- React + TypeScript components
- Maritime color palette (blues, ocean tones)
