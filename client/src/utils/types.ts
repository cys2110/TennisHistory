export enum Surface {
  IndoorCarpet = 'Indoor Carpet',
  IndoorClay = 'Indoor Clay',
  IndoorHard = 'Indoor Hard',
  IndoorHardAcrylic = 'Indoor Hard Acrylic',
  IndoorHardDecoturf = 'Indoor Hard Decoturf',
  IndoorHardGerflor = 'Indoor Hard Gerflor',
  IndoorHardGreenset = 'Indoor Hard Greenset',
  IndoorHardLaykold = 'Indoor Hard Laykold',
  IndoorHardPlexicushion = 'Indoor Hard Plexicushion',
  IndoorHardPlexipave = 'Indoor Hard Plexipave',
  IndoorHardPremier = 'Indoor Hard Premier',
  IndoorHardProflex = 'Indoor Hard Proflex',
  IndoorHardReboundace = 'Indoor Hard Rebound ace',
  IndoorHardSlamcourt = 'Indoor Hard Slamcourt',
  IndoorHardTPSurface = 'Indoor Hard TP Surface',
  OutdoorClay = 'Outdoor Clay',
  OutdoorGrass = 'Outdoor Grass',
  OutdoorHard = 'Outdoor Hard',
  OutdoorHardCourtMaster = 'Outdoor Hard Court Master',
  OutdoorHardDecoturf = 'Outdoor Hard Decoturf',
  OutdoorHardGreenset = 'Outdoor Hard Greenset',
  OutdoorHardHarTru = 'Outdoor Hard Har-Tru',
  OutdoorHardLaykold = 'Outdoor Hard Laykold',
  OutdoorHardPlaypave = 'Outdoor Hard Play pave',
  OutdoorHardPlexicushion = 'Outdoor Hard Plexicushion',
  OutdoorHardPlexipave = 'Outdoor Hard Plexipave',
  OutdoorHardReboundace = 'Outdoor Hard Rebound ace',
  OutdoorHardSolflex = 'Outdoor Hard Solflex',
  OutdoorHardSportMaster = 'Outdoor Hard Sport Master',
  Various = 'Various',
}

export enum Incomplete {
  R = 'R',
  WO = 'WO',
  B = 'B',
}

export enum Currency {
  USD = 'USD',
  AUD = 'AUD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export enum StatusInfo {
  LL = 'LL',
  PR = 'PR',
  WC = 'WC',
  SE = 'SE',
  Q = 'Q',
  Alt = 'Alt',
}

export enum EntryInfo {
  ldaConnection = 'ldaConnection',
  llsConnection = 'llsConnection',
  altConnection = 'altConnection',
  wdConnection = 'wdConnection',
  retConnection = 'retConnection',
  woConnection = 'woConnection',
  defaultedConnection = 'defaultedConnection',
  wcConnection = 'wcConnection',
  qualifiersConnection = 'qualifiersConnection',
}

export interface PlayerBase {
  id: string
  full_name: string
  country: {
    id: string
    name: string
  }
}

export interface EventCard {
  id: number
  category: string | null
  end_date: string
  sponsor_name: string | null
  start_date: string
  surface: {
    id: Surface
  }
  tournament: {
    id: number
    name: string
  }
  venue: {
    city: string
    country: {
      id: string
      name: string
    }
  }
  year: {
    id: number
  }
}

export interface TournamentEvent {
  id: number
  year: {
    id: number
  }
  start_date: string
  end_date: string
  rounds: {
    matches: {
      match_no: number
      winner: WinnerScore
      loser: WinnerScore
    }[]
  }[]
}

export interface Tournament {
  id: number
  name: string
  website: string | null
  start_year: {
    id: number
  }
  end_year: {
    id: number
  }
  events: TournamentEvent[]
}

export interface EntryConnectionNode {
  edges: {
    node: {
      player: PlayerBase
    }
    properties?: {
      rank?: number | null
      reason?: string | null
    }
  }
}

export interface EventRound {
  round: string
  number: number
  pm: number | null
  points: number | null
}

export interface EventSeeds {
  seed: number
  rank: number
  player: PlayerBase
}

export interface EventEntries {
  player: PlayerBase
  seed: number | null
  rank: number | null
  status: StatusInfo | null
}

export interface EventDetailsType {
  category: string | null
  draw_type: string
  sponsor_name: string | null
  start_date: string
  end_date: string
  id: number
  pm: number
  tfc: number
  currency: Currency | null
  surface: {
    id: Surface
  }
  tournament: {
    id: number
    name: string
  }
  venue: {
    name: string
    city: string
    country: {
      id: string
      name: string
    }
  }
  year: {
    id: number
  }
  supervisors: {
    id: string
  }[]
  rounds: EventRound[]
  seeds: EventSeeds[]
  ldaConnection: EntryConnectionNode[]
  wdConnection: EntryConnectionNode[]
  retConnection: EntryConnectionNode[]
  woConnection: EntryConnectionNode[]
  defaultedConnection: EntryConnectionNode[]
  llsConnection: EntryConnectionNode[]
  altConnection: EntryConnectionNode[]
  wcConnection: EntryConnectionNode[]
  qualifiersConnection: EntryConnectionNode[]
  entries: EventEntries[]
}

export interface ResultsMatch {
  round: string
  number: number
  matches: {
    court: string
    date: string
    duration_mins: number
    incomplete: Incomplete | null
    match_no: number
    umpire: {
      id: string
    }
    winner: {
      s1: number | null
      s2: number | null
      s3: number | null
      s4: number | null
      s5: number | null
      t1: number | null
      t2: number | null
      t3: number | null
      t4: number | null
      t5: number | null
      player: {
        seed: number | null
        status: StatusInfo | null
        player: PlayerBase
      }
    }
    loser: {
      s1: number | null
      s2: number | null
      s3: number | null
      s4: number | null
      s5: number | null
      t1: number | null
      t2: number | null
      t3: number | null
      t4: number | null
      t5: number | null
      incomplete: Incomplete | null
      player: {
        seed: number | null
        status: StatusInfo | null
        player: PlayerBase
      }
    }
  }[]
}

export interface DrawMatch {
  round: string
  number: number
  matches: {
    incomplete: Incomplete | null
    match_no: number
    p1: {
      s1: number | null
      s2: number | null
      s3: number | null
      s4: number | null
      s5: number | null
      t1: number | null
      t2: number | null
      t3: number | null
      t4: number | null
      t5: number | null
      player: {
        seed: number | null
        status: StatusInfo | null
        player: PlayerBase
      }
      incomplete: Incomplete | null
    }
    p2: {
      s1: number | null
      s2: number | null
      s3: number | null
      s4: number | null
      s5: number | null
      t1: number | null
      t2: number | null
      t3: number | null
      t4: number | null
      t5: number | null
      incomplete: Incomplete | null
      player: {
        seed: number | null
        status: StatusInfo | null
        player: PlayerBase
      }
    }
    winner: {
      player: {
        player: {
          id: string
        }
      }
    }
  }[]
}

export interface WinnerScore {
  player: {
    player: PlayerBase
  }
  s1: number | null
  s2: number | null
  s3: number | null
  s4: number | null
  s5: number | null
  t1: number | null
  t2: number | null
  t3: number | null
  t4: number | null
  t5: number | null
  incomplete?: Incomplete | null
}

export interface PlayerDetailsType {
  id: string
  full_name: string
  career_high: number | null
  ch_date: string | null
  loss: number
  win: number
  titles: number
  pm_USD: number
  gladiator: boolean
  dob: string | null
  height_cm: number | null
  rh: boolean | null
  bh1: boolean | null
  turned_pro: {
    id: number
  }
  retired: {
    id: number
  }
  coaches: {
    id: string
    full_name: string | null
    first_name: string | null
  }[]
  countryConnection: {
    edges: {
      node: {
        id: string
        name: string
      }
      properties: {
        start_date: string | null
        end_date: string | null
      }
    }[]
  }
  prev_countriesConnection: {
    edges: {
      node: {
        id: string
        name: string
      }
      properties: {
        start_date: string
        end_date: string
      }
    }[]
  }
}

export interface H2HPlayerDetails {
  bh1: boolean | null
  career_high: number | null
  ch_date: string | null
  country: {
    id: string
    name: string
  }
  dob: string | null
  full_name: string
  height_cm: number | null
  id: string
  loss: number
  pm_USD: number
  rh: boolean | null
  titles: number
  turned_pro: {
    id: number
  }
  win: number
}

export interface H2HMatches {
  round: {
    round: string
    event: {
      id: number
      surface: {
        id: Surface
      }
      year: {
        id: number
      }
      tournament: {
        id: number
        name: string
      }
    }
  }
  match_no: number
  winner: {
    player: {
      player: {
        id: string
        full_name: string
      }
    }
    s1: number | null
    s2: number | null
    s3: number | null
    s4: number | null
    s5: number | null
    t1: number | null
    t2: number | null
    t3: number | null
    t4: number | null
    t5: number | null
  }
  loser: {
    s1: number | null
    s2: number | null
    s3: number | null
    s4: number | null
    s5: number | null
    t1: number | null
    t2: number | null
    t3: number | null
    t4: number | null
    t5: number | null
    incomplete: Incomplete | null
  }
}

export interface H2H {
  p1: H2HPlayerDetails[]
  p2: H2HPlayerDetails[]
  p1Wins: {
    count: number
  }
  p2Wins: {
    count: number
  }
  matches: H2HMatches[]
}
