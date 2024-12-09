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

export enum Months {
  Jan = 'January',
  Feb = 'February',
  Mar = 'March',
  Apr = 'April',
  May = 'May',
  Jun = 'June',
  Jul = 'July',
  Aug = 'August',
  Sep = 'September',
  Oct = 'October',
  Nov = 'November',
  Dec = 'December',
}

export enum Category {
  ATP250 = 'ATP 250',
  ATP500 = 'ATP 500',
  ATP1000 = 'ATP Masters 1000',
  GS = 'Grand Slam',
  Finals = 'ATP Finals',
  ATPCup = 'ATP Cup',
  ILTF = 'ILTF',
  ITF = 'ITF',
  Laver = 'Laver Cup',
  NextGen = 'Next Gen Finals',
  NTL = 'NTL',
  Olympics = 'Olympics',
  United = 'United',
  Davis = 'Davis Cup',
  GP = 'Grand Prix',
}

interface Country {
  id: string
  name: string
}

interface CountryConnection {
  edges: {
    node: {
      id: string
      name: string
    }
    properties: {
      end_date: string
      start_date: string
    }
  }[]
}

export interface Entry {
  player: Pick<Player, 'id' | 'full_name' | 'country' | 'last_name'>
  seed: number | null
  rank: number | null
  status: StatusInfo | null
}

export interface EntryConnection {
  edges: {
    node: {
      player: Player
    }
    properties?: {
      rank?: number | null
      reason?: string | null
    }
  }
}

export interface Event {
  altConnection: Pick<EntryConnection, 'edges'>[]
  id: number
  category: Category | null
  currency: Currency | null
  defaultedConnection: Pick<EntryConnection, 'edges'> & { properties: { reason: string | null } }[]
  draw_type: string
  end_date: string
  ldaConnection: Pick<EntryConnection, 'edges'> & { properties: { rank: number | null } }[]
  llsConnection: Pick<EntryConnection, 'edges'>[]
  pm: number
  retConnection: Pick<EntryConnection, 'edges'> & { properties: { reason: string | null } }[]
  rounds: Round[]
  qualifiersConnection: Pick<EntryConnection, 'edges'>[]
  seeds: Pick<Entry, 'player' | 'seed' | 'rank'>[]
  sponsor_name: string | null
  start_date: string
  supervisors: {
    id: string
  }[]
  surface: {
    id: Surface
  }
  tfc: number
  tournament: Pick<Tournament, 'id' | 'name'>
  venue: Venue
  wcConnection: Pick<EntryConnection, 'edges'>[]
  wdConnection: Pick<EntryConnection, 'edges'> & { properties: { reason: string | null } }[]
  woConnection: Pick<EntryConnection, 'edges'> & { properties: { reason: string | null } }[]
  year: {
    id: number
  }
}

export interface Index {
  category: string
  stat: string
  win: number
  loss: number
  titles?: number
  value: number | string
}

export interface Match {
  court: string | null
  date: string | null
  duration_mins: number | null
  incomplete: Incomplete | null
  loser: Pick<
    Score,
    'player' | 's1' | 's2' | 's3' | 's4' | 's5' | 't1' | 't2' | 't3' | 't4' | 't5' | 'incomplete'
  >
  match_no: number
  p1: Pick<
    Score,
    'player' | 's1' | 's2' | 's3' | 's4' | 's5' | 't1' | 't2' | 't3' | 't4' | 't5' | 'incomplete'
  >
  p2: Pick<
    Score,
    'player' | 's1' | 's2' | 's3' | 's4' | 's5' | 't1' | 't2' | 't3' | 't4' | 't5' | 'incomplete'
  >
  winner: Pick<
    Score,
    'player' | 's1' | 's2' | 's3' | 's4' | 's5' | 't1' | 't2' | 't3' | 't4' | 't5'
  >
  umpire: {
    id: string
  } | null
}

export interface Player {
  bh1: boolean | null
  career_high: number | null
  ch_date: string | null
  coaches: {
    id: string
    full_name: string
    first_name: string | null
  }[]
  country: {
    id: string
    name: string
  }
  countryConnection: CountryConnection
  dob: string | null
  full_name: string
  gladiator: boolean
  height_cm: number | null
  id: string
  last_name: string
  loss: number
  pm_USD: number
  prev_countriesConnection: CountryConnection | null
  retired: {
    id: number
  } | null
  rh: boolean | null
  titles: number
  turned_pro: {
    id: number
  } | null
  win: number
}

export interface Round {
  matches: Match[]
  number: number
  pm: number | null
  points: number | null
  round: string
  event: Event
}

export interface Score {
  incomplete: Incomplete | null
  player: Entry
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

export interface Tournament {
  id: number
  name: string
  website: string | null
  start_year: {
    id: number
  }
  end_year: {
    id: number
  } | null
  events: Pick<Event, 'id' | 'year' | 'start_date' | 'end_date' | 'rounds'>[]
}

interface Venue {
  name: string
  city: string
  country: Country
}

// Home/Archive View

export type EventCard = Pick<
  Event,
  'id' | 'category' | 'start_date' | 'end_date' | 'tournament' | 'year' | 'sponsor_name' | 'surface'
> & { venue: Pick<Venue, 'city' | 'country'> }

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
