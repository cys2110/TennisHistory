declare global {
  type BreadcrumbType = {
    label: string
    to?: { name: string }
    icon?: string
    avatar?: {
      src: string
      alt: string
    }
    slot?: string
  }

  type StatusType = "success" | "pending" | "idle" | "error"

  type CurrencyType = "USD" | "EUR" | "GBP" | "AUD" | "FRF"

  type IncompleteType = "B" | "R" | "Def" | "WO"

  type MonthType = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December"

  type SortType = "ASC" | "DESC" | undefined

  type StatusType = "Q" | "WC" | "LL" | "AL" | "SE" | "PR"

  type EnvironmentType = "Indoor" | "Outdoor"
  type SurfaceType = "Clay" | "Grass" | "Hard" | "Carpet"

  type TourType = "ATP" | "WTA" | "ITF" | "ITF - Men's" | "ITF - Women's"

  // Base types

  type TournamentType = Pick<TournamentInterface, "id" | "name" | "tours">
}

export {}
