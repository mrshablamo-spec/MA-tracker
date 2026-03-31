# AGENT_CONTEXT.md
> This file is a shared context document for AI agents (Claude, Codex, etc.) working on this repository.
> It explains what the project is, how it was built, and what to watch out for when debugging.

---

## 1. Project Purpose

**MA-tracker** is a portfolio/thesis project targeting investment banking analyst recruiting. It has two parts:

1. **M&A Deal Tracker Dashboard** — displays 20+ curated real-world Mergers & Acquisitions in two niches: *AI Startups* and *Green Tech*. Users can filter by niche, sort the table, and click deals for a detail view.

2. **Synergy Calculator** — the flagship feature. Users input two public company tickers, the app fetches their financials (live via Financial Modeling Prep API, or from built-in mock data), and runs a simplified **Discounted Cash Flow (DCF)** model to estimate whether the merger makes financial sense. Output includes a color-coded verdict, NPV of synergies, accretion/dilution %, charts, and a year-by-year DCF breakdown table that mirrors real investment banking model output.

The app is designed to impress IB recruiters by demonstrating domain knowledge (DCF, WACC, synergies, accretion/dilution) in a working product.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 (dark "Bloomberg Terminal" aesthetic) |
| Charts | Recharts |
| Global state | Zustand |
| Data fetching / caching | TanStack Query (React Query v5) |
| Financial data | Financial Modeling Prep (FMP) REST API — free tier, 250 req/day |
| Mock data fallback | Static JSON in `src/data/mockFinancials.ts` |
| Routing | React Router v6 |
| Icons | Lucide React |
| Utilities | clsx, tailwind-merge |

---

## 3. Directory Map

```
/
├── index.html                  Vite HTML entry
├── package.json
├── vite.config.ts              Path alias: @/ → src/
├── tailwind.config.ts          Custom dark palette (navy-950, emerald, amber, red accents)
├── tsconfig.json               Strict TS, path aliases
├── .env.example                Documents VITE_FMP_API_KEY
├── AGENT_CONTEXT.md            This file
│
└── src/
    ├── main.tsx                React entry — wraps app in QueryClientProvider + BrowserRouter
    ├── App.tsx                 Route definitions: / → Dashboard, /calculator → Synergy, /deal/:id → Detail
    ├── index.css               Tailwind directives + scrollbar styling + tabular-nums utility
    ├── vite-env.d.ts           ImportMeta.env types (VITE_FMP_API_KEY)
    │
    ├── types/
    │   ├── deal.ts             Deal, DealStatus, DealNiche types
    │   ├── company.ts          CompanyProfile, AnnualFinancials types
    │   └── dcf.ts              DCFAssumptions, SynergyAssumptions, DCFOutput, SynergyResult types
    │
    ├── lib/
    │   ├── constants.ts        DEFAULT_ASSUMPTIONS, SYNERGY_RAMP, SECTOR_COLORS, NICHE_OPTIONS
    │   ├── formatters.ts       formatCurrency, formatPercent, formatMultiple, formatDate, formatDelta
    │   ├── api.ts              Axios client for FMP API — fetchProfile, fetchIncomeStatements,
    │   │                       fetchCashFlowStatements, fetchBalanceSheet, searchTickers
    │   ├── dcf.ts              Pure DCF math — deriveBaseFCF, projectFCF, terminalValue,
    │   │                       discountFactor, calculateDCF
    │   └── synergy.ts          calculateSynergy — combines two DCF outputs with synergy ramp,
    │                           integration costs, verdict logic, accretion/dilution
    │
    ├── data/
    │   ├── deals.ts            20+ curated real M&A deals (2021–2025), AI Startups + Green Tech
    │   ├── mockFinancials.ts   Pre-populated CompanyProfile objects for 6 tickers:
    │   │                       MSFT, GOOGL, NVDA (AI), ENPH, NEE, BE (Green Tech)
    │   └── sectors.ts          Sector → niche mapping with color codes
    │
    ├── store/
    │   └── filterStore.ts      Zustand store — niche filter state (All/AI Startups/Green Tech)
    │
    ├── hooks/
    │   ├── useCompanyFinancials.ts  React Query hook — fetches FMP API for a ticker,
    │   │                            normalises units ($→$B), falls back to mockFinancials on error
    │   ├── useDCFCalculation.ts     useMemo wrapper around calculateDCF
    │   ├── useSynergyScore.ts       useMemo wrapper around calculateSynergy
    │   └── useDeals.ts              Returns filtered deals from static data; useDealStats for KPIs
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx           Sticky top nav with logo + route links
    │   │   └── PageWrapper.tsx      Max-width container with page title slot
    │   │
    │   ├── ui/
    │   │   ├── Badge.tsx            DealStatus pill (Completed/Pending/Rumored/Terminated)
    │   │   ├── MetricCard.tsx       KPI card with label, value, optional delta
    │   │   ├── LoadingSpinner.tsx   Skeleton pulse + SpinnerIcon SVG
    │   │   ├── ErrorBanner.tsx      Red error banner with optional "Use Demo Data" button
    │   │   └── Tooltip.tsx          Hover tooltip with financial glossary (WACC, DCF, FCF, EV…)
    │   │
    │   ├── dashboard/
    │   │   ├── NicheFilter.tsx      Tab buttons — writes to Zustand filterStore
    │   │   ├── MarketPulseBar.tsx   4-card KPI strip using useDealStats
    │   │   ├── DealTable.tsx        Sortable table — all deals, click row → /deal/:id
    │   │   ├── SectorChart.tsx      Recharts BarChart — deal volume by sector
    │   │   └── DealVolumeChart.tsx  Recharts AreaChart — deal volume by month
    │   │
    │   └── synergy/
    │       ├── TickerSearchInput.tsx     Debounced search → FMP /search or mock fallback
    │       ├── CompanyProfileCard.tsx    Financial summary card; shows "Demo" badge if mock
    │       ├── AssumptionsPanel.tsx      Range sliders for all 6 DCF assumptions
    │       ├── SynergyResultCard.tsx     Verdict banner + 6-metric grid (NPV, EV, premium, A/D…)
    │       ├── CashFlowProjectionChart.tsx  Line chart: Combined FCF vs. each standalone
    │       ├── SynergyWaterfallChart.tsx    Bar chart: EV A + EV B + synergies - costs = combined EV
    │       └── DCFBreakdownTable.tsx     Year-by-year table: Revenue, EBITDA, FCF, DF, PV
    │
    └── pages/
        ├── DashboardPage.tsx         Composes all dashboard components
        ├── SynergyCalculatorPage.tsx Main calculator — manages ticker state + passes to hooks
        └── DealDetailPage.tsx        Single deal view with link to pre-fill calculator
```

---

## 4. Implementation Steps (in order)

1. Created `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `index.html`, `.env.example`, `.gitignore`
2. Ran `npm install` to install all dependencies
3. Created directory tree: `src/types`, `src/lib`, `src/data`, `src/store`, `src/hooks`, `src/components/{layout,ui,dashboard,synergy}`, `src/pages`
4. Wrote TypeScript types: `types/deal.ts`, `types/company.ts`, `types/dcf.ts`
5. Wrote `lib/constants.ts` (defaults, synergy ramp, colors) and `lib/formatters.ts`
6. Wrote `data/deals.ts` — 20+ real deals manually curated from public filings
7. Wrote `data/mockFinancials.ts` — 6 company profiles with realistic financial figures
8. Wrote `data/sectors.ts`
9. Wrote `lib/api.ts` — Axios client for FMP with typed response interfaces
10. Wrote `lib/dcf.ts` — pure DCF math functions (no React)
11. Wrote `lib/synergy.ts` — synergy calculation combining two DCF outputs
12. Wrote `store/filterStore.ts` — Zustand niche filter
13. Wrote all four hooks in `src/hooks/`
14. Wrote shared UI components: Badge, MetricCard, LoadingSpinner, ErrorBanner, Tooltip
15. Wrote layout: Navbar, PageWrapper
16. Wrote `src/index.css`, `src/main.tsx`, `src/App.tsx`
17. Wrote dashboard components: NicheFilter, MarketPulseBar, DealTable, SectorChart, DealVolumeChart
18. Wrote `pages/DashboardPage.tsx`
19. Wrote synergy components: TickerSearchInput, CompanyProfileCard, AssumptionsPanel, SynergyResultCard, CashFlowProjectionChart, SynergyWaterfallChart, DCFBreakdownTable
20. Wrote `pages/SynergyCalculatorPage.tsx` and `pages/DealDetailPage.tsx`
21. Wrote `src/vite-env.d.ts` to type `import.meta.env.VITE_FMP_API_KEY`
22. Fixed two TypeScript errors: unused import in `synergy.ts`, `ImportMeta.env` typing in `api.ts`
23. Ran `npx tsc --noEmit` — passed clean (0 errors)
24. Committed and pushed to branch `claude/plan-ma-dashboard-eTA6D`
25. Committed `package-lock.json` in a follow-up commit after stop-hook triggered

---

## 5. DCF Model — How the Math Works

### Standalone Company DCF (`src/lib/dcf.ts`)

```
baseFCF = company.freeCashFlow  (if > 0)
        OR  company.ebitda × (1 - taxRate) - company.capEx  (fallback)

projectedFCF[t] = prevFCF × (1 + g_t)
  where g_t blends linearly from nearGrowthRate (capped at 30%) → terminalGrowthRate
  nearGrowthRate = company.revenueGrowth3yr (3-year revenue CAGR)

terminalValue = FCF_N × (1 + terminalGrowthRate) / (WACC - terminalGrowthRate)

enterpriseValue = Σ(FCF_t / (1+WACC)^t) + terminalValue / (1+WACC)^N
equityValue     = enterpriseValue - netDebt
```

### Synergy Calculation (`src/lib/synergy.ts`)

```
annualRevenueSynergy = (revA + revB) × revenueSynergyPct   (default 5%)
annualCostSynergy    = (opExA + opExB) × costSynergyPct    (default 8%)
totalAnnualSynergy   = annualRevenueSynergy + annualCostSynergy

synergyRamp = [0.25, 0.65, 0.85, 1.0, 1.0]   (% realised each year)

netSynergy_t = totalAnnualSynergy × ramp[t] - (integrationCost if t=0 else 0)
npvSynergies = Σ(netSynergy_t / (1+WACC)^t)

combinedFCF_t = standaloneA_FCF_t + standaloneB_FCF_t + netSynergy_t
combinedEV    = DCF(combinedFCF, WACC, terminalGrowthRate)

impliedPremium = (combinedEV - (evA + evB)) / (evA + evB)
```

### Verdict thresholds
```
npvSynergies > 0 AND impliedPremium > 5%  → "MERGER MAKES FINANCIAL SENSE" (green)
npvSynergies > 0 AND impliedPremium >= 0  → "MARGINALLY ACCRETIVE — PROCEED WITH CAUTION" (amber)
otherwise                                 → "NOT RECOMMENDED" (red)
```

### Accretion / Dilution
```
combinedNetIncome = netIncomeA + netIncomeB + totalAnnualSynergy × (1 - avgTaxRate)
proFormaEPS       = combinedNetIncome / (totalShares / 1000)
accretion         = (proFormaEPS - acquirerEPS) / |acquirerEPS|
```

---

## 6. Data Sources

### FMP API (`src/lib/api.ts`)

Base URL: `https://financialmodelingprep.com/api/v3`
API key: `import.meta.env.VITE_FMP_API_KEY` — set in `.env` (see `.env.example`)

| Endpoint | Used for |
|---|---|
| `GET /profile/{ticker}` | Market cap, shares outstanding, sector, beta, P/E |
| `GET /income-statement/{ticker}?limit=3` | Revenue, EBITDA, net income (3 years for CAGR) |
| `GET /cash-flow-statement/{ticker}?limit=3` | Operating CF, CapEx, FCF |
| `GET /balance-sheet-statement/{ticker}?limit=1` | Total debt, cash |
| `GET /search?query={q}&limit=10` | Ticker autocomplete in TickerSearchInput |

**Unit conversion** — FMP returns raw dollar amounts (e.g. `245100000000`). `useCompanyFinancials.ts` divides all financial figures by `1e9` to normalise to **$B** before creating the `CompanyProfile` object. All internal math and display assumes **billions**.

### Mock Data Fallback

`hasApiKey()` in `api.ts` checks if `VITE_FMP_API_KEY` is set and non-empty/non-placeholder. If false, `useCompanyFinancials` returns data directly from `mockFinancials.ts`. The `CompanyProfileCard` shows a "Demo" amber badge when `profile.isUsingMockData === true`.

**Demo tickers (no API key needed):** MSFT, GOOGL, NVDA, ENPH, NEE, BE

---

## 7. Known Edge Cases / Things to Watch

1. **Negative FCF fallback** (`dcf.ts:deriveBaseFCF`) — if `freeCashFlow <= 0`, falls back to `EBITDA × (1 - taxRate) - CapEx`. If EBITDA is also negative (distressed companies), the DCF output will be negative/unreliable. No hard guard exists — the verdict will likely show "NOT RECOMMENDED" which is correct behaviour.

2. **WACC ≤ terminal growth rate** (`dcf.ts:terminalValue`) — throws `Error('WACC must exceed terminal growth rate')`. This is caught by `useDCFCalculation` and `useSynergyScore` which return `null` on any exception. The calculator UI shows no results until valid inputs exist. Default values (WACC 9%, terminal growth 2.5%) are safe. The AssumptionsPanel range sliders are bounded: WACC min 4%, terminal growth max 5%.

3. **Unit mismatch: sharesOutstanding** — FMP returns `sharesOutstanding` as a raw integer (e.g. `7440000000` for MSFT). `useCompanyFinancials` divides by `1e6` to get **millions**. The DCF equity value calculation then divides by `sharesOutstanding / 1000` to convert millions → billions for a per-share price in dollars. Mock data stores shares already in millions.

4. **Revenue CAGR calculation** — uses `(r0 / r2)^(1/2) - 1` over the 2-year span between index 0 and index 2 of the income statement array (3 years of data). If FMP returns fewer than 3 years, falls back to `0.07` (7%) default.

5. **opEx derivation** — FMP's income statement does not have a single "opEx" field. `useCompanyFinancials` derives it as `revenue - ebitda`. This is used in the cost synergy calculation in `synergy.ts`. For companies with unusual margin structures this may be slightly off.

6. **Recharts tooltip formatter typing** — Recharts passes `value` as `number | string`. All tooltip formatters cast to `number` — if Recharts passes a string in an edge case it will format as `NaN`. Not a crash, just a display issue.

7. **TickerSearchInput internal state** — the component manages its own query string state independently of the `value` prop (which is always passed as `""`). This means clearing one company's search from outside the component won't reset the text box. Workaround: unmount/remount the component, or add a `key` prop tied to the ticker.

---

## 8. How to Run

```bash
# Install dependencies
npm install

# (Optional) Add FMP API key for live data
cp .env.example .env
# Edit .env: VITE_FMP_API_KEY=your_key_here

# Start dev server
npm run dev
# → http://localhost:5173

# Type-check
npx tsc --noEmit

# Production build
npm run build
```

**Quick demo** (no API key needed): go to `/calculator`, search "Microsoft" → select MSFT, search "NVIDIA" → select NVDA. The mock data loads instantly and the synergy result renders.

---

## 9. Branch

All code lives on: **`claude/plan-ma-dashboard-eTA6D`**

The `main` branch has only the original stub README.
