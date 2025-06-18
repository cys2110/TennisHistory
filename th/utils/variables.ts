import appConfig from "~/app.config"

export const ATP_CATEGORIES: CategoryType[] = [
  "Grand Slam",
  "ATP Finals",
  "ATP Masters 1000",
  "ATP 500",
  "ATP 250",
  "Next Gen Finals",
  "Laver Cup",
  "ATP 125",
  "ATP Cup",
  "ATP Masters Series",
  "ATP International Series Gold",
  "ATP International Series",
  "ATP World Series",
  "ATP Super 9",
  "ATP Championship Series",
  "ATP Championship Series, Single Week",
  "ILTF",
  "NTL",
  "Grand Prix"
]

export const WTA_CATEGORIES: CategoryType[] = [
  "Grand Slam",
  "WTA Finals",
  "WTA 1000",
  "WTA 500",
  "WTA 250",
  "WTA 125",
  "ATP Cup",
  "WTA Elite Trophy",
  "WTA Premier Mandatory",
  "WTA Premier Five",
  "WTA Premier",
  "WTA International Tournaments",
  "ILTF",
  "NTL"
]

export const ITF_MEN_CATEGORIES: CategoryType[] = ["Davis Cup", "Olympics", "ITF M25", "ITF"]

export const ITF_WOMEN_CATEGORIES: CategoryType[] = ["Billie Jean King Cup", "Olympics", "ITF"]

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
    icon: appConfig.icons.draw
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
  { label: "Titles and Finals", name: "titles-and-finals", icon: appConfig.icons.tournament },
  { label: "Win-Loss Index", name: "wl-index", icon: appConfig.icons.barChart },
  { label: "Stats", name: "stats", icon: appConfig.icons.stats },
  { label: "Record", name: "record", icon: appConfig.icons.seeds }
]

export const SURFACES: SurfaceType[] = ["Clay", "Grass", "Hard", "Carpet"]
