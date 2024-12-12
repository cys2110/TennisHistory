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
  pm: number
  points: number
  rank: number | null
  scores: Score[]
  seed: number | null
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
  p1: Score
  p2: Score
  round: Round
  winner: Pick<
    Score,
    'player' | 's1' | 's2' | 's3' | 's4' | 's5' | 't1' | 't2' | 't3' | 't4' | 't5'
  >
  umpire: {
    id: string
  } | null
}

export interface Player {
  backhand: string | null
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
  height_ft: string | null
  id: string
  last_name: string
  loss: number
  plays: string | null
  pm_USD: number
  prev_countriesConnection: CountryConnection | null
  retired: {
    id: number
  } | null
  titles: number
  turned_pro: {
    id: number
  } | null
  win: number
  bh1: boolean | null
  rh: boolean | null
}

export interface SearchResults {
  searchTournaments: {
    id: number
    name: string
  }[]
  searchPlayers: {
    id: string
    full_name: string
    country: {
      name: string
      id: string
    }
  }[]
  searchCoaches: {
    id: string
    full_name: string | null
  }[]
  searchCountries: {
    name: string
    id: string
  }[]
  searchSupervisors: {
    id: string
  }[]
  searchSurface: {
    id: Surface
  }[]
  searchUmpires: {
    id: string
  }[]
  searchVenue: {
    name: string
    city: string
    country: {
      id: string
    }
  }[]
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
  aces: number | null
  avg_sv1_kph: number | null
  avg_sv2_kph: number | null
  bp_opps: number | null
  bps_converted: number | null
  bps_faced: number | null
  bps_saved: number | null
  dfs: number | null
  incomplete: Incomplete | null
  match: Match
  max_speed_kph: number | null
  net: number | null
  net_w: number | null
  player: Entry
  ret2_w: number | null
  ret2: number | null
  ret1_w: number | null
  ret1: number | null
  s1: number | null
  s2: number | null
  s3: number | null
  s4: number | null
  s5: number | null
  serve1_pts: number | null
  serve1_pts_w: number | null
  serve2_pts: number | null
  serve2_pts_w: number | null
  t1: number | null
  t2: number | null
  t3: number | null
  t4: number | null
  t5: number | null
  ues: number | null
  winners: number | null
}

export interface TitlesAndFinals {
  tid: number
  surface: number
  year: number
  id: number
  tname: string
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

export interface Venue {
  name: string
  city: string
  country: Country
}

// Home/Archive View

export type EventCard = Pick<
  Event,
  'id' | 'category' | 'start_date' | 'end_date' | 'tournament' | 'year' | 'sponsor_name' | 'surface'
> & { venue: Pick<Venue, 'city' | 'country'> }
