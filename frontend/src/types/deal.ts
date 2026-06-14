export type DealStage =
  | 'discovery'
  | 'qualification'
  | 'demo'
  | 'proposal'
  | 'negotiation'
  | 'closed-won'
  | 'closed-lost'

export interface Deal {
  id: string
  title: string
  company: string
  contact: string
  stage: DealStage
  value: number
  probability: number
  closeDate: string
  created: string
  tags: string[]
  notes: string
}

export const STAGES: { key: DealStage; label: string }[] = [
  { key: 'discovery',     label: 'Discovery' },
  { key: 'qualification', label: 'Qualification' },
  { key: 'demo',          label: 'Demo' },
  { key: 'proposal',      label: 'Proposal' },
  { key: 'negotiation',   label: 'Negotiation' },
  { key: 'closed-won',    label: 'Closed Won' },
  { key: 'closed-lost',   label: 'Closed Lost' },
]

export const STAGE_COLORS: Record<DealStage, { bg: string; text: string; pill: string }> = {
  'discovery':     { bg: 'bg-gray-50',    text: 'text-gray-600',   pill: 'bg-gray-100 text-gray-700' },
  'qualification': { bg: 'bg-blue-50',    text: 'text-blue-600',   pill: 'bg-blue-100 text-blue-700' },
  'demo':          { bg: 'bg-indigo-50',  text: 'text-indigo-600', pill: 'bg-indigo-100 text-indigo-700' },
  'proposal':      { bg: 'bg-purple-50',  text: 'text-purple-600', pill: 'bg-purple-100 text-purple-700' },
  'negotiation':   { bg: 'bg-amber-50',   text: 'text-amber-600',  pill: 'bg-amber-100 text-amber-700' },
  'closed-won':    { bg: 'bg-green-50',   text: 'text-green-600',  pill: 'bg-green-100 text-green-700' },
  'closed-lost':   { bg: 'bg-red-50',     text: 'text-red-600',    pill: 'bg-red-100 text-red-700' },
}
