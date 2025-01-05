import { CurrencyType, ShortRoundsType, StatusType } from "~/types/enums";

export const NAVIGATION_LINKS = [
	{ icon: "ph:house-duotone", label: "Home", to: "/" },
	{ icon: "ph:calendar-dots-duotone", label: "Results Archive", to: "/archive" },
	{ icon: "material-symbols:swords-outline-rounded", label: "Head to Head", to: "/h2h" },
	{ icon: "ph:magnifying-glass-duotone", label: "Search", to: "/search" },
	{ icon: "material-symbols:info-outline-rounded", label: "About", to: "/about" }
];

export const RELATED_LINKS = [
	{ name: "ATP", url: "https://www.atptour.com/en" },
	{ name: "ITF", url: "https://www.itftennis.com/en/" },
	{ name: "Australian Open", url: "https://ausopen.com/" },
	{ name: "Roland Garros", url: "https://www.rolandgarros.com/en-us" },
	{ name: "Wimbledon", url: "https://www.wimbledon.com/" },
	{ name: "US Open", url: "https://www.usopen.org/" }
];

export const CATEGORIES = ["ATP 250", "ATP 500", "ATP Masters 1000", "Grand Slam", "ATP Finals", "ATP Cup", "ILTF", "ITF", "Laver Cup", "Next Gen Finals", "NTL", "Olympics", "United", "Davis Cup", "Grand Prix"];

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const CURRENCIES: Record<CurrencyType, string> = {
	[CurrencyType.USD]: "US$",
	[CurrencyType.AUD]: "A$",
	[CurrencyType.EUR]: "€",
	[CurrencyType.GBP]: "£"
};

export const EVENT_PAGES = [
	{ title: "Details", name: "event", icon: "i-ix-item-details", route: "" },
	{ title: "Results", name: "results", icon: "i-clarity-view-cards-line", route: "results" },
	{ title: "Draw", name: "draw", icon: "i-icon-park-twotone-tree-diagram", route: "draw" }
];

export const PLAYER_PAGES = [
	{ title: "Details", name: "player", route: "", icon: "i-solar-user-circle-line-duotone" },
	{ title: "Activity", name: "activity", route: "activity", icon: "i-ph-calendar-dots-duotone" },
	{ title: "Titles and Finals", name: "titles", route: "titles-and-finals", icon: "i-ph-trophy-duotone" },
	{ title: "Win-Loss Index", name: "wl-index", route: "wl-index", icon: "i-solar-graph-new-bold-duotone" },
	{ title: "Stats", name: "stats", route: "stats", icon: "i-solar-chart-2-bold-duotone" }
];

export const STATUS_INFO: Record<StatusType, string> = {
	[StatusType.LL]: "Lucky Loser",
	[StatusType.PR]: "Protected Ranking",
	[StatusType.WC]: "Wild Card",
	[StatusType.SE]: "Special Exemption",
	[StatusType.Q]: "Qualifier",
	[StatusType.Alt]: "Alternate"
};

export const SHORT_ROUNDS: Record<ShortRoundsType, string> = {
	[ShortRoundsType["Round of 128"]]: "R128",
	[ShortRoundsType["Round of 64"]]: "R64",
	[ShortRoundsType["Round of 32"]]: "R32",
	[ShortRoundsType["Round of 16"]]: "R16",
	[ShortRoundsType.Quarterfinals]: "QF",
	[ShortRoundsType.Semifinals]: "SF",
	[ShortRoundsType.Final]: "F"
};
