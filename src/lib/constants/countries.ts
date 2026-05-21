import type { Country } from '@/types'

export const COUNTRY_CONFIG = {
  uk: {
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    languages: ['ru', 'en'],
    defaultLang: 'en',
    docs: ['CSCS Card', 'UTR Number', 'NINO', 'DBS Check'],
    domain: 'uk.workbridge.com',
    flag: '🇬🇧',
  },
  ie: {
    name: 'Ireland',
    currency: 'EUR',
    symbol: '€',
    languages: ['ru', 'en', 'pl'],
    defaultLang: 'en',
    docs: ['Safe Pass', 'PPS Number', 'Manual Handling'],
    domain: 'ie.workbridge.com',
    flag: '🇮🇪',
  },
  de: {
    name: 'Germany',
    currency: 'EUR',
    symbol: '€',
    languages: ['ru', 'de'],
    defaultLang: 'de',
    docs: ['Aufenthaltstitel', 'A1 Certificate', 'Sozialversicherung'],
    domain: 'de.workbridge.com',
    flag: '🇩🇪',
  },
} as const satisfies Record<string, {
  name: string
  currency: string
  symbol: string
  languages: string[]
  defaultLang: string
  docs: string[]
  domain: string
  flag: string
}>

export type CountryKey = Country
