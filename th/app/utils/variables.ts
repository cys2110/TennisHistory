export const ALL_YEARS = Array.from({ length: new Date().getFullYear() - 1968 + 1 }, (_, i) => 1968 + i)

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

export const tourColourMapping: Record<number, string> = {
  0: "muted",
  1: "ATP",
  2: "WTA",
  3: "Men",
  4: "Women"
}
