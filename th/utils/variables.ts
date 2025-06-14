import appConfig from "~/app.config"

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
