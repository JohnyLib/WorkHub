import { COUNTRY_CONFIG } from '@/lib/constants/countries'
import type { Country } from '@/types'

export function CountryBadge({ country }: { country: Country }) {
  const config = COUNTRY_CONFIG[country]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
      <span>{config.flag}</span>
      <span>{config.name}</span>
    </span>
  )
}
