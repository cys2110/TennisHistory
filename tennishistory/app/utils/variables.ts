import appConfig from "~/app.config"

export const ALL_YEARS = Array.from({ length: new Date().getFullYear() - 1968 + 1 }, (_, i) => (1968 + i).toString())

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

export const SURFACES: SurfaceType[] = ["Clay", "Grass", "Hard", "Carpet"]

export const TOUR_OPTIONS = [
  { label: "ATP", value: "ATP" },
  { label: "WTA", value: "WTA" },
  { label: "ITF (M)", value: "Men" },
  { label: "ITF (W)", value: "Women" }
]
