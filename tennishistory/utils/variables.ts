import appConfig from "~/app.config"

export const CATEGORIES = Object.values(CategoryEnum)

export const CATEGORY_COLOURS = Object.values(COLOURS)

export const COUNTRY_DRAWS = ["8888", "615", "9900"]

export const CURRENCIES: Record<CurrencyType, string> = {
  AUD: "A$",
  EUR: "€",
  FRF: "\u20A3",
  GBP: "£",
  USD: "US$"
}

export const EVENT_PAGES = [
  { label: "Details", name: "event", icon: ICONS.overview },
  { label: "Details", name: "country-event", icon: ICONS.overview },
  { label: "Results", name: "results", icon: ICONS.cards },
  { label: "Draw", name: "draw", icon: ICONS.draw },
  { label: "Draw", name: "country-draw", icon: ICONS.draw },
  { label: "Draw", name: "round-robin-draw", icon: ICONS.draw },
  { label: "Draw", name: "laver-cup-draw", icon: ICONS.draw }
]

export const LETTERS = [
  "All",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
]

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
    { key: "ret1", label: "1st serve return points won", percent: true },
    { key: "ret2", label: "2nd serve return points won", percent: true },
    { key: "bps_converted", label: "Break points converted", percent: true }
  ],
  points: [
    { key: "winners", label: "Winners" },
    { key: "ues", label: "Unforced errors" },
    { key: "net", label: "Net points won", percent: true },
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

export const MONTH_NAMES = Object.keys(MonthEnum).filter(
  key => isNaN(Number(key)) && key !== "length"
) as (keyof typeof MonthEnum)[]

export const NAV_LINKS = [
  { label: "Upcoming Tournaments", to: { name: "upcoming-tournaments" }, icon: ICONS.upcoming },
  { label: "Results Archive", to: { name: "results-archive" }, icon: ICONS.event },
  { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament },
  { label: "Players", to: { name: "players" }, icon: ICONS.player },
  { label: "Head to Head", to: { name: "h2h" }, icon: ICONS.h2h },
  { label: "Years", to: { name: "years" }, icon: ICONS.year },
  { label: "Coaches", to: { name: "coaches" }, icon: ICONS.coach },
  { label: "Umpires", to: { name: "umpires" }, icon: ICONS.umpire },
  { label: "Countries", to: { name: "countries" }, icon: ICONS.countries },
  { label: "Venues", to: { name: "venues" }, icon: ICONS.venue },
  { label: "Surfaces", to: { name: "surfaces" }, icon: ICONS.court },
  { label: "Supervisors", to: { name: "supervisors" }, icon: ICONS.supervisor },
  { label: "Stats/Records", to: { name: "statistics-and-records" }, icon: ICONS.stats },
  { label: "Search", to: { name: "search" }, icon: appConfig.ui?.icons?.search }
]

export const PLAYER_PAGES = [
  { label: "Details", name: "player", icon: ICONS.overview },
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
      { label: "About me", to: "https://www.claire-sheridan.com", target: "_blank" },
      { label: "Ranking Rules History", to: "https://openerarankings.com/Home", target: "_blank" },
      { label: "Tennis Abstract", to: "https://www.tennisabstract.com/", target: "_blank" }
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
  "Round of 128": "R128",
  "Group stages": "G",
  "Round robin": "RR",
  "Day 1": "D1",
  "Day 2": "D2",
  "Day 3": "D3"
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
