import appConfig from "~/app.config"

export const ALL_YEARS = Array.from({ length: new Date().getFullYear() - 1968 + 1 }, (_, i) => (1968 + i).toString())

export const COUNTRY_DRAWS = ["8888", "615", "9900"]

export const CURRENCIES: Record<CurrencyType, string> = {
  AUD: "A$",
  EUR: "€",
  FRF: "\u20A3",
  GBP: "£",
  USD: "US$"
}

export const ENTRY_INFO_LABELS = {
  LUCKY_LOSER: "Lucky Losers",
  ALTERNATE: "Alternates",
  LDA: "Last Direct Acceptances",
  WILD_CARD: "Wild Cards",
  WITHDREW: "Withdrawals",
  RETIRED: "Retirements",
  WALKOVER: "Walkovers",
  DEFAULTED: "Defaulted",
  QUALIFIER: "Qualifiers"
}

export const ENVIRONMENTS = ["Indoor", "Outdoor"]

export const EVENT_PAGES = [
  {
    label: "Details",
    name: "event",
    icon: appConfig.icons.overview
  },
  {
    label: "Results",
    name: "results",
    icon: appConfig.icons.cards
  },
  {
    label: "Draws",
    name: "draws",
    icon: appConfig.icons.draw,
    ui: {
      itemLeadingIcon: "rotate-270"
    }
  }
]

export const LETTERS = [
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

export const MATCH_STATS: {
  key: keyof Omit<
    MatchDetailsType["match"],
    | "p1"
    | "p2"
    | "incomplete"
    | "court"
    | "tournament"
    | "umpire"
    | "round"
    | "sets"
    | "player_incomplete"
    | "p1_winner"
    | "duration"
    | "date"
    | "id"
    | "chart_link"
  >
  label: string
  percent?: boolean
  category: string
}[] = [
  { key: "aces", label: "Aces", category: "Service Stats" },
  { key: "dfs", label: "Double faults", category: "Service Stats" },
  { key: "first_serve", label: "First serve", percent: true, category: "Service Stats" },
  { key: "serve1", label: "1st serve points won", percent: true, category: "Service Stats" },
  { key: "serve2", label: "2nd serve points won", percent: true, category: "Service Stats" },
  { key: "bps_saved", label: "Break points saved", percent: true, category: "Service Stats" },
  { key: "serve_games", label: "Service games", percent: true, category: "Service Stats" },
  { key: "ret1", label: "1st serve return points won", percent: true, category: "Return Stats" },
  { key: "ret2", label: "2nd serve return points won", percent: true, category: "Return Stats" },
  { key: "bps_converted", label: "Break points converted", percent: true, category: "Return Stats" },
  { key: "return_games", label: "Return games", percent: true, category: "Return Stats" },
  { key: "winners", label: "Winners", category: "Points Stats" },
  { key: "ues", label: "Unforced errors", category: "Points Stats" },
  { key: "net", label: "Net points won", percent: true, category: "Points Stats" },
  { key: "serve_w", label: "Service points won", percent: true, category: "Points Stats" },
  { key: "ret_w", label: "Return points won", percent: true, category: "Points Stats" },
  { key: "total_points", label: "Total points won", percent: true, category: "Points Stats" },
  { key: "max_speed", label: "Max speed", category: "Service Speed" },
  { key: "avg1_speed", label: "1st serve average speed", category: "Service Speed" },
  { key: "avg2_speed", label: "2nd serve average speed", category: "Service Speed" }
]

export const PLAYER_PAGES = [
  { label: "Details", name: "player", icon: appConfig.icons.overview },
  { label: "Activity", name: "activity", icon: appConfig.icons.event },
  { label: "Titles and Finals", name: "titles-and-finals", icon: appConfig.icons.one },
  { label: "Win-Loss Index", name: "wl-index", icon: appConfig.icons.barChart },
  { label: "Stats", name: "stats", icon: appConfig.icons.stats },
  { label: "Record", name: "record", icon: appConfig.icons.tournament }
]

export const SHORT_ROUNDS: Record<Partial<RoundType>, string> = {
  Win: "W",
  Final: "F",
  Semifinals: "SF",
  Quarterfinals: "QF",
  "Round of 16": "R16",
  "Round of 24": "R24",
  "Round of 32": "R32",
  "Round of 64": "R64",
  "Round of 128": "R128",
  "Group stages": "G",
  "Round robin": "RR",
  Qualifier: "Q",
  "Qualifying round 1": "Q1",
  "Qualifying round 2": "Q2",
  "Qualifying round 3": "Q3",
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

export const SURFACES: SurfaceType[] = ["Clay", "Grass", "Hard", "Carpet"]

export const SURFACES_LIST: SurfaceInterface[] = [
  { id: "Indoor Clay", environment: "Indoor", surface: "Clay" },
  { id: "Outdoor Clay", environment: "Outdoor", surface: "Clay" },
  { id: "Outdoor Grass", environment: "Outdoor", surface: "Grass" },
  { id: "Indoor Hard", environment: "Indoor", surface: "Hard" },
  { id: "Outdoor Hard", environment: "Outdoor", surface: "Hard" },
  { id: "Indoor Carpet", environment: "Indoor", surface: "Carpet" },
  { id: "Outdoor Carpet", environment: "Outdoor", surface: "Carpet" }
]

export const TOUR_OPTIONS = [
  { label: "ATP", value: "ATP" },
  { label: "WTA", value: "WTA" },
  { label: "ITF (M)", value: "Men" },
  { label: "ITF (W)", value: "Women" }
]
