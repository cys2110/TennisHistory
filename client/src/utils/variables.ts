export const NAVIGATION_LINKS = [
  { icon: ['fad', 'house'], label: 'Home', to: '/' },
  { icon: ['fad', 'calendar'], label: 'Results Archive', to: '/archive' },
  { icon: ['fad', 'swords'], label: 'Head to Head', to: '/h2h' },
  { icon: ['fad', 'magnifying-glass'], label: 'Search', to: '/search' },
  { icon: ['fad', 'circle-info'], label: 'About', to: '/about' },
]

export const RELATED_LINKS = [
  { name: 'ATP', url: 'https://www.atptour.com/en' },
  { name: 'ITF', url: 'https://www.itftennis.com/en/' },
  { name: 'Australian Open', url: 'https://ausopen.com/' },
  { name: 'Roland Garros', url: 'https://www.rolandgarros.com/en-us' },
  { name: 'Wimbledon', url: 'https://www.wimbledon.com/' },
  { name: 'US Open', url: 'https://www.usopen.org/' },
]

export const CATEGORIES = ['ATP 250', 'ATP 500', 'ATP Masters 1000', 'Grand Slam', 'ATP Finals', 'ATP Cup', 'ILTF', 'ITF', 'Laver Cup', 'Next Gen Finals', 'NTL', 'Olympics', 'United', 'Davis Cup', 'Grand Prix']

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const SURFACES = ['Clay', 'Grass', 'Hard', 'Carpet']

export const CURRENCIES: Record<CurrencyType, string> = {
  [CurrencyType.USD]: 'US$',
  [CurrencyType.AUD]: 'A$',
  [CurrencyType.EUR]: '€',
  [CurrencyType.GBP]: '£',
}

export const EVENT_PAGES = [
  { title: 'Details', name: 'event', icon: ['fad', 'memo-pad'] },
  { title: 'Results', name: 'results', icon: ['fad', 'grid-2'] },
  { title: 'Draw', name: 'draw', icon: ['fad', 'chart-tree-map'] },
]

export const PLAYER_PAGES = [
  { title: 'Details', name: 'player', icon: ['fad', 'circle-user'] },
  { title: 'Activity', name: 'activity', icon: ['fad', 'calendar'] },
  { title: 'Titles and Finals', name: 'titles', icon: ['fad', 'trophy'] },
  { title: 'Win-Loss Index', name: 'wl-index', icon: ['fad', 'chart-line'] },
  { title: 'Stats', name: 'stats', icon: ['fad', 'chart-simple-horizontal'] },
]

export const STATUS_INFO: Record<StatusType, string> = {
  [StatusType.LL]: 'Lucky Loser',
  [StatusType.PR]: 'Protected Ranking',
  [StatusType.WC]: 'Wild Card',
  [StatusType.SE]: 'Special Exemption',
  [StatusType.Q]: 'Qualifier',
  [StatusType.Alt]: 'Alternate',
}

export const SHORT_ROUNDS: Record<ShortRoundsType, string> = {
  [ShortRoundsType['Round of 128']]: 'R128',
  [ShortRoundsType['Round of 64']]: 'R64',
  [ShortRoundsType['Round of 32']]: 'R32',
  [ShortRoundsType['Round of 16']]: 'R16',
  [ShortRoundsType.Quarterfinals]: 'QF',
  [ShortRoundsType.Semifinals]: 'SF',
  [ShortRoundsType.Final]: 'F',
}
