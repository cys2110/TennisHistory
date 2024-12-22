import { $dt } from '@primevue/themes'
import {
  Category,
  Currency,
  EntryInfo,
  Incomplete,
  Months,
  ShortRound,
  StatusInfo,
  Surface,
} from './types'

export const SURFACES = {
  [Surface.IndoorCarpet]: 'Indoor Carpet',
  [Surface.IndoorClay]: 'Indoor Clay',
  [Surface.IndoorHard]: 'Indoor Hard',
  [Surface.IndoorHardAcrylic]: 'Indoor Hard (Acrylic)',
  [Surface.IndoorHardDecoturf]: 'Indoor Hard (Decoturf)',
  [Surface.IndoorHardGerflor]: 'Indoor Hard (Gerflor)',
  [Surface.IndoorHardGreenset]: 'Indoor Hard (Greenset)',
  [Surface.IndoorHardLaykold]: 'Indoor Hard (Laykold)',
  [Surface.IndoorHardPlexicushion]: 'Indoor Hard (Plexicushion)',
  [Surface.IndoorHardPlexipave]: 'Indoor Hard (Plexipave)',
  [Surface.IndoorHardPremier]: 'Indoor Hard (Premier)',
  [Surface.IndoorHardProflex]: 'Indoor Hard (Proflex)',
  [Surface.IndoorHardReboundace]: 'Indoor Hard (Rebound ace)',
  [Surface.IndoorHardSlamcourt]: 'Indoor Hard (Slamcourt)',
  [Surface.IndoorHardTPSurface]: 'Indoor Hard (TP Surface)',
  [Surface.OutdoorClay]: 'Outdoor Clay',
  [Surface.OutdoorGrass]: 'Outdoor Grass',
  [Surface.OutdoorHard]: 'Outdoor Hard',
  [Surface.OutdoorHardCourtMaster]: 'Outdoor Hard (Court Master)',
  [Surface.OutdoorHardDecoturf]: 'Outdoor Hard (Decoturf)',
  [Surface.OutdoorHardGreenset]: 'Outdoor Hard (Greenset)',
  [Surface.OutdoorHardHarTru]: 'Outdoor Hard (Har-Tru)',
  [Surface.OutdoorHardLaykold]: 'Outdoor Hard (Laykold)',
  [Surface.OutdoorHardPlaypave]: 'Outdoor Hard (Play pave)',
  [Surface.OutdoorHardPlexicushion]: 'Outdoor Hard (Plexicushion)',
  [Surface.OutdoorHardPlexipave]: 'Outdoor Hard (Plexipave)',
  [Surface.OutdoorHardReboundace]: 'Outdoor Hard (Rebound ace)',
  [Surface.OutdoorHardSolflex]: 'Outdoor Hard (Solflex)',
  [Surface.OutdoorHardSportMaster]: 'Outdoor Hard (Sport Master)',
  [Surface.Various]: 'Various',
}

export const CATEGORIES = [
  Category.GS,
  Category.ATP1000,
  Category.ATP500,
  Category.ATP250,
  Category.ATPCup,
  Category.Davis,
  Category.Finals,
  Category.Olympics,
  Category.ILTF,
  Category.NTL,
  Category.Laver,
  Category.ITF,
  Category.United,
  Category.NextGen,
  Category.GP,
]

export const MONTHS = [
  Months.Jan,
  Months.Feb,
  Months.Mar,
  Months.Apr,
  Months.May,
  Months.Jun,
  Months.Jul,
  Months.Aug,
  Months.Sep,
  Months.Oct,
  Months.Nov,
  Months.Dec,
]

export const INCOMPLETES = {
  [Incomplete.R]: 'Ret.',
  [Incomplete.WO]: 'Walkover',
  [Incomplete.B]: 'Bye',
}

export const CURRENCIES = {
  [Currency.USD]: 'US$',
  [Currency.AUD]: 'A$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
}

export const EVENT_PAGES = [
  { title: 'Details', name: 'event' },
  { title: 'Results', name: 'results' },
  { title: 'Draw', name: 'draw' },
]

export const NORMAL_DRAW = ['Round of 128', 'Round of 64', 'Round of 32']

export const SHORT_ROUNDS = {
  [ShortRound.F]: 'F',
  [ShortRound.SF]: 'SF',
  [ShortRound.QF]: 'QF',
  [ShortRound.R16]: 'R16',
  [ShortRound.R32]: 'R32',
  [ShortRound.R64]: 'R64',
  [ShortRound.R128]: 'R128',
  [ShortRound.RR]: 'RR',
}

export const ENTRY_INFO = {
  [EntryInfo.ldaConnection]: 'Last direct acceptance',
  [EntryInfo.llsConnection]: 'Lucky losers',
  [EntryInfo.altConnection]: 'Alternates',
  [EntryInfo.wdConnection]: 'Withdrawals',
  [EntryInfo.retConnection]: 'Retirements',
  [EntryInfo.woConnection]: 'Walkovers',
  [EntryInfo.defaultedConnection]: 'Defaults',
  [EntryInfo.wcConnection]: 'Wild cards',
  [EntryInfo.qualifiersConnection]: 'Qualifiers',
}

export const STATUS_INFO = {
  [StatusInfo.LL]: 'Lucky Loser',
  [StatusInfo.PR]: 'Protected Ranking',
  [StatusInfo.WC]: 'Wild Card',
  [StatusInfo.SE]: 'Special Exemption',
  [StatusInfo.Q]: 'Qualifier',
  [StatusInfo.Alt]: 'Alternate',
}

export const COLOURS = {
  green800: '#166534',
  green600: '#16a34a',
  violet700: '#6d28d9',
  zinc400: '#a1a1aa',
}

export const CHART_OPTIONS = {
  darkMode: true,
  backgroundColor: 'transparent',
  textStyle: { color: $dt('zinc.400').value, fontSize: 14 },
}

export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
}
