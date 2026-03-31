import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { clsx } from 'clsx'
import { searchTickers, hasApiKey } from '@/lib/api'
import { mockTickerSearch } from '@/data/mockFinancials'

interface TickerSearchInputProps {
  value: string
  onSelect: (ticker: string) => void
  label: string
  placeholder?: string
}

interface SearchResult {
  symbol: string
  name: string
}

export function TickerSearchInput({
  value,
  onSelect,
  label,
  placeholder = 'Search company (e.g. Microsoft)…',
}: TickerSearchInputProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Debounced search
  useEffect(() => {
    clearTimeout(timer.current)
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = hasApiKey()
          ? await searchTickers(query)
          : mockTickerSearch.filter(
              r =>
                r.name.toLowerCase().includes(query.toLowerCase()) ||
                r.symbol.toLowerCase().includes(query.toLowerCase()),
            )
        setResults(res.slice(0, 8))
        setOpen(true)
      } catch {
        // Fall back to mock search on error
        const filtered = mockTickerSearch.filter(
          r =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.symbol.toLowerCase().includes(query.toLowerCase()),
        )
        setResults(filtered)
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [query])

  const handleSelect = (symbol: string, name: string) => {
    setQuery(name)
    setOpen(false)
    onSelect(symbol)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setOpen(false)
    onSelect('')
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-8 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
        />
        {(query || loading) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 text-slate-500 hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-xl">
          {results.map(r => (
            <li key={r.symbol}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-slate-700 transition-colors"
                onClick={() => handleSelect(r.symbol, r.name)}
              >
                <span className="text-slate-200">{r.name}</span>
                <span className={clsx(
                  'ml-3 shrink-0 rounded bg-slate-900 px-1.5 py-0.5 text-xs font-mono font-medium',
                  'text-emerald-400',
                )}>
                  {r.symbol}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
