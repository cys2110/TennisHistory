import { CategoryEnum, CurrencyEnum, MonthNameEnum, MonthNumberEnum, RoundEnum, StatusEnum, SurfaceEnum } from "~/types/enums";

export const ICONS = {
    home: 'ic:round-home',
    calendar: 'solar:calendar-minimalistic-bold-duotone',
    "calendar-event": 'solar:calendar-mark-bold-duotone',
    "no-calendar": 'material-symbols:event-busy-rounded',
    swords: 'pepicons-pop:swords-circle-filled',
    "no-swords": 'pepicons-print:swords-off',
    search: 'ph:magnifying-glass-duotone',
    info: 'ph:info-duotone',
    "no-info": 'pepicons-pop:info-off',
    error: 'ic:baseline-report-gmailerrorred',
    loading: 'line-md:loading-twotone-loop',
    trophy: 'ph:trophy-duotone',
    "no-trophy": 'pepicons-pop:trophy-circle-off',
    details: 'ix:item-details',
    cards: 'clarity:view-cards-line',
    draw: 'material-symbols-light:flowchart-outline',
    court: 'game-icons:tennis-court',
    check: 'solar:check-circle-bold-duotone',
    website: 'ic:baseline-arrow-outward',
    person: 'material-symbols:account-circle-outline',
    "no-person": 'material-symbols:account-circle-off-outline-rounded',
    "line-scatter": 'ic:baseline-auto-graph',
    "bar-chart": 'solar:chart-2-bold-duotone',
    table: 'material-symbols-light:table-outline',
    "no-chart": 'material-symbols:bar-chart-off-rounded',
    cross: 'ph:x-circle-duotone',
    gauge: 'ph:gauge-duotone',
    scatter: 'ph:chart-scatter-duotone',
    "chevron-down": 'solar:round-alt-arrow-down-line-duotone'
}

export const NAVIGATION_LINKS = [
    { label: 'Home', to: '/', icon: ICONS.home },
    { label: 'Upcoming Tournaments', to: '/upcoming', icon: ICONS["calendar-event"] },
    { label: 'Results Archive', to: '/archive', icon: ICONS.calendar },
    { label: 'Tournaments', to: '/tournaments', icon: ICONS.trophy },
    { label: 'Head to Head', to: '/h2h', icon: ICONS.swords },
    { label: 'Search', to: '/search', icon: ICONS.search },
    { label: 'About', to: '/about', icon: ICONS.info }
]

export const RELATED_LINKS = [
    { label: "ATP", to: "https://www.atptour.com/en" },
	{ label: "ITF", to: "https://www.itftennis.com/en/" },
	{ label: "Australian Open", to: "https://ausopen.com/" },
	{ label: "Roland Garros", to: "https://www.rolandgarros.com/en-us" },
	{ label: "Wimbledon", to: "https://www.wimbledon.com/" },
	{ label: "US Open", to: "https://www.usopen.org/" }
]

export const SURFACES = [SurfaceEnum.Clay, SurfaceEnum.Grass, SurfaceEnum.Hard, SurfaceEnum.Carpet]

export const CATEGORIES = [CategoryEnum["ATP 250"], CategoryEnum["ATP 500"], CategoryEnum["ATP Masters 1000"], CategoryEnum["Grand Slam"], CategoryEnum["ATP Finals"], CategoryEnum["ATP Cup"], CategoryEnum.ILTF, CategoryEnum.ITF, CategoryEnum["Laver Cup"], CategoryEnum["Next Gen Finals"], CategoryEnum.NTL, CategoryEnum.Olympics, CategoryEnum.United, CategoryEnum["Davis Cup"], CategoryEnum["Grand Prix"]];

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

export const LETTERS = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export const EVENT_PAGES = [
    { label: "Details", name: "event", icon: ICONS.details, to: { name: 'event'} },
    { label: 'Results', name: 'results', icon: ICONS.cards, to: {name: 'results'} },
    { label: 'Draw', name: 'draw', icon: ICONS.draw, to: {name: 'draw'}}
]

export const PLAYER_PAGES = [
    { label: 'Details', name: 'player-overview', icon: ICONS.person, to: { name: 'player-overview'}, color: 'secondary', variant: 'subtle' },
    { label: 'Activity', name: 'activity', icon: ICONS.calendar, to: {name: 'activity'}, color: 'secondary', variant: 'subtle' },
    { label: 'Titles and Finals', name: 'titles', icon: ICONS.trophy, to: {name: 'titles'}, color: 'secondary', variant: 'subtle' },
    { label: 'Win-Loss Index', name: 'wl-index', icon: ICONS["line-scatter"], to: {name: 'wl-index'}, color: 'secondary', variant: 'subtle' },
    { label: 'Stats', name: 'stats', icon: ICONS["bar-chart"], to: {name: 'stats'}, color: 'secondary', variant: 'subtle' }
]

export const CURRENCIES: Record<CurrencyEnum, string> = {
	[CurrencyEnum.USD]: "US$",
	[CurrencyEnum.AUD]: "A$",
	[CurrencyEnum.EUR]: "€",
	[CurrencyEnum.GBP]: "£"
};

export const STATUS_INFO: Record<StatusEnum, string> = {
    [StatusEnum.Alt]: "Alternate",
    [StatusEnum.LL]: "Lucky Loser",
    [StatusEnum.PR]: "Protected Ranking",
    [StatusEnum.SE]: "Special Exempt",
    [StatusEnum.WC]: "Wild Card",
    [StatusEnum.Q]: "Qualifier"
}

export const SHORT_ROUNDS: Record<RoundEnum, string> = {
    [RoundEnum.Final]: "F",
    [RoundEnum.Semifinals]: "SF",
    [RoundEnum.Quarterfinals]: "QF",
    [RoundEnum["Round of 16"]]: "R16",
    [RoundEnum["Round of 32"]]: "R32",
    [RoundEnum["Round of 64"]]: "R64",
    [RoundEnum["Round of 128"]]: "R128",
}