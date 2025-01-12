import { Categories, MonthNames, MonthNumbers, Surfaces } from "@/types/enums"

export const NAVIGATION_LINKS = [
  { faIcon: ['fad', 'house'], label: 'Home', to: '/' },
  { faIcon: ['fad', 'calendar'], label: 'Results Archive', to: '/archive' },
  { faIcon: ['fad', 'swords'], label: 'Head to Head', to: '/h2h' },
  { faIcon: ['fad', 'magnifying-glass'], label: 'Search', to: '/search' },
  { faIcon: ['fad', 'circle-info'], label: 'About', to: '/about' },
]

export const RELATED_LINKS = [
  { label: 'ATP', url: 'https://www.atptour.com/en' },
  { label: 'ITF', url: 'https://www.itftennis.com/en/' },
  { label: 'Australian Open', url: 'https://ausopen.com/' },
  { label: 'Roland Garros', url: 'https://www.rolandgarros.com/en-us' },
  { label: 'Wimbledon', url: 'https://www.wimbledon.com/' },
  { label: 'US Open', url: 'https://www.usopen.org/' },
]

export const FILTERED_CATEGORIES = [ Categories["ATP 250"], Categories["ATP 500"], Categories["ATP Masters 1000"], Categories["Grand Slam"], Categories["ATP Finals"], Categories["Laver Cup"], Categories["Next Gen Finals"] ]

export const FILTERED_SURFACES = [Surfaces.Clay, Surfaces.Grass, Surfaces.Hard]

// export const CATEGORIES = ["ATP 250", "ATP 500", "ATP Masters 1000", "Grand Slam", "ATP Finals", "ATP Cup", "ILTF", "ITF", "Laver Cup", "Next Gen Finals", "NTL", "Olympics", "United", "Davis Cup", "Grand Prix"];

export const MONTH_NAMES = [MonthNames.January, MonthNames.February, MonthNames.March, MonthNames.April, MonthNames.May, MonthNames.June, MonthNames.July, MonthNames.August, MonthNames.September, MonthNames.October, MonthNames.November, MonthNames.December]

export const MONTHS: Record<MonthNames, MonthNumbers> = {
  [MonthNames.January]: MonthNumbers.January,
  [MonthNames.February]: MonthNumbers.February,
  [MonthNames.March]: MonthNumbers.March,
  [MonthNames.April]: MonthNumbers.April,
  [MonthNames.May]: MonthNumbers.May,
  [MonthNames.June]: MonthNumbers.June,
  [MonthNames.July]: MonthNumbers.July,
  [MonthNames.August]: MonthNumbers.August,
  [MonthNames.September]: MonthNumbers.September,
  [MonthNames.October]: MonthNumbers.October,
  [MonthNames.November]: MonthNumbers.November,
  [MonthNames.December]: MonthNumbers.December
}

// export const CURRENCIES: Record<CurrencyType, string> = {
// 	[CurrencyType.USD]: "US$",
// 	[CurrencyType.AUD]: "A$",
// 	[CurrencyType.EUR]: "€",
// 	[CurrencyType.GBP]: "£"
// };

export const EVENT_PAGES = [
	{ title: "Details", name: "event", icon: ['fad', 'square-info'] },
	{ title: "Results", name: "results", icon: ['fad', 'grid-2'] },
	{ title: "Draw", name: "draw", icon: ['fad', 'chart-tree-map'] }
];

// export const PLAYER_PAGES = [
// 	{ title: "Details", name: "player", route: "", icon: "i-solar-user-circle-line-duotone" },
// 	{ title: "Activity", name: "activity", route: "activity", icon: "i-ph-calendar-dots-duotone" },
// 	{ title: "Titles and Finals", name: "titles", route: "titles-and-finals", icon: "i-ph-trophy-duotone" },
// 	{ title: "Win-Loss Index", name: "wl-index", route: "wl-index", icon: "i-solar-graph-new-bold-duotone" },
// 	{ title: "Stats", name: "stats", route: "stats", icon: "i-solar-chart-2-bold-duotone" }
// ];

// export const STATUS_INFO: Record<StatusType, string> = {
// 	[StatusType.LL]: "Lucky Loser",
// 	[StatusType.PR]: "Protected Ranking",
// 	[StatusType.WC]: "Wild Card",
// 	[StatusType.SE]: "Special Exemption",
// 	[StatusType.Q]: "Qualifier",
// 	[StatusType.Alt]: "Alternate"
// };

// export const SHORT_ROUNDS: Record<ShortRoundsType, string> = {
// 	[ShortRoundsType["Round of 128"]]: "R128",
// 	[ShortRoundsType["Round of 64"]]: "R64",
// 	[ShortRoundsType["Round of 32"]]: "R32",
// 	[ShortRoundsType["Round of 16"]]: "R16",
// 	[ShortRoundsType.Quarterfinals]: "QF",
// 	[ShortRoundsType.Semifinals]: "SF",
// 	[ShortRoundsType.Final]: "F"
// };
