import appConfig from "~/app.config"

declare global {
  interface TournamentInterface {
    id: number
    name: string
    tours: string[]
    established?: number
    abolished?: number
    website?: string
  }

  interface DrawInterface {
    rounds: DrawRoundInterface[]
    matches?: DrawMatchInterface[]
    contestants?: {
      [contestantId: string]: DrawContestantInterface
    }
  }

  interface DrawRoundInterface {
    name?: string
  }

  interface DrawMatchInterface {
    roundIndex: number
    order: number
    sides?: DrawSideInterface[]
    matchStatus?: string
    isBronzeMatch?: boolean
  }

  interface DrawContestantInterface {
    entryStatus?: string
    players?: DrawPlayerInterface[]
  }

  interface DrawSideInterface {
    title?: string
    contestantId?: string
    scores?: DrawScoreInterface[]
    isWinner?: boolean
  }

  interface DrawScoreInterface {
    mainScore: number
    subscore?: number
    isWinner?: boolean
  }

  interface DrawPlayerInterface {
    title: string
    nationality: string
  }

  interface FormFieldInterface<S> {
    label: string
    key: keyof S
    type: string
    items?: any[]
    loading?: boolean
    subType?: string
    required?: boolean
    max?: number
    format?: (value: any) => any
    disabled?: boolean
    colSpan?: number
    colour?: keyof typeof appConfig.ui.colors
  }
}

export {}
