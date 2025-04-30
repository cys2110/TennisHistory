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

  type IncompleteType = "B" | "R" | "Def" | "WO"

  // Consolidated types

  type CoachType = Pick<PlayerInterface, "id" | "name"> &
    Partial<Omit<PlayerInterface, "id" | "name">>

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

  type UmpireDetailsType = Pick<EventInterface, "id" | "tournament" | "draw_type" | "year"> & {
    rounds: {
      round: string
      matches: {
        match_no: string
        p1: Pick<PlayerInterface, "id" | "name" | "country">
        p2: Pick<PlayerInterface, "id" | "name" | "country">
      }[]
    }[]
  }
}

export {}
