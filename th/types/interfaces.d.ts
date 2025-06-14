declare global {
  interface CountryInterface {
    id: string
    name: string
    alpha2: string
  }

  interface EventInterface {
    atp_link: string | null
    tours: TourType[]
    wiki_link: string | null
    wta_link: string | null
  }

  interface PlayerInterface {
    atp_link: string | null
    country: CountryInterface
    official_link: string | null
    tour: TourType
    wiki_link: string | null
    wta_link: string | null
  }

  type TournamentInterface = {
    id: number
    name: string
    tours: TourType[]
    website: string | null
  }
}

export {}
