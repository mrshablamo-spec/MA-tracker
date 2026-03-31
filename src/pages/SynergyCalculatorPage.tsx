import { useState } from 'react'
import { Calculator } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { TickerSearchInput } from '@/components/synergy/TickerSearchInput'
import { CompanyProfileCard } from '@/components/synergy/CompanyProfileCard'
import { AssumptionsPanel } from '@/components/synergy/AssumptionsPanel'
import { SynergyResultCard } from '@/components/synergy/SynergyResultCard'
import { CashFlowProjectionChart } from '@/components/synergy/CashFlowProjectionChart'
import { SynergyWaterfallChart } from '@/components/synergy/SynergyWaterfallChart'
import { DCFBreakdownTable } from '@/components/synergy/DCFBreakdownTable'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { SpinnerIcon } from '@/components/ui/LoadingSpinner'
import { useCompanyFinancials } from '@/hooks/useCompanyFinancials'
import { useSynergyScore } from '@/hooks/useSynergyScore'
import { DEFAULT_ASSUMPTIONS } from '@/lib/constants'
import type { SynergyAssumptions } from '@/types/dcf'

export function SynergyCalculatorPage() {
  const [tickerA, setTickerA] = useState<string | null>(null)
  const [tickerB, setTickerB] = useState<string | null>(null)
  const [assumptions, setAssumptions] = useState<SynergyAssumptions>(DEFAULT_ASSUMPTIONS)

  const queryA = useCompanyFinancials(tickerA)
  const queryB = useCompanyFinancials(tickerB)

  const result = useSynergyScore(queryA.data, queryB.data, assumptions)

  const bothLoaded = queryA.data && queryB.data
  const anyLoading = queryA.isLoading || queryB.isLoading

  return (
    <PageWrapper
      title="Synergy Calculator"
      subtitle="Input two public companies to estimate whether a merger makes financial sense using a simplified DCF model"
    >
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* ── Left: Inputs ── */}
        <div className="space-y-5">
          <div className="space-y-3">
            <TickerSearchInput
              value=""
              onSelect={t => setTickerA(t || null)}
              label="Company A (Acquirer)"
              placeholder="Search company or ticker…"
            />
            {queryA.isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <SpinnerIcon className="h-3.5 w-3.5 text-emerald-400" />
                Loading financials…
              </div>
            )}
            {queryA.error && (
              <ErrorBanner message={queryA.error.message} />
            )}
            {queryA.data && (
              <CompanyProfileCard profile={queryA.data} />
            )}
          </div>

          <div className="space-y-3">
            <TickerSearchInput
              value=""
              onSelect={t => setTickerB(t || null)}
              label="Company B (Target)"
              placeholder="Search company or ticker…"
            />
            {queryB.isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <SpinnerIcon className="h-3.5 w-3.5 text-emerald-400" />
                Loading financials…
              </div>
            )}
            {queryB.error && (
              <ErrorBanner message={queryB.error.message} />
            )}
            {queryB.data && (
              <CompanyProfileCard profile={queryB.data} />
            )}
          </div>

          <AssumptionsPanel assumptions={assumptions} onChange={setAssumptions} />
        </div>

        {/* ── Right: Results ── */}
        <div className="space-y-5">
          {!bothLoaded && !anyLoading && (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 text-center">
              <Calculator className="h-10 w-10 text-slate-600" />
              <p className="mt-3 text-sm font-medium text-slate-400">
                Select two companies to run the analysis
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Try MSFT + NVDA for a quick demo (no API key required)
              </p>
            </div>
          )}

          {anyLoading && (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900">
              <SpinnerIcon className="h-8 w-8 text-emerald-400" />
              <p className="text-sm text-slate-400">Fetching financial data…</p>
            </div>
          )}

          {result && !anyLoading && (
            <>
              <SynergyResultCard result={result} />

              <CashFlowProjectionChart
                combinedFCF={result.combinedFCFByYear}
                companyAFCF={result.companyAFCFByYear}
                companyBFCF={result.companyBFCFByYear}
                companyAName={queryA.data?.ticker ?? 'Co. A'}
                companyBName={queryB.data?.ticker ?? 'Co. B'}
              />

              <SynergyWaterfallChart
                result={result}
                companyAName={queryA.data?.ticker ?? 'Co. A'}
                companyBName={queryB.data?.ticker ?? 'Co. B'}
              />

              <DCFBreakdownTable
                rows={result.dcfBreakdown}
                terminalValue={
                  (() => {
                    const lastFCF = result.combinedFCFByYear[result.combinedFCFByYear.length - 1]
                    return (lastFCF * (1 + assumptions.terminalGrowthRate)) /
                      (assumptions.wacc - assumptions.terminalGrowthRate)
                  })()
                }
                pvTerminalValue={
                  (() => {
                    const lastFCF = result.combinedFCFByYear[result.combinedFCFByYear.length - 1]
                    const tv = (lastFCF * (1 + assumptions.terminalGrowthRate)) /
                      (assumptions.wacc - assumptions.terminalGrowthRate)
                    return tv / Math.pow(1 + assumptions.wacc, assumptions.projectionYears)
                  })()
                }
                enterpriseValue={result.combinedEV}
              />
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
