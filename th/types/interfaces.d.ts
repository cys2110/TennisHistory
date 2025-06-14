declare global {
  interface CountryInterface {
    id: string
    name: string
    alpha2: string
  }

  interface EventInterface {
    atp_category: CategoryType | null
    atp_dates: string | null
    atp_link: string | null
    category: CategoryType | null
    dates: string | null
    id: number
    name: string | null
    start_date: string
    surface: SurfaceInterface
    tournament: Pick<TournamentInterface, "id" | "name">
    tours: TourType[]
    venues: VenueInterface[]
    wiki_link: string | null
    wta_category: CategoryType | null
    wta_dates: string | null
    wta_link: string | null
    year: number
  }

  interface PlayerInterface {
    atp_link: string | null
    country: CountryInterface
    id: string
    max_year: number | null
    min_year: number | null
    name: string
    official_link: string | null
    tour: TourType
    wiki_link: string | null
    wta_link: string | null
  }

  interface SurfaceInterface {
    id: string
    surface: SurfaceType
    environment: EnvironmentType
  }

  interface TournamentInterface {
    abolished: number | null
    established: number | null
    id: number
    name: string
    tours: TourType[]
    website: string | null
  }

  interface VenueInterface {
    id: string
    name: string | null
    city: string
    country: CountryInterface
  }
}

export {}
