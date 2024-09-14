interface numberId {
  id: number;
}

interface stringId {
  id: string;
}

interface Country {
  id: string;
  name: string;
}

interface Surface {
  environment: string;
  hard_type: string | null;
  surface: string;
}

interface Venue {
  name?: string;
  city: string;
  country: Country;
}

export interface Activity {
  properties: EntryInfo;
  node: Event;
}

export interface EntryInfo {
  seed: number | null;
  status: string | null;
  points: number;
  rank: number;
  pm: number;
  wd?: string | null;
}

export interface Event {
  id: number;
  category?: string | null;
  end_date: Date;
  sponsor_name?: string | null;
  start_date: Date;
  surface?: Surface;
  tournament?: Tournament;
  year: numberId;
  venue?: Venue;
  winner?: Player;
  finalist?: Player;
  final_score?: string;
  currency?: string | null;
  playersConnection?: {
    edges: {
      node: stringId;
      properties: EntryInfo;
    };
  }[];
  rounds?: {
    round: string;
    matches: Match[];
  }[];
}

export interface H2H {
  p1: PlayerDetails[];
  p2: PlayerDetails[];
  p1Wins: {
    count: number;
  };
  p2Wins: {
    count: number;
  };
  matches: Match[];
}

export interface MajorYears {
  round: string;
  event: {
    id: number;
    year: numberId;
  };
}

export interface Match {
  match_no: number;
  round: {
    round: string;
    event?: Event;
  };
  incomplete: string | null;
  date?: Date | null;
  court?: string | null;
  duration_mins?: number | null;
  winner?: Score;
  loser?: Score;
  pScore?: Score[];
  oppScore: Score[];
  p1?: Score;
  p2?: Score;
  umpire?: stringId;
}

export interface Player {
  id: string;
  full_name: string;
  country: Country;
}

export interface PlayerDetails extends Player {
  first_name?: string;
  last_name?: string;
  dob?: Date | null;
  height_cm?: number | null;
  rh?: boolean | null;
  bh1?: boolean | null;
  turned_pro?: numberId;
  retired?: numberId;
  coaches?: {
    id: string;
    full_name: string | null;
  }[];
  countryConnection?: {
    edges: {
      node: Country;
      properties: {
        start_date: Date | null;
        end_date: Date | null;
      };
    }[];
  };
  prev_countriesConnection?: {
    edges: {
      node: Country;
      properties: {
        start_date: Date;
        end_date: Date;
      };
    }[];
  };
  career_high?: number;
  ch_date?: Date;
  win?: number;
  loss?: number;
  titles?: number;
  pm_USD?: number;
  gladiator?: boolean;
  ao?: MajorYears[];
  rg?: MajorYears[];
  wimbledon?: MajorYears[];
  uso?: MajorYears[];
  finals?: MajorYears[];
  davis?: MajorYears[];
  olympics?: MajorYears[];
  hopman?: MajorYears[];
}

export interface PlayerStats {
  category: string;
  stats: {
    metric: string;
    win?: number;
    total: number;
  }[];
}

export interface Score {
  incomplete: string | null;
  s1: number | null;
  s2: number | null;
  s3: number | null;
  s4: number | null;
  s5: number | null;
  t1: number | null;
  t2: number | null;
  t3: number | null;
  t4: number | null;
  t5: number | null;
  player?: Player;
  aces?: number | null;
  avg_sv1_kph?: number | null;
  avg_sv2_kph?: number | null;
  bp_opps?: number | null;
  bps_converted?: number | null;
  bps_faced?: number | null;
  bps_saved?: number | null;
  dfs?: number | null;
  max_speed_kph?: number | null;
  net?: number | null;
  net_w?: number | null;
  ret1?: number | null;
  ret1_w?: number | null;
  ret2?: number | null;
  ret2_w?: number | null;
  serve1_pts?: number | null;
  serve1_pts_w?: number | null;
  serve2_pts?: number | null;
  serve2_pts_w?: number | null;
  winners?: number | null;
  ues?: number | null;
}

export interface Title {
  year: number;
  count: number;
  events: {
    id: number;
    sponsor_name: string;
    tournament_id: number;
    tournament_name: string;
    environment: string;
    surface: string;
    hard_type: string;
  }[];
}

export interface Titles {
  titlesByYear: Title[];
  finalsByYear: Title[];
}

export interface Tournament {
  id: number;
  name: string;
}

export interface TournamentDetails extends Tournament {
  website: string;
  start_year: numberId;
  end_year: numberId;
  events: Event[];
}

export interface WLIndex {
  category: string;
  stats: {
    metric: string;
    win: number;
    total: number;
    titles?: number;
  }[];
}
