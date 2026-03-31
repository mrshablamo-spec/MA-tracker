# M&A Analyst Dashboard

A professional M&A deal-tracking and synergy analysis tool built for the investment banking analyst portfolio. Tracks Mergers & Acquisitions in **AI Startups** and **Green Tech** niches, with a flagship **Synergy Calculator** powered by a simplified DCF model.

## Features

### Deal Tracker Dashboard
- 20+ curated real-world M&A deals (2021–2025) across AI Startups and Green Tech
- Sortable, filterable deal table with acquirer, target, deal value, acquisition premium, and status
- Niche filter (All / AI Startups / Green Tech)
- Deal volume over time (area chart) and volume by sector (bar chart)
- KPI strip: total deal volume, average premium, largest deal, completed count

### Synergy Calculator
The core feature — input two public companies and get a DCF-based merger verdict:

- **Company search** with autocomplete (live FMP API or built-in demo data)
- **Company profile cards** showing key financials (revenue, EBITDA, FCF, net debt, P/E)
- **Editable assumptions**: WACC, revenue synergy %, cost synergy %, integration cost, terminal growth rate, projection years
- **Verdict card**: color-coded "MERGER MAKES FINANCIAL SENSE / MARGINALLY ACCRETIVE / NOT RECOMMENDED"
- **Key metrics**: NPV of synergies, combined EV, implied premium justified, accretion/dilution
- **DCF breakdown table**: year-by-year FCF, discount factors, PV — mirrors real IB model output
- **Charts**: FCF projection (combined vs. standalone) + synergy value bridge (waterfall)
- **Financial glossary tooltips**: hover `?` on any term (WACC, DCF, FCF, EV, EBITDA, etc.)

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (dark Bloomberg-terminal aesthetic) |
| Charts | Recharts |
| State | Zustand |
| Data fetching | TanStack Query (React Query) |
| Financial data | Financial Modeling Prep API + static mock fallback |

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. (Optional) Add a Financial Modeling Prep API key
```bash
cp .env.example .env
# Edit .env and set VITE_FMP_API_KEY=your_key_here
```
Get a free key at [financialmodelingprep.com](https://financialmodelingprep.com/developer/docs/) (250 req/day).

Without a key the app uses built-in mock data for 6 demo tickers (MSFT, GOOGL, NVDA, ENPH, NEE, BE) — shown with a "Demo" badge.

### 3. Start dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 4. Build for production
```bash
npm run build
```

## DCF Synergy Model

The calculator uses a simplified 2-stage DCF model:

1. **Standalone DCF** for each company: base FCF → 5-year projection (blended growth rate) → Gordon Growth terminal value → discount at WACC
2. **Synergy cash flows**: revenue synergies (combined rev × synergy%) + cost synergies (combined opex × synergy%) with a ramp schedule (25% → 65% → 85% → 100% → 100%)
3. **Combined entity DCF**: standalone A + standalone B + net synergies, discounted to NPV
4. **Verdict**: if `NPV_synergies > 0 AND implied premium > 5%` → green; if marginally positive → amber; else → red
5. **Accretion/Dilution**: pro-forma EPS delta post-merger

## Demo Tickers (no API key needed)

| Ticker | Company | Niche |
|---|---|---|
| MSFT | Microsoft | AI Startups |
| GOOGL | Alphabet | AI Startups |
| NVDA | NVIDIA | AI Startups |
| ENPH | Enphase Energy | Green Tech |
| NEE | NextEra Energy | Green Tech |
| BE | Bloom Energy | Green Tech |

Try **MSFT + NVDA** or **ENPH + NEE** for a quick demo.

## Deploy

Deploy to Vercel in one click — zero configuration required for Vite projects. Add `VITE_FMP_API_KEY` as an environment variable in the Vercel dashboard.
