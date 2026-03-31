interface PageWrapperProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  action?: React.ReactNode
}

export function PageWrapper({ title, subtitle, children, action }: PageWrapperProps) {
  return (
    <main className="mx-auto max-w-screen-xl px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </main>
  )
}
