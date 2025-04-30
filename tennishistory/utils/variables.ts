import appConfig from "~/app.config"

export const CATEGORIES = Object.values(CategoryEnum)

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

export const SURFACES = Object.values(SurfaceEnum)
