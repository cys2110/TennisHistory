export const drawOptions = [
  "Round of 128",
  "Round of 64",
  "Round of 48",
  "Round of 32",
  "Round of 24",
  "Round of 16",
  "Round of 8",
  "Round of 4",
  "Round robin",
  "Country draw"
]

export const currencies = ["USD", "EUR", "GBP", "AUD", "FRF"]

export const surfaces = ["Indoor Clay", "Outdoor Clay", "Outdoor Grass", "Indoor Hard", "Outdoor Hard", "Indoor Carpet"]

export const ALL_YEARS = Array.from({ length: new Date().getFullYear() - 1968 + 1 }, (_, i) => 1968 + i)

export const rounds = [
  "Round of 128",
  "Round of 64",
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Final",
  "Win",
  "Qualifier",
  "Qualifying round 3",
  "Qualifying round 2",
  "Qualifying round 1"
]

export const tours = ["ATP", "WTA", "Men", "Women"]

export const routes = [
  { label: "Details", to: { name: "event" } },
  { label: "Rounds", to: { name: "rounds" } },
  { label: "Withdrawals", to: { name: "withdrawals" } },
  { label: "Seeds", to: { name: "seeds" } },
  { label: "LDA", to: { name: "lda" } },
  { label: "Retirements", to: { name: "retirements" } },
  { label: "Walkovers", to: { name: "walkovers" } },
  { label: "Defaults", to: { name: "defaults" } },
  { label: "Entries", to: { name: "entries" } },
  { label: "Matches", to: { name: "matches" } },
  { label: "Draws", to: { name: "draws" } }
]

export const ICONS = {
  download: "line-md:downloading",
  downloading: "line-md:downloading",
  uploading: "line-md:uploading-loop"
}

export const letters = [
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
