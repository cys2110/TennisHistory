declare global {
  type CurrencyType = "USD" | "EUR" | "GBP" | "AUD" | "FF"

  type DrawType =
    | "Round of 128"
    | "Round of 64"
    | "Round of 32"
    | "Round of 16"
    | "Round robin"
    | "Laver Cup"
    | "Country draw"

  // Consolidated types

  type EventCardType = Pick<
    EventInterface,
    | "year"
    | "surface"
    | "id"
    | "name"
    | "category"
    | "venues"
    | "start_date"
    | "dates"
    | "draw_type"
    | "tournament"
  >
}

export {}
