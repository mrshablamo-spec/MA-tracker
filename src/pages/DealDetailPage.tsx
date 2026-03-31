import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Calculator } from 'lucide-react'
import { getDealById } from '@/data/deals'
import { Badge } from '@/components/ui/Badge'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { formatCurrency, formatPercent, formatDate } from '@/lib/formatters'

export function DealDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const deal = id ? getDealById(id) : undefined

  if (!deal) {
    return (
      <PageWrapper title="Deal Not Found">
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-slate-400">This deal could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      title={`${deal.acquirer} ↔ ${deal.target}`}
      subtitle={`${deal.sector} · ${deal.niche}`}
      action={<Badge status={deal.status} />}
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Deal Stats */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-6 space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400">Deal Overview</h2>
          <dl className="space-y-3">
            {[
              { label: 'Acquirer', value: `${deal.acquirer}${deal.acquirerTicker ? ` (${deal.acquirerTicker})` : ''}` },
              { label: 'Target', value: `${deal.target}${deal.targetTicker ? ` (${deal.targetTicker})` : ''}` },
              { label: 'Deal Value', value: formatCurrency(deal.dealValue) },
              { label: 'Acquisition Premium', value: deal.premium > 0 ? formatPercent(deal.premium, 0) : '—' },
              { label: 'Announced', value: formatDate(deal.date) },
              { label: 'Status', value: <Badge status={deal.status} /> },
              { label: 'Sector', value: deal.sector },
              { label: 'Niche', value: deal.niche },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                <dt className="text-sm text-slate-400 shrink-0">{label}</dt>
                <dd className="text-sm font-medium text-slate-200 text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Rationale + Tags */}
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-6">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-400">Deal Rationale</h2>
            <p className="text-sm leading-relaxed text-slate-300">{deal.rationale}</p>
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-6">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-400">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {deal.tags.map(tag => (
                <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA to Synergy Calculator */}
          {deal.acquirerTicker && deal.targetTicker && (
            <Link
              to={`/calculator`}
              className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 hover:bg-emerald-500/10 transition-colors"
            >
              <Calculator className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-400">Run Synergy Analysis</p>
                <p className="text-xs text-slate-400">
                  Open the DCF calculator and model {deal.acquirerTicker} + {deal.targetTicker}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-emerald-500/50 ml-auto" />
            </Link>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
