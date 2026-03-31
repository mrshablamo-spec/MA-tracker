import { AlertTriangle } from 'lucide-react'

interface ErrorBannerProps {
  message: string
  onUseDemoData?: () => void
}

export function ErrorBanner({ message, onUseDemoData }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
      <div className="flex-1">
        <p className="text-red-300">{message}</p>
        {onUseDemoData && (
          <button
            onClick={onUseDemoData}
            className="mt-1 text-xs font-medium text-red-400 underline underline-offset-2 hover:text-red-300"
          >
            Use Demo Data instead
          </button>
        )}
      </div>
    </div>
  )
}
