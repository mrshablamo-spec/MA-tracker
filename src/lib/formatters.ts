export function formatCurrency(billions: number, decimals = 1): string {
  if (Math.abs(billions) >= 1000) {
    return `$${(billions / 1000).toFixed(decimals)}T`
  }
  if (Math.abs(billions) >= 1) {
    return `$${billions.toFixed(decimals)}B`
  }
  return `$${(billions * 1000).toFixed(0)}M`
}

export function formatPercent(decimal: number, decimals = 1): string {
  return `${(decimal * 100).toFixed(decimals)}%`
}

export function formatMultiple(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}x`
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatBillions(value: number): string {
  return `$${formatNumber(value, 1)}B`
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDelta(decimal: number): string {
  const sign = decimal >= 0 ? '+' : ''
  return `${sign}${(decimal * 100).toFixed(1)}%`
}
