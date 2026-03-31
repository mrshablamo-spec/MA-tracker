import { Link, useLocation } from 'react-router-dom'
import { TrendingUp, Calculator, BarChart2 } from 'lucide-react'
import { clsx } from 'clsx'

const navLinks = [
  { to: '/', label: 'Dashboard', icon: BarChart2 },
  { to: '/calculator', label: 'Synergy Calculator', icon: Calculator },
]

export function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-8 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-100">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <span>M&amp;A Analyst</span>
          <span className="ml-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            BETA
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                pathname === to
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            AI &amp; Green Tech Focus
          </span>
        </div>
      </div>
    </header>
  )
}
