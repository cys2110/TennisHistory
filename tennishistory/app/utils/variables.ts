import appConfig from "~/app.config"

export const ALL_YEARS = Array.from({ length: new Date().getFullYear() - 1968 + 1 }, (_, i) => 1968 + i)

export const CATEGORY_COLOURS = Object.values(appConfig.colours)

export const COUNTRY_DRAWS = ["8888", "615", "9900"]

export const CURRENCIES: Record<CurrencyType, string> = {
  AUD: "A$",
  EUR: "€",
  FRF: "\u20A3",
  GBP: "£",
  USD: "US$"
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

export const LEVEL_OPTIONS: LevelType[] = ["Challenger", "ITF", "Tour"]

export const MONTHS: MonthType[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
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

export const tourColourMapping: Record<number, string> = {
  0: "default",
  1: "atp",
  2: "wta",
  3: "men",
  4: "women"
}

export const TOUR_OPTIONS = ["ATP", "WTA", "ITF (M)", "ITF (W)"]
