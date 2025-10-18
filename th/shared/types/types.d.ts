declare global {
  type APIStatusType = "idle" | "pending" | "success" | "error"

  type PlayerFiltersType = {
    players: SelectOptionsType[]
    tour: TourEnum | undefined
    countries: SelectOptionsType[]
    minYear: number | undefined
    maxYear: number | undefined
    status: string | undefined
    coaches: SelectOptionsType[]
  }

  type TournamentFiltersType = {
    tours: TourEnum[]
    tournaments: SelectOptionsType[]
    established: number | undefined
    abolished: number | undefined
  }

  type SelectOptionsType = { id: string; label: string }

  type SortType = "ASC" | "DESC" | undefined

  interface CountryInterface {
    id: string
    name: string
    alpha2?: string
  }

  interface FormFieldInterface<S> {
    label: string
    key: keyof S
    type: string
    subType?: string
    items?: any[]
    required?: boolean
    colSpan?: number
    size?: "sm" | "md" | "xs"
  }

  interface PersonInterface {
    end_date: string
    first_name: string
    id: string
    labels: string[]
    last_name: string
    start_date: string
  }

  interface PlayerInterface extends PersonInterface {
    coaches: PersonInterface[]
    country: CountryInterface
    min_year: number
    max_year: number
    tour: TourEnum
  }

  interface TournamentInterface {
    abolished: number
    established: number
    id: number
    name: string
    tours: (keyof typeof TourEnum)[]
    update: boolean
    website: string
  }
}

export {}
