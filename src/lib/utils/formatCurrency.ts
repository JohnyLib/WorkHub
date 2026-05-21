import type { Country } from '@/types'
import { COUNTRY_CONFIG } from '@/lib/constants/countries'

export function formatCurrency(amount: number | null, country: Country = 'uk'): string {
  if (amount === null) return 'Negotiable'
  const { symbol, currency } = COUNTRY_CONFIG[country]
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(currency, symbol)
}

export function formatPayRate(
  rate: number | null,
  payType: string | null,
  country: Country = 'uk'
): string {
  if (!rate || !payType) return 'Negotiable'
  const amount = formatCurrency(rate, country)
  const suffix = payType === 'day' ? '/day' : payType === 'hour' ? '/hr' : payType === 'sqm' ? '/m²' : ''
  return `${amount}${suffix}`
}
