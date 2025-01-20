import { CategoryEnum, CurrencyEnum, MonthNameEnum, MonthNumberEnum, SurfaceEnum } from "./enums";

export const NAVIGATION_LINKS = [
	{ icon: "i-ic-round-home", label: "Home", to: "/" },
	{icon: 'i-material-symbols-calendar-today-rounded', label: 'Upcoming Tournaments', to: '/upcoming'},
	{ icon: "i-material-symbols-calendar-today-rounded", label: "Results Archive", to: "/archive" },
	{ icon: "i-material-symbols-swords-rounded", label: "Head to Head", to: "/h2h" },
	{ icon: "i-ph-magnifying-glass-duotone", label: "Search", to: "/search" },
	{ icon: "i-material-symbols-info-outline-rounded", label: "About", to: "/about" }
];

export const RELATED_LINKS = [
	{ label: "ATP", to: "https://www.atptour.com/en" },
	{ label: "ITF", to: "https://www.itftennis.com/en/" },
	{ label: "Australian Open", to: "https://ausopen.com/" },
	{ label: "Roland Garros", to: "https://www.rolandgarros.com/en-us" },
	{ label: "Wimbledon", to: "https://www.wimbledon.com/" },
	{ label: "US Open", to: "https://www.usopen.org/" }
];

export const CURRENCIES: Record<CurrencyEnum, string> = {
	[CurrencyEnum.USD]: "US$",
	[CurrencyEnum.AUD]: "A$",
	[CurrencyEnum.EUR]: "€",
	[CurrencyEnum.GBP]: "£"
};

export const EVENT_PAGES = [
	{ label: "Details", name: "event", icon: "i-ix-item-details", to: "overview" },
	{ label: "Results", name: "results", icon: "i-clarity-view-cards-line", to: "results" },
	{ label: "Draw", name: "draw", icon: "i-icon-park-twotone-tree-diagram", to: "draw" }
];

export const PLAYER_PAGES = [
	{ label: "Details", name: "player", to: "overview", icon: "i-material-symbols-account-circle" },
	{ label: "Activity", name: "activity", to: "activity", icon: "i-material-symbols-calendar-today-rounded" },
	{ label: "Titles and Finals", name: "titles", to: "titles-and-finals", icon: "i-pepicons-print-trophy-circle" },
	{ label: "Win-Loss Index", name: "wl-index", to: "wl-index", icon: "i-ic-baseline-auto-graph" },
	{ label: "Stats", name: "stats", to: "stats", icon: "i-solar-chart-2-bold-duotone" }
];

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

export const FILTERED_SURFACES = [SurfaceEnum.Clay, SurfaceEnum.Grass, SurfaceEnum.Hard, SurfaceEnum.Carpet]

export const CATEGORIES = [CategoryEnum["ATP 250"], CategoryEnum["ATP 500"], CategoryEnum["ATP Masters 1000"], CategoryEnum["Grand Slam"], CategoryEnum["ATP Finals"], CategoryEnum["ATP Cup"], CategoryEnum.ILTF, CategoryEnum.ITF, CategoryEnum["Laver Cup"], CategoryEnum["Next Gen Finals"], CategoryEnum.NTL, CategoryEnum.Olympics, CategoryEnum.United, CategoryEnum["Davis Cup"], CategoryEnum["Grand Prix"]];

export const FILTERED_CATEGORIES = [ CategoryEnum["ATP 250"], CategoryEnum["ATP 500"], CategoryEnum["ATP Masters 1000"], CategoryEnum["Grand Slam"], CategoryEnum["ATP Finals"], CategoryEnum["Laver Cup"], CategoryEnum["Next Gen Finals"] ]

export const MONTH_NAMES = [MonthNameEnum.January, MonthNameEnum.February, MonthNameEnum.March, MonthNameEnum.April, MonthNameEnum.May, MonthNameEnum.June, MonthNameEnum.July, MonthNameEnum.August, MonthNameEnum.September, MonthNameEnum.October, MonthNameEnum.November, MonthNameEnum.December]

export const MONTHS: Record<MonthNameEnum, MonthNumberEnum> = {
  [MonthNameEnum.January]: MonthNumberEnum.January,
  [MonthNameEnum.February]: MonthNumberEnum.February,
  [MonthNameEnum.March]: MonthNumberEnum.March,
  [MonthNameEnum.April]: MonthNumberEnum.April,
  [MonthNameEnum.May]: MonthNumberEnum.May,
  [MonthNameEnum.June]: MonthNumberEnum.June,
  [MonthNameEnum.July]: MonthNumberEnum.July,
  [MonthNameEnum.August]: MonthNumberEnum.August,
  [MonthNameEnum.September]: MonthNumberEnum.September,
  [MonthNameEnum.October]: MonthNumberEnum.October,
  [MonthNameEnum.November]: MonthNumberEnum.November,
  [MonthNameEnum.December]: MonthNumberEnum.December
}
