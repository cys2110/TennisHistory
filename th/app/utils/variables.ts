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
    ui: { itemLeadingIcon: "rotate-270" }
  }
]

export const INCOMPLETES: Record<IncompleteType, string> = {
  B: "Bye",
  R: "Retired",
  WO: "Walkover",
  Def: "Defaulted"
}

export const MATCH_STATS = [
  {
    label: "Aces",
    category: "Service Stats",
    key: "aces",
    low: false,
    percent: false
  },
  {
    label: "Double faults",
    category: "Service Stats",
    key: "dfs",
    low: true,
    percent: false
  },
  {
    label: "First serve",
    category: "Service Stats",
    numerators: ["serve1"],
    denominators: ["serve1", "serve2"],
    low: false,
    percent: true
  },
  {
    label: "1st serve points won",
    category: "Service Stats",
    numerators: ["serve1_w"],
    denominators: ["serve1"],
    low: false,
    percent: true
  },
  {
    label: "2nd serve points won",
    category: "Service Stats",
    numerators: ["serve2_w"],
    denominators: ["serve2"],
    low: false,
    percent: true
  },
  {
    label: "Break points saved",
    category: "Service Stats",
    numerators: ["bps_saved"],
    denominators: ["bps_faced"],
    low: false,
    percent: true
  },
  {
    label: "Service games won",
    category: "Service Stats",
    numerators: ["bps_saved", "bps_faced"],
    denominators: ["serve_games"],
    low: false,
    percent: true
  },
  {
    label: "1st serve return points won",
    category: "Return Stats",
    numerators: ["ret1_w"],
    denominators: ["ret1"],
    low: false,
    percent: true
  },
  {
    label: "2nd serve return points won",
    category: "Return Stats",
    numerators: ["ret2_w"],
    denominators: ["ret2"],
    low: false,
    percent: true
  },
  {
    label: "Break points converted",
    category: "Return Stats",
    numerators: ["bps_converted"],
    denominators: ["bp_opps"],
    low: false,
    percent: true
  },
  {
    label: "Return games won",
    category: "Return Stats",
    numerators: ["bps_converted"],
    denominators: ["return_games"],
    low: false,
    percent: true
  },
  {
    label: "Winners",
    category: "Points Stats",
    key: "winners",
    low: false,
    percent: false
  },
  {
    label: "Unforced errors",
    category: "Points Stats",
    key: "ues",
    low: true,
    percent: false
  },
  {
    label: "Net points won",
    category: "Points Stats",
    numerators: ["net_w"],
    denominators: ["net"],
    low: false,
    percent: false
  },
  {
    label: "Service points won",
    category: "Points Stats",
    numerators: ["serve1_w", "serve2_w"],
    denominators: ["serve1", "serve2"],
    low: false,
    percent: true
  },
  {
    label: "Return points won",
    category: "Points Stats",
    numerators: ["ret1_w", "ret2_w"],
    denominators: ["ret1", "ret2"],
    low: false,
    percent: true
  },
  {
    label: "Total points won",
    category: "Points Stats",
    numerators: ["serve1_w", "serve2_w", "ret1_w", "ret2_w"],
    denominators: ["serve1", "serve2", "ret1", "ret2"],
    low: false,
    percent: true
  },
  {
    label: "Max speed (km/h)",
    category: "Service Speed",
    key: "max_speed",
    low: false,
    percent: false
  },
  {
    label: "1st serve average speed (km/h)",
    category: "Service Speed",
    key: "avg1_speed",
    low: false,
    percent: false
  },
  {
    label: "2nd serve average speed (km/h)",
    category: "Service Speed",
    key: "avg2_speed",
    low: false,
    percent: false
  }
]

export const PLAYER_PAGES = [
  { label: "Details", name: "player", icon: appConfig.icons.overview },
  { label: "Activity", name: "activity", icon: appConfig.icons.event },
  { label: "Titles and Finals", name: "titles-and-finals", icon: appConfig.icons.one },
  { label: "Win-Loss Index", name: "wl-index", icon: appConfig.icons.barChart },
  { label: "Stats", name: "stats", icon: appConfig.icons.stats },
  { label: "Record", name: "record", icon: appConfig.icons.tournament }
]

export const SEARCH_CATEGORIES: Record<string, { label: string; icon: string; value: string; color: keyof typeof appConfig.ui.colors }> = {
  Player: { label: "Players", icon: appConfig.icons.player, value: "Player", color: "primary" },
  Tournament: { label: "Tournaments", icon: appConfig.icons.tournament, value: "Tournament", color: "active" },
  Coach: { label: "Coaches", icon: appConfig.icons.coach, value: "Coach", color: "singles" },
  Country: { label: "Countries", icon: appConfig.icons.countries, value: "Country", color: "doubles" },
  Venue: { label: "Venues", icon: appConfig.icons.venue, value: "Venue", color: "warning" },
  Surface: { label: "Surfaces", icon: appConfig.icons.court, value: "Surface", color: "tour" },
  Supervisor: { label: "Supervisors", icon: appConfig.icons.supervisor, value: "Supervisor", color: "inactive" },
  Umpire: { label: "Umpires", icon: appConfig.icons.umpire, value: "Umpire", color: "itf" }
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
  0: "default",
  1: "atp",
  2: "wta",
  3: "men",
  4: "women"
}
