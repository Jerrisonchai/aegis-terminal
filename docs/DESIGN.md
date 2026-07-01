# TRADING V3 — Design Document

> **Codename:** AEGIS | **Design System:** Terminal Glass | **Last Updated:** 2026-07-01

---

## 1. DESIGN PHILOSOPHY

### 1.1 Core Identity
**"Trading Desk, Not a Website"** — The dashboard should feel like Bloomberg Terminal's younger, faster cousin. Every pixel serves a purpose. No decoration, only information density optimized for rapid scanning.

### 1.2 Three Design Pillars
| Pillar | Meaning |
|--------|---------|
| **Clarity** | Data first. Numbers are the hero. Charts breathe. |
| **Speed** | Instant feedback. No spinners longer than 300ms. Streaming where possible. |
| **Control** | Every action is one click away. Power users navigate via keyboard shortcuts. |

### 1.3 Emotional Target
- **Confidence** — The system looks reliable, calculated, institutional
- **Alertness** — Color-coded status keeps you aware without anxiety
- **Focus** — Dark environment reduces eye strain during long monitoring sessions

---

## 2. COLOR SYSTEM

### 2.1 Financial Dashboard Palette (from ui-ux-pro-max)
```
Background:   #020617  (deepest navy — OLED friendly)
Foreground:   #F8FAFC  (crisp white text)
Primary:      #0F172A  (dark slate — nav bars, headers)
Secondary:    #1E293B  (medium slate — sidebars)
Card:         #0E1223  (card backgrounds)
Muted:        #1A1E2F  (hover states, subtle surfaces)
Muted-FG:     #94A3B8  (secondary text, labels)
Border:       #334155  (dividers, card edges)
Accent:       #22C55E  (GREEN — profit, buy signals, success)
Destructive:  #EF4444  (RED — loss, sell signals, danger)
```

### 2.2 Semantic Signal Colors
```
Buy Signal:   #22C55E (green-500)
Watch Signal: #EAB308 (yellow-500)
Weak Signal:  #F97316 (orange-500)
Avoid Signal: #EF4444 (red-500)
Neutral:      #64748B (slate-500)
```

### 2.3 Chart Color Palette
```javascript
chartColors: [
  '#3B82F6', // blue — primary data
  '#22C55E', // green — bullish
  '#EF4444', // red — bearish
  '#A855F7', // purple — volume
  '#EAB308', // yellow — signals
  '#06B6D4', // cyan — RSI
  '#F97316', // orange — volatility
]
```

### 2.4 Usage Rules
- Background is always `#020617` — never pure black (eye strain)
- Green ONLY for profit/gains/buy — never for UI decoration
- Red ONLY for loss/sells/danger — never for emphasis
- Blue (`#3B82F6`) is the system color — links, active states, selection
- Text contrast minimum 4.5:1 on all surfaces

---

## 3. TYPOGRAPHY

### 3.1 Font Stack
```css
--font-display: 'JetBrains Mono', monospace;  /* Numbers, tickers, code, data */
--font-body: 'Inter', sans-serif;              /* Labels, descriptions, UI text */
```

### 3.2 Typography Scale (fluid, clamp-based)
```css
--text-xs:   clamp(0.6875rem, 0.65rem + 0.1875vw, 0.75rem);   /* 11-12px */
--text-sm:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);       /* 12-14px */
--text-base: clamp(0.875rem, 0.825rem + 0.25vw, 1rem);        /* 14-16px */
--text-lg:   clamp(1rem, 0.925rem + 0.375vw, 1.25rem);        /* 16-20px */
--text-xl:   clamp(1.125rem, 1rem + 0.625vw, 1.5rem);         /* 18-24px */
--text-2xl:  clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem);        /* 24-36px */
--text-3xl:  clamp(2rem, 1.5rem + 2.5vw, 3.5rem);             /* 32-56px */
```

### 3.3 Typography Rules
- **Numbers always JetBrains Mono** — monospaced for alignment in tables
- **Headers in Inter Bold** — clear hierarchy
- **Body in Inter Regular** — readable at small sizes
- **Ticker symbols uppercase JetBrains Mono**
- **No ALL CAPS for labels** — sentence case only
- **Tabular figures** for all data tables (`font-variant-numeric: tabular-nums`)

---

## 4. LAYOUT ARCHITECTURE

### 4.1 Shell Structure
```
┌─────────────────────────────────────────────────────┐
│  TOP BAR: Logo | Ticker | Market Status | Time      │
├────────┬────────────────────────────────────────────┤
│        │                                            │
│ SIDEBAR│              CONTENT AREA                  │
│        │                                            │
│  Nav   │    ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│ Links  │    │ Card 1   │ │ Card 2   │ │ Card 3  │ │
│        │    └──────────┘ └──────────┘ └─────────┘ │
│  📊 Ovw│                                            │
│  📡 Sgn│    ┌─────────────────────────────────────┐ │
│  🔍 Scn│    │          Full-Width Section         │ │
│  📈 Ind│    └─────────────────────────────────────┘ │
│  ⚡ B/T│                                            │
│  🏷️ Tkr│    ┌────────────┐ ┌────────────────────┐ │
│  💼 Pos│    │ Chart      │ │ Data Table         │ │
│  ⏰ Crn│    └────────────┘ └────────────────────┘ │
│  ⚙️ Set│                                            │
│        │                                            │
├────────┴────────────────────────────────────────────┤
│  STATUS BAR: Cron OK ● | Data Fresh 2m | Mem 5.8GB │
└─────────────────────────────────────────────────────┘
```

### 4.2 Breakpoints
| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Stacked, bottom tab nav, simplified cards |
| Tablet | 768-1024px | Collapsible sidebar, 2-col grid |
| Desktop | 1024-1440px | Full sidebar, 3-col grid on overview |
| Wide | > 1440px | Expanded sidebar, 4-col grid, multi-chart |

### 4.3 Sidebar Navigation
```
📊 Overview       — Main dashboard
📡 Signals        — Live signal feed
🔍 Scanners       — Trigger & view scans
📈 Indicators     — Library & config
⚡ Backtesting    — Results & strategy compare
🏷️ Tickers        — Watchlist management
💼 Positions      — Current positions & P&L
⏰ Cron           — Job management & monitoring
⚙️ Settings       — System configuration
```

---

## 5. COMPONENT DESIGN

### 5.1 Status Dot (Live Pulse)
```tsx
// Green = healthy, Yellow = degraded, Red = down
// Pulse animation on green: subtle breathing glow
<div className="status-dot" data-status="healthy" />
```
- 8px circle with 2px glow ring
- Pulse animation: opacity 1 → 0.6 → 1 over 2s (only when healthy)
- Red = static (no pulse, demands attention)

### 5.2 Metric Card
```
┌──────────────────────┐
│ Daily P&L            │  ← Muted label (JetBrains Mono, xs)
│ +RM 12.40 (+2.3%)   │  ← Large value (JetBrains Mono, 2xl)
│ ▲ Today vs Yesterday │  ← Trend indicator (green up arrow)
└──────────────────────┘
```
- Glass-morphism: `bg-[#0E1223]/80 backdrop-blur-sm border border-[#334155]`
- Border radius: 12px
- Hover: subtle border brighten to `#475569`
- framer-motion: fade + slide-up on mount

### 5.3 Signal Card
```
┌──────────────────────────────────────┐
│ AAPL              BUY  [64.4]        │  ← Ticker + Tier badge + Composite
│ $281.74            ▲ OBV Bull Div    │  ← Price + top signal
│ ─────────────────────────────────── │
│ Signal S: 85  |  Net Sent: 85       │  ← Dimension breakdown
│ Volume: 80    |  RSI Zone: 75       │
│ Diversity: 45 |  Historic: 0        │
│                                     │
│ [View Chart]  [Add Watchlist]       │  ← Actions
└──────────────────────────────────────┘
```
- Tier badge colored by tier (Buy=green, Watch=yellow, etc.)
- Composite score in brackets next to tier
- Expandable dimension breakdown
- Quick actions at bottom

### 5.4 Data Table
```
┌──────┬──────────┬────────┬───────┬──────┬──────────────┐
│ #    │ Ticker   │ Close   │ Comp  │ Tier │ Signals      │
├──────┼──────────┼────────┼───────┼──────┼──────────────┤
│  1   │ AAPL     │ $281.74│ 64.4  │ BUY  │ OBV_BULL...  │
│  2   │ INTC     │ $131.72│ 61.1  │ BUY  │ ABOVE_ALL... │
│  3   │ UNH      │ $419.82│ 53.6  │ WATCH│ ABOVE_ALL_MA │
└──────┴──────────┴────────┴───────┴──────┴──────────────┘
```
- Monospaced numbers (tabular-nums)
- Sortable columns (click header)
- Tier column with colored dot + text
- Row hover: `bg-[#1A1E2F]` highlight
- Sticky header on scroll
- framer-motion: staggered row entry

### 5.5 Scan Trigger Button
```
┌───────────────────┐
│  🔍 Run MY Scan   │  ← Primary action button
│  Last: 2m ago     │  ← Timestamp below
│  ✅ 44/44 OK      │  ← Status indicator
└───────────────────┘
```
- States: idle → running (pulsing border) → complete (green flash) → error (red)
- Disabled while scan is running (prevents duplicate)
- framer-motion: scale press effect

### 5.6 Cron Job Row
```
┌──────────────────────────────────────────────────────┐
│ ● v2.1 MY Scan    ○ 5:30 PM weekdays    [Run Now]   │
│   Last: 2026-06-30 17:30  ✓ OK (664s)               │
└──────────────────────────────────────────────────────┘
```
- Status dot: green=OK, yellow=warning, red=error, gray=disabled
- Last run with duration
- "Run Now" button for manual trigger
- Expandable run history

### 5.7 Chart Components (Recharts)
- **Equity curve**: Area chart, gradient fill, profit zone green / loss zone red
- **Win rate donut**: Green wins / Red losses with center %
- **Composite score bar**: Horizontal bars, colored by tier
- **Signal timeline**: Scatter plot, signals over time
- **Volume profile**: Bar chart with SMA overlay

### 5.8 Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `1-9` | Switch to page (1=Overview, 2=Signals, etc.) |
| `Ctrl+Enter` | Trigger last scan |
| `Ctrl+K` | Command palette (search any ticker, action) |
| `Esc` | Close modal / clear filter |
| `F` | Focus search bar |
| `R` | Refresh current page data |

---

## 6. ANIMATION SYSTEM (framer-motion)

### 6.1 Principles
- **Purpose-driven**: Animation communicates state change (scan complete, price update)
- **Fast**: Durations 150-300ms — feels responsive, not sluggish
- **Staggered**: List items enter with 50ms delay between each for visual rhythm
- **Respects `prefers-reduced-motion`**: All animations disabled when set

### 6.2 Animation Catalog
| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page enter | Fade + slide up (20px) | 300ms | easeOut |
| Card mount | Fade + scale (0.97→1) | 250ms | easeOut |
| List item | Staggered fade + slide right | 200ms (50ms stagger) | easeOut |
| Number change | Count-up animation | 500ms | easeOut |
| Status dot | Breathing opacity pulse | 2000ms infinite | easeInOut |
| Scan progress | Border pulse glow | 1000ms infinite | linear |
| Modal | Scale (0.95→1) + fade | 200ms | easeOut |
| Toast alert | Slide in from right + fade | 300ms | easeOut |

### 6.3 Price Change Animation
When a price updates:
1. Flash the cell background (green for up, red for down)
2. Fade back to normal over 800ms
3. Number transitions smoothly via count-up

---

## 7. RESPONSIVE BEHAVIOR

### 7.1 Mobile (< 768px)
- Sidebar collapses to bottom tab bar (5 icons: Overview, Signals, Positions, Cron, Settings)
- Cards stack vertically, full width
- Tables collapse to card-list format
- Charts simplify (single metric, less detail)
- Scan buttons become full-width thumb targets (min 44px)
- Swipe gestures for navigation between pages

### 7.2 Tablet (768-1024px)
- Collapsible sidebar (hamburger toggle)
- 2-column grid on overview
- Tables at full width
- Charts at 50% width side-by-side

### 7.3 Desktop (1024px+)
- Persistent sidebar (240px)
- 3-column grid on overview
- Multi-chart layouts
- Keyboard shortcuts active
- Hover tooltips on all data points

---

## 8. DATA VISUALIZATION STANDARDS

### 8.1 Chart Rules
- Always show Y-axis labels (never hide them)
- Always show grid lines (subtle, `#1A1E2F`)
- Profit = green (#22C55E), Loss = red (#EF4444)
- No 3D charts (distorts data)
- Tooltips on hover with exact values
- Responsive: charts resize with container
- Dark theme ONLY — no light mode toggle (trading desk environment)

### 8.2 Table Rules
- Alternating row colors (transparent / `#0A0D1A`)
- Column headers with sort indicators (▲ ▼)
- Sticky header row
- Horizontal scroll for wide tables on mobile
- Row count display ("Showing 12 of 44")

---

## 9. STATE MANAGEMENT

### 9.1 Loading States
| Element | Loading Treatment |
|---------|-------------------|
| Page | Skeleton cards (pulsing gray rectangles matching card layout) |
| Table | Skeleton rows (3 placeholder rows) |
| Chart | Subtle shimmer placeholder matching chart dimensions |
| Button | Disabled + spinner icon replacing text |
| Live data | Stale indicator (gray dot → "Data 5m old") |

### 9.2 Empty States
| Element | Empty Treatment |
|---------|-----------------|
| No signals | "No signals today" with calendar icon + "Run a scan to generate signals" CTA |
| No positions | "No open positions" with briefcase icon |
| No backtests | "Run your first backtest" with play icon + setup wizard link |
| No tickers | "Add tickers to your watchlist" with search bar |

### 9.3 Error States
- Card-level errors (don't crash the whole page)
- Retry button on failed data fetches
- Toast notifications for transient errors
- Error boundary for unhandled exceptions

---

## 10. TECHNOLOGY STACK

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | Server components, streaming, Vercel deploy |
| Styling | Tailwind CSS v4 | Utility-first, dark theme tokens |
| Animation | framer-motion | Declarative, performant, `prefers-reduced-motion` |
| Charts | Recharts | React-native, composable, dark theme support |
| Icons | Lucide React | Clean, consistent, tree-shakeable |
| Fonts | Inter + JetBrains Mono | Data + UI pairing |
| State | React Context + SWR | SWR for data fetching with cache/revalidate |
| API | Next.js API Routes | Co-located with frontend |
| Deployment | Vercel (free tier) | Zero-config Next.js hosting |

---

## 11. ACCESSIBILITY

- All interactive elements: min 44×44px touch targets
- Color is never the sole indicator (icons + text alongside)
- Focus indicators visible (ring on :focus-visible)
- Semantic HTML (`<nav>`, `<main>`, `<table>`, `<button>`)
- `aria-label` on icon-only buttons
- `prefers-reduced-motion` respected
- Keyboard navigable (Tab, Enter, Esc, shortcuts)

---

## 12. DESIGN TOKENS (Tailwind Config)

```js
// tailwind.config.ts
colors: {
  bg:        '#020617',
  surface:   '#0E1223',
  card:      '#0F172A',
  muted:     '#1A1E2F',
  border:    '#334155',
  foreground:'#F8FAFC',
  'fg-muted':'#94A3B8',
  accent:    '#22C55E',
  danger:    '#EF4444',
  primary:   '#3B82F6',
  'buy':     '#22C55E',
  'watch':   '#EAB308',
  'weak':    '#F97316',
  'avoid':   '#EF4444',
},
fontFamily: {
  mono:  ['JetBrains Mono', 'monospace'],
  sans:  ['Inter', 'sans-serif'],
}
```

---

**EOF**
