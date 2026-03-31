import { PageWrapper } from '@/components/layout/PageWrapper'
import { NicheFilter } from '@/components/dashboard/NicheFilter'
import { MarketPulseBar } from '@/components/dashboard/MarketPulseBar'
import { DealTable } from '@/components/dashboard/DealTable'
import { SectorChart } from '@/components/dashboard/SectorChart'
import { DealVolumeChart } from '@/components/dashboard/DealVolumeChart'

export function DashboardPage() {
  return (
    <PageWrapper
      title="M&A Deal Tracker"
      subtitle="AI Startups & Green Tech — sourced from public filings and financial press"
      action={<NicheFilter />}
    >
      {/* KPI strip */}
      <MarketPulseBar />

      {/* Charts row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DealVolumeChart />
        <SectorChart />
      </div>

      {/* Deal table */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-400">
          All Deals
        </h2>
        <DealTable />
      </div>
    </PageWrapper>
  )
}
