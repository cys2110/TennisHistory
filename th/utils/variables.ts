export const BASE_CATEGORIES = Object.values(BaseCategoryEnum)

export const CATEGORIES = Object.values(CategoryEnum)

export const CHART_COLOURS = {
  lightText: "#475569",
  darkText: "#cbd5e1",
  emerald700: "#047857",
  violet700: "#6d28d9",
  fuchsia600: "#c026d3",
  sky700: "#0284c7",
  orange600: "#f97316"
}

export const CURRENCIES: Record<CurrencyType, string> = {
  AUD: "A$",
  EUR: "€",
  GBP: "£",
  USD: "US$"
}

export const EVENT_PAGES = [
  { label: "Overview", name: "event", icon: ICONS.overview },
  { label: "Overview", name: "country-event", icon: ICONS.overview },
  { label: "Results", name: "results", icon: ICONS.cards },
  { label: "Draw", name: "draw", icon: ICONS.draw },
  { label: "Draw", name: "country-draw", icon: ICONS.draw },
  { label: "Draw", name: "rr-draw", icon: ICONS.draw },
  { label: "Draw", name: "laver-cup-draw", icon: ICONS.draw }
]

export const LETTERS = ["All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

export const MATCH_STATS = {
  service: [
    { key: "aces", label: "Aces" },
    { key: "dfs", label: "Double faults" },
    { label: "First serve", percent: true },
    { key: "serve1", label: "1st serve points won", percent: true },
    { key: "serve2", label: "2nd serve points won", percent: true },
    { key: "bps_saved", label: "Break points saved", percent: true }
  ],
  return: [
    { key: "ret1", label: "1st serve return points won" },
    { key: "ret2", label: "2nd serve return points won" },
    { key: "bps_converted", label: "Break points converted" }
  ],
  points: [
    { key: "winners", label: "Winners" },
    { key: "ues", label: "Unforced errors" },
    { key: "net", label: "Net points won" },
    { label: "Service points won", percent: true },
    { label: "Return points won", percent: true },
    { label: "Total points won", percent: true }
  ],
  service_speed: [
    { key: "max_speed", label: "Max speed" },
    { key: "avg1_speed", label: "1st serve average speed" },
    { key: "avg2_speed", label: "2nd serve average speed" }
  ]
}

export const MONTH_NAMES = Object.keys(MonthsEnum).filter(key => isNaN(Number(key)) && key !== "length") as (keyof typeof MonthsEnum)[]

export const NAV_LINKS = [
  {
    label: "Tournaments",
    icon: ICONS.tournament,
    defaultOpen: true,
    children: [
      { label: "Upcoming Tournaments", to: { name: "upcoming-tournaments" }, icon: ICONS.upcoming },
      { label: "Results Archive", to: { name: "results-archive" }, icon: ICONS.event },
      { label: "All Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament }
    ]
  },
  {
    label: "Players",
    icon: ICONS.people,
    defaultOpen: true,
    children: [
      { label: "All Players", to: { name: "players" }, icon: ICONS.player },
      { label: "Head to Head", to: { name: "h2h" }, icon: ICONS.h2h }
    ]
  },
  { label: "Stats/Records", to: { name: "statistics-and-records" }, icon: ICONS.stats },
  {
    label: "Other",
    icon: ICONS.info,
    defaultOpen: true,
    children: [
      { label: "Years", to: { name: "years" }, icon: ICONS.year },
      { label: "Coaches", to: { name: "coaches" }, icon: ICONS.coach },
      { label: "Umpires", to: { name: "umpires" }, icon: ICONS.umpire },
      { label: "Countries", to: { name: "countries" }, icon: ICONS.countries },
      { label: "Venues", to: { name: "venues" }, icon: ICONS.venue },
      { label: "Surfaces", to: { name: "surfaces" }, icon: ICONS.court },
      { label: "Supervisors", to: { name: "supervisors" }, icon: ICONS.supervisor }
    ]
  },
  { label: "Search", to: { name: "search" }, icon: ICONS.search }
]

export const PLAYER_PAGES = [
  { label: "Overview", name: "player", icon: ICONS.overview },
  { label: "Activity", name: "activity", icon: ICONS.event },
  { label: "Titles and Finals", name: "titles-and-finals", icon: ICONS.tournament },
  { label: "Win-Loss Index", name: "wl-index", icon: ICONS.barChart },
  { label: "Stats", name: "stats", icon: ICONS.stats }
]

export const RELATED_LINKS = [
  {
    label: "Governing Bodies",
    children: [
      { label: "ATP", to: "https://www.atptour.com/", target: "_blank" },
      { label: "ITF", to: "https://www.itftennis.com/", target: "_blank" }
    ]
  },
  {
    label: "Grand Slams",
    children: [
      { label: "Australian Open", to: "https://www.ausopen.com/", target: "_blank" },
      { label: "Roland Garros", to: "https://www.rolandgarros.com/", target: "_blank" },
      { label: "Wimbledon", to: "https://www.wimbledon.com/", target: "_blank" },
      { label: "US Open", to: "https://www.usopen.org/", target: "_blank" }
    ]
  },
  {
    label: "Other Links",
    children: [
      { label: "About", to: { name: "about" } },
      { label: "About me", to: "https://www.claire-sheridan.com", target: "_blank" }
    ]
  }
]

export const SEARCH_RESULTS = {
  Player: { label: "Players", icon: ICONS.player, value: "Player" },
  Tournament: { label: "Tournaments", icon: ICONS.tournament, value: "Tournament" },
  Coach: { label: "Coaches", icon: ICONS.coach, value: "Coach" },
  Country: { label: "Countries", icon: ICONS.countries, value: "Country" },
  Venue: { label: "Venues", icon: ICONS.venue, value: "Venue" },
  Surface: { label: "Surfaces", icon: ICONS.court, value: "Surface" },
  Supervisor: { label: "Supervisors", icon: ICONS.supervisor, value: "Supervisor" },
  Umpire: { label: "Umpires", icon: ICONS.umpire, value: "Umpire" }
}

export const SHORT_ROUNDS: Record<RoundType, string> = {
  Win: "W",
  Final: "F",
  Semifinals: "SF",
  Quarterfinals: "QF",
  "Round of 16": "R16",
  "Round of 32": "R32",
  "Round of 64": "R64",
  "Round of 128": "R128"
}

export const STATUSES: Record<StatusType, { longName: string; class: string }> = {
  Q: { longName: "Qualifier", class: "bg-emerald-300 text-green-800" },
  WC: { longName: "Wild Card", class: "bg-blue-300 text-blue-800" },
  LL: { longName: "Lucky Loser", class: "bg-red-300 text-red-800" },
  AL: { longName: "Alternate", class: "bg-amber-300 text-amber-800" },
  SE: { longName: "Special Exempt", class: "bg-fuchsia-300 text-fuchsia-800" },
  PR: { longName: "Protected Ranking", class: "bg-yellow-300 text-yellow-800" }
}

export const SURFACES = Object.values(SurfaceEnum)
