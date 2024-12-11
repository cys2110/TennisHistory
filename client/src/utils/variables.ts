import { Category, Currency, EntryInfo, Incomplete, Months, StatusInfo, Surface } from './types'

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

export const CATEGORIES = {
  [Category.GS]: 'Grand Slam',
  [Category.ATP1000]: 'ATP Masters 1000',
  [Category.ATP500]: 'ATP 500',
  [Category.ATP250]: 'ATP 250',
  [Category.ATPCup]: 'ATP Cup',
  [Category.Davis]: 'Davis Cup',
  [Category.Finals]: 'ATP Finals',
  [Category.Olympics]: 'Olympics',
  [Category.ILTF]: 'ILTF',
  [Category.NTL]: 'NTL',
  [Category.Laver]: 'Laver Cup',
  [Category.ITF]: 'ITF',
  [Category.United]: 'United',
  [Category.NextGen]: 'Next Gen Finals',
  [Category.GP]: 'Grand Prix',
}

export const MONTHS = {
  [Months.Jan]: 'January',
  [Months.Feb]: 'February',
  [Months.Mar]: 'March',
  [Months.Apr]: 'April',
  [Months.May]: 'May',
  [Months.Jun]: 'June',
  [Months.Jul]: 'July',
  [Months.Aug]: 'August',
  [Months.Sep]: 'September',
  [Months.Oct]: 'October',
  [Months.Nov]: 'November',
  [Months.Dec]: 'December',
}

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

export const NORMAL_DRAW = ['Round of 128', 'Round of 64', 'Round of 32']

export const SHORT_ROUNDS = {
  Final: 'F',
  Semifinals: 'SF',
  Quarterfinals: 'QF',
  'Round of 16': 'R16',
  'Round of 32': 'R32',
  'Round of 64': 'R64',
  'Round of 128': 'R128',
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
  red600: '#dc2626',
  green800: '#166534',
  green600: '#16a34a',
  sky600: '#0284c7',
  fuchsia600: '#c026d3',
  violet400: '#c084fc',
  violet600: '#7c3aed',
  violet700: '#6d28d9',
  violet800: '#5b21b6',
  zinc300: '#d4d4d8',
  zinc400: '#a1a1aa',
}

export const CHART_OPTIONS = {
  darkMode: true,
  backgroundColor: 'transparent',
  textStyle: { color: COLOURS.zinc400, fontSize: 14 },
}

export const breakpoints = {
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  xl: '(min-width: 1025px)',
}
