import type { ComponentNode } from "@/types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PREVIEW_SHELL_HEAD = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            maritime: { 400:'#38bdf8', 500:'#0ea5e9', 600:'#0284c7', 700:'#0369a1', 800:'#075985', 900:'#0c4a6e', 950:'#082f49' },
            panel: { DEFAULT:'#1e293b', border:'#334155', muted:'#0f172a' }
          }
        }
      }
    }
  </script>
  <style>
    body { margin: 0; font-family: 'Segoe UI', system-ui, sans-serif; }
    *, *::before, *::after { box-sizing: border-box; }
    .sidebar-scroll::-webkit-scrollbar { width: 4px; }
    .sidebar-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-200">`;

function buildSidebarHtml(): string {
  const navItem = (label: string, active = false, badge?: string) => `
    <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${active ? "bg-maritime-600/20 text-maritime-400 border border-maritime-600/30" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}">
      <span class="w-4 h-4 rounded bg-slate-700/80 shrink-0"></span>
      <span class="flex-1">${label}</span>
      ${badge ? `<span class="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">${badge}</span>` : ""}
    </a>`;

  const navGroup = (title: string, items: string) => `
    <div class="mb-4">
      <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-2">${title}</p>
      <div class="space-y-0.5">${items}</div>
    </div>`;

  return `
  <aside class="hidden lg:flex flex-col w-56 xl:w-60 bg-panel-muted border-r border-panel-border shrink-0">
    <div class="p-4 border-b border-panel-border">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-maritime-600 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 10.189V14"/><path d="M12 2v3"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76"/>
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-bold text-white leading-tight">BridgeView</p>
          <p class="text-[10px] text-slate-500">Maritime Intelligence</p>
        </div>
      </div>
    </div>
    <nav class="flex-1 overflow-y-auto sidebar-scroll p-3 text-sm">
      ${navGroup("Overview", navItem("Dashboard", true) + navItem("Vessels") + navItem("Alerts", false, "12") + navItem("Voyages") + navItem("Reports"))}
      ${navGroup("Monitoring", navItem("Live Map") + navItem("Weather") + navItem("Fuel Monitor") + navItem("Engine Monitor"))}
      ${navGroup("Management", navItem("Crew") + navItem("Certification") + navItem("Documents"))}
      ${navGroup("Settings", navItem("Integrations") + navItem("User Management") + navItem("Settings"))}
    </nav>
    <div class="p-3 border-t border-panel-border">
      <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 text-xs text-slate-400">
        <span>Dark Mode</span>
        <div class="w-8 h-4 bg-maritime-600 rounded-full relative"><div class="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
      </div>
    </div>
  </aside>`;
}

function buildHeaderHtml(title: string): string {
  return `
  <header class="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-panel-border bg-panel-muted/80 backdrop-blur-sm flex-wrap">
    <div>
      <p class="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 mb-0.5">Live Preview</p>
      <div class="flex items-center gap-2 flex-wrap">
        <h1 class="text-lg sm:text-xl font-bold text-white">${escapeHtml(title)}</h1>
        <span class="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live
        </span>
      </div>
    </div>
    <div class="flex items-center gap-3 sm:gap-4 text-xs text-slate-400 flex-wrap">
      <span class="flex items-center gap-1.5"><span class="text-base">⛅</span> 28°C Partly Cloudy</span>
      <span class="flex items-center gap-1.5 hidden sm:flex">🕐 10:24 AM UTC +8</span>
      <button class="relative p-1.5 rounded-lg hover:bg-slate-800">
        <span class="text-base">🔔</span>
        <span class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
      </button>
      <div class="flex items-center gap-2 pl-2 border-l border-panel-border">
        <div class="w-7 h-7 rounded-full bg-maritime-600 flex items-center justify-center text-[10px] font-bold text-white">BO</div>
        <span class="text-slate-300 hidden sm:inline">BridgeView Ops ▾</span>
      </div>
    </div>
  </header>`;
}

function card(title: string, icon: string, body: string, className = ""): string {
  return `
  <div class="bg-panel border border-panel-border rounded-xl p-4 ${className}">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-lg">${icon}</span>
      <h3 class="text-sm font-semibold text-slate-200">${title}</h3>
    </div>
    ${body}
  </div>`;
}

function buildTopRowHtml(): string {
  const voyage = card("Voyage Progress", "🚢", `
    <div class="flex items-end justify-between mb-2">
      <span class="text-2xl font-bold text-white">75%</span>
      <span class="text-xs text-slate-400">3,420 / 5,500 nm</span>
    </div>
    <div class="w-full bg-slate-700 rounded-full h-2 mb-3">
      <div class="bg-gradient-to-r from-maritime-600 to-maritime-400 h-2 rounded-full" style="width:75%"></div>
    </div>
    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="bg-slate-800/50 rounded-lg p-2"><p class="text-slate-500">Singapore</p><p class="text-slate-300 font-medium">ETA May 14, 2026</p></div>
      <div class="bg-slate-800/50 rounded-lg p-2"><p class="text-slate-500">Rotterdam</p><p class="text-slate-300 font-medium">ETA Jun 1, 2026</p></div>
    </div>`);

  const fuel = card("Fuel Gauge Card", "⛽", `
    <div class="flex items-center gap-4">
      <div class="relative w-20 h-20 shrink-0">
        <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#334155" stroke-width="3"/>
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="75, 100" stroke-linecap="round"/>
        </svg>
        <span class="absolute inset-0 flex items-center justify-center text-sm font-bold text-maritime-400">75%</span>
      </div>
      <div>
        <p class="text-xl font-bold text-white">1,875 <span class="text-sm font-normal text-slate-400">/ 2,500 MT</span></p>
        <p class="text-xs text-amber-400 mt-1">Consumption: 42 MT/day</p>
      </div>
    </div>`);

  const crew = card("Crew Certification Status", "👥", `
    <div class="flex items-center gap-4">
      <div class="space-y-1.5 text-xs flex-1">
        <div class="flex justify-between"><span class="text-slate-400">Total Crew</span><span class="font-medium">24</span></div>
        <div class="flex justify-between"><span class="text-emerald-400">Certified</span><span class="font-medium text-emerald-400">20</span></div>
        <div class="flex justify-between"><span class="text-amber-400">Expiring Soon</span><span class="font-medium text-amber-400">3</span></div>
        <div class="flex justify-between"><span class="text-red-400">Expired</span><span class="font-medium text-red-400">1</span></div>
      </div>
      <div class="relative w-20 h-20 shrink-0">
        <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#334155" stroke-width="3"/>
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" stroke-width="3" stroke-dasharray="83, 100" stroke-linecap="round"/>
        </svg>
        <span class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-sm font-bold text-emerald-400">83%</span>
          <span class="text-[8px] text-slate-500">Certified</span>
        </span>
      </div>
    </div>`);

  const engine = card("Engine Monitoring", "⚙️", `
    <div class="flex items-start justify-between">
      <div>
        <p class="text-3xl font-bold text-white">82°C</p>
        <p class="text-xs text-slate-400">Main Engine Temp</p>
        <p class="text-xs text-emerald-400 mt-2 font-medium">● Status: Normal</p>
      </div>
      <svg class="w-24 h-10" viewBox="0 0 96 40" fill="none">
        <path d="M0 30 Q12 10 24 25 T48 15 T72 28 T96 8" stroke="#0ea5e9" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="grid grid-cols-2 gap-2 mt-3 text-xs">
      <div class="bg-slate-800/50 rounded-lg p-2 text-center"><p class="text-slate-500">RPM</p><p class="font-bold text-white">78</p></div>
      <div class="bg-slate-800/50 rounded-lg p-2 text-center"><p class="text-slate-500">Load</p><p class="font-bold text-white">62%</p></div>
    </div>`);

  return `<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">${voyage}${fuel}${crew}${engine}</div>`;
}

function buildMiddleRowHtml(): string {
  const alerts = card("Maritime Alert Panel", "🔔", `
    <div class="space-y-2">
      <div class="p-3 rounded-lg bg-red-500/10 border-l-4 border-red-500">
        <p class="text-[10px] font-bold text-red-400 mb-0.5">CRITICAL · 2 min ago</p>
        <p class="text-xs text-slate-300">Main engine oil pressure below threshold</p>
      </div>
      <div class="p-3 rounded-lg bg-amber-500/10 border-l-4 border-amber-500">
        <p class="text-[10px] font-bold text-amber-400 mb-0.5">WARNING · 15 min ago</p>
        <p class="text-xs text-slate-300">Heavy weather advisory — Bay of Bengal</p>
      </div>
      <div class="p-3 rounded-lg bg-maritime-500/10 border-l-4 border-maritime-500">
        <p class="text-[10px] font-bold text-maritime-400 mb-0.5">INFO · 1 hr ago</p>
        <p class="text-xs text-slate-300">Crew change scheduled in 3 days</p>
      </div>
      <a href="#" class="text-xs text-maritime-400 hover:underline block pt-1">View all alerts →</a>
    </div>`, "xl:row-span-2");

  const map = `
  <div class="bg-panel border border-panel-border rounded-xl p-4 xl:col-span-2 flex flex-col min-h-[280px]">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-lg">🗺️</span>
      <h3 class="text-sm font-semibold text-slate-200">Vessel Position Map</h3>
    </div>
    <div class="flex-1 relative rounded-lg overflow-hidden bg-slate-900 border border-slate-700 min-h-[200px]">
      <svg class="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
        <rect fill="#0f172a" width="800" height="300"/>
        <path d="M50 150 Q200 80 350 120 T550 100 T700 140" stroke="#334155" stroke-width="1" fill="none" opacity="0.5"/>
        <path d="M120 180 Q280 160 420 130 T620 110 T750 125" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="6 4" fill="none"/>
        <circle cx="120" cy="180" r="6" fill="#22c55e"/>
        <text x="105" y="200" fill="#94a3b8" font-size="10">Singapore</text>
        <circle cx="750" cy="125" r="6" fill="#f59e0b"/>
        <text x="720" y="115" fill="#94a3b8" font-size="10">Rotterdam</text>
        <g transform="translate(480, 115)">
          <path d="M-8 4 L0 -6 L8 4 L4 4 L4 10 L-4 10 L-4 4 Z" fill="#0ea5e9"/>
        </g>
      </svg>
      <div class="absolute top-2 right-2 flex flex-col gap-1">
        <button class="w-6 h-6 bg-slate-800 border border-slate-600 rounded text-xs text-slate-300">+</button>
        <button class="w-6 h-6 bg-slate-800 border border-slate-600 rounded text-xs text-slate-300">−</button>
      </div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-[10px] sm:text-xs">
      <div class="bg-slate-800/50 rounded p-2"><p class="text-slate-500">Latitude</p><p class="font-mono text-slate-200">48° 22.5' N</p></div>
      <div class="bg-slate-800/50 rounded p-2"><p class="text-slate-500">Longitude</p><p class="font-mono text-slate-200">004° 51.2' E</p></div>
      <div class="bg-slate-800/50 rounded p-2"><p class="text-slate-500">Heading</p><p class="font-mono text-slate-200">285°</p></div>
      <div class="bg-slate-800/50 rounded p-2"><p class="text-slate-500">Speed</p><p class="font-mono text-slate-200">14.2 kn</p></div>
      <div class="bg-slate-800/50 rounded p-2 col-span-2 sm:col-span-1"><p class="text-slate-500">Sea State</p><p class="font-mono text-slate-200">5</p></div>
    </div>
  </div>`;

  const weather = card("Weather Conditions", "🌤️", `
    <p class="text-2xl font-bold text-white mb-1">28°C <span class="text-sm font-normal text-slate-400">Partly Cloudy</span></p>
    <div class="grid grid-cols-3 gap-2 text-xs mt-3">
      <div class="bg-slate-800/50 rounded-lg p-2 text-center"><p class="text-slate-500">Wind</p><p class="font-medium">18 kn NE</p></div>
      <div class="bg-slate-800/50 rounded-lg p-2 text-center"><p class="text-slate-500">Waves</p><p class="font-medium">3.5 m</p></div>
      <div class="bg-slate-800/50 rounded-lg p-2 text-center"><p class="text-slate-500">Visibility</p><p class="font-medium">12 nm</p></div>
    </div>
    <a href="#" class="text-xs text-maritime-400 hover:underline block mt-3">View full forecast →</a>`);

  const vesselInfo = card("Vessel Information", "📋", `
    <dl class="space-y-2 text-xs">
      <div class="flex justify-between border-b border-slate-700/50 pb-1.5"><dt class="text-slate-500">Vessel Name</dt><dd class="font-medium text-slate-200">MV BridgeView</dd></div>
      <div class="flex justify-between border-b border-slate-700/50 pb-1.5"><dt class="text-slate-500">IMO Number</dt><dd class="font-mono text-slate-200">9845123</dd></div>
      <div class="flex justify-between border-b border-slate-700/50 pb-1.5"><dt class="text-slate-500">Vessel Type</dt><dd class="text-slate-200">Bulk Carrier</dd></div>
      <div class="flex justify-between border-b border-slate-700/50 pb-1.5"><dt class="text-slate-500">Flag</dt><dd class="text-slate-200">Singapore</dd></div>
      <div class="flex justify-between"><dt class="text-slate-500">DWT</dt><dd class="text-slate-200">82,000 MT</dd></div>
    </dl>`);

  return `
  <div class="grid grid-cols-1 xl:grid-cols-4 gap-4">
    <div class="xl:col-span-1">${alerts}</div>
    ${map}
    <div class="xl:col-span-1 space-y-4">${weather}${vesselInfo}</div>
  </div>`;
}

function buildBottomRowHtml(): string {
  const chart = `
  <div class="bg-panel border border-panel-border rounded-xl p-4 xl:col-span-3">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <span class="text-lg">📈</span>
        <h3 class="text-sm font-semibold text-slate-200">Fuel Consumption Trend</h3>
      </div>
      <div class="flex items-center gap-4 text-xs">
        <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-maritime-400"></span> Actual (MT/day)</span>
        <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-emerald-400 border-dashed border border-emerald-400"></span> Average (MT/day)</span>
      </div>
    </div>
    <svg class="w-full h-40 sm:h-48" viewBox="0 0 600 160" preserveAspectRatio="none">
      <line x1="40" y1="140" x2="580" y2="140" stroke="#334155" stroke-width="1"/>
      <line x1="40" y1="20" x2="40" y2="140" stroke="#334155" stroke-width="1"/>
      <path d="M60 100 L120 85 L180 95 L240 70 L300 80 L360 55 L420 65 L480 45 L540 60" stroke="#0ea5e9" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M60 90 L120 88 L180 86 L240 84 L300 82 L360 80 L420 78 L480 76 L540 74" stroke="#22c55e" stroke-width="1.5" fill="none" stroke-dasharray="4 3" stroke-linecap="round"/>
      <rect x="350" y="30" width="90" height="40" rx="4" fill="#1e293b" stroke="#334155"/>
      <text x="360" y="48" fill="#94a3b8" font-size="9">May 11</text>
      <text x="360" y="62" fill="#0ea5e9" font-size="9">Actual: 42 MT/day</text>
      <text x="360" y="74" fill="#22c55e" font-size="9">Average: 45 MT/day</text>
      ${["May 7","May 8","May 9","May 10","May 11","May 12","May 13"].map((d, i) =>
        `<text x="${60 + i * 80}" y="155" fill="#64748b" font-size="9" text-anchor="middle">${d}</text>`
      ).join("")}
    </svg>
  </div>`;

  const actions = card("Quick Actions", "⚡", `
    <div class="grid grid-cols-2 gap-2">
      <button class="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors">
        <span class="text-xl">🚨</span><span class="text-[10px] text-slate-300">Report Issue</span>
      </button>
      <button class="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-maritime-500/10 border border-maritime-500/20 hover:bg-maritime-500/20 transition-colors">
        <span class="text-xl">📝</span><span class="text-[10px] text-slate-300">Add Note</span>
      </button>
      <button class="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
        <span class="text-xl">🆘</span><span class="text-[10px] text-slate-300">Request Support</span>
      </button>
      <button class="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
        <span class="text-xl">📊</span><span class="text-[10px] text-slate-300">Production Code</span>
      </button>
    </div>`, "xl:col-span-1");

  return `<div class="grid grid-cols-1 xl:grid-cols-4 gap-4">${chart}${actions}</div>`;
}

function buildMaritimeDashboardHtml(title: string): string {
  return `${PREVIEW_SHELL_HEAD}
  <div class="flex min-h-screen">
    ${buildSidebarHtml()}
    <div class="flex-1 flex flex-col min-w-0">
      ${buildHeaderHtml(title)}
      <div class="flex-1 p-4 sm:p-6 space-y-4 overflow-x-hidden">
        ${buildTopRowHtml()}
        ${buildMiddleRowHtml()}
        ${buildBottomRowHtml()}
      </div>
    </div>
  </div>
</body>
</html>`;
}

/** Builds the polished maritime dashboard preview (iframe / StackBlitz index.html). */
export function buildPreviewFromTree(tree: ComponentNode, title?: string): string {
  const dashboardTitle =
    title ||
    (typeof tree.props?.title === "string" ? tree.props.title : null) ||
    tree.name ||
    "Vessel Monitoring Dashboard";

  return buildMaritimeDashboardHtml(
    dashboardTitle.includes("Dashboard") ? dashboardTitle : `${dashboardTitle} Dashboard`
  );
}
