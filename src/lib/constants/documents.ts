import type { Country } from '@/types'

export const REQUIRED_DOCS: Record<Country, string[]> = {
  uk: ['CSCS Card', 'UTR Number', 'NINO', 'DBS Check', 'Passport / ID', 'Right to Work', 'NDA'],
  ie: ['Safe Pass', 'PPS Number', 'Manual Handling', 'Passport / ID', 'Work Permit'],
  de: ['Aufenthaltstitel', 'A1 Certificate', 'Sozialversicherungsausweis', 'Passport / ID', 'Qualification Cert'],
}

export const PPE_ITEMS = [
  'Hard Hat',
  'Hi-Vis Vest',
  'Safety Boots',
  'Gloves',
  'Safety Glasses',
  'Ear Protection',
  'Dust Mask / FFP2',
  'Harness / Lanyard',
  'Knee Pads',
]
