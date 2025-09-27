import appConfig from "~/app.config"

export const ALL_YEARS = Array.from({ length: new Date().getFullYear() - 1968 + 1 }, (_, i) => 1968 + i)

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
  {
    label: "Details",
    name: "event",
    icon: ICONS.overview
  },
  {
    label: "Results",
    name: "results",
    icon: ICONS.cards
  },
  {
    label: "Draws",
    name: "draws",
    icon: ICONS.draw,
    ui: { itemLeadingIcon: "rotate-270" }
  }
]

export const INCOMPLETES: Record<IncompleteType, string> = {
  B: "Bye",
  R: "Retired",
  WO: "Walkover",
  Def: "Defaulted"
}

export const PLAYER_PAGES = [
  { label: "Details", name: "player", icon: ICONS.overview },
  { label: "Activity", name: "activity", icon: ICONS.event },
  { label: "Titles and Finals", name: "titles-and-finals", icon: ICONS.one },
  { label: "Win-Loss Index", name: "wl-index", icon: ICONS.barChart },
  { label: "Stats", name: "stats", icon: ICONS.stats },
  { label: "Record", name: "record", icon: ICONS.tournament }
]

export const SEARCH_CATEGORIES: Record<string, { label: string; icon: string; value: string; color: keyof typeof appConfig.ui.colors }> = {
  Player: { label: "Players", icon: ICONS.player, value: "Player", color: "primary" },
  Tournament: { label: "Tournaments", icon: ICONS.tournament, value: "Tournament", color: "active" },
  Coach: { label: "Coaches", icon: ICONS.coach, value: "Coach", color: "singles" },
  Country: { label: "Countries", icon: ICONS.countries, value: "Country", color: "doubles" },
  Venue: { label: "Venues", icon: ICONS.venue, value: "Venue", color: "warning" },
  Surface: { label: "Surfaces", icon: ICONS.court, value: "Surface", color: "tour" },
  Supervisor: { label: "Supervisors", icon: ICONS.supervisor, value: "Supervisor", color: "inactive" },
  Umpire: { label: "Umpires", icon: ICONS.umpire, value: "Umpire", color: "itf" }
}

export const STATUSES: Record<StatusType, { longName: string; class: string }> = {
  Q: { longName: "Qualifier", class: "bg-emerald-300 text-green-800" },
  WC: { longName: "Wild Card", class: "bg-blue-300 text-blue-800" },
  LL: { longName: "Lucky Loser", class: "bg-red-300 text-red-800" },
  AL: { longName: "Alternate", class: "bg-amber-300 text-amber-800" },
  SE: { longName: "Special Exempt", class: "bg-fuchsia-300 text-fuchsia-800" },
  PR: { longName: "Protected Ranking", class: "bg-yellow-300 text-yellow-800" }
}

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
  0: "muted",
  1: "atp",
  2: "wta",
  3: "men",
  4: "women"
}
