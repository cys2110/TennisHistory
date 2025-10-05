declare global {
  interface EventInterface {}

  interface TournamentInterface {
    id: number
    name: string
    tours: string[]
    established?: number
    abolished?: number
    website?: string
  }
}

export {}
