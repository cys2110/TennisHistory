interface TournamentType {
    name: string;
    website: string | null;
    years: string
}

interface TournamentVenues {
    venue: string;
    city: string;
    country: {
        name: string;
        alpha2: string | null;
        id: string
    };
    start: string;
    end: string;
}

interface TournamentNames {
    name: string | null;
    start: string;
    end: string;
}

declare global {
    type CurrencyType = 'AUD' | 'EUR' | 'GBP' | 'USD';

    type StatusType = 'WC' | 'AL' | 'LL' | 'Q' | 'PR' | 'SE'

    interface TournamentDetails {
        tournament: TournamentType;
        names: TournamentNames[];
        venues: TournamentVenues[];
        events: Pick<Event, 'year' | 'winner' | 'loser' | 'sets' | 'tbs' | 'eid' | 'incomplete'>[];
    }

    interface MatchPlayer {
        id: string;
        name: string;
        country: {
            id: string;
            alpha2: string | null;
            name: string;
        };
        seed: string | null;
        status: StatusType | null;
        sets: (string | null)[];
        tbs: (string | null)[];
        incomplete: IncompleteType | null;
    }

    interface LongType {
        low: number;
        high: number;
    }

    interface MatchType {
        name: string;
        tid: string;
        eid: string;
        mid: string;
        year: string;
        surface: string;
        round: RoundType;
        date: string | null;
        dates: string;
        court: string | null;
        duration: string | null;
        incomplete: IncompleteType | null;
        umpire: string | null;
        winner: Omit<MatchPlayer, 'incomplete'>;
        winner_id: string;
        loser: MatchPlayer;
        p1: MatchPlayer;
        p2: MatchPlayer;
        sets: (string | null)[];
        tbs: (string | null)[];
        aces: number[];
        dfs: number[];
        serve1: number[];
        serve2: number[];
        bps_saved: number[];
        ret1: number[];
        ret2: number[];
        bps_converted: number[];
        winners: number[];
        ues: number[];
        net: number[];
        max_speed: number[];
        avg1_speed: number[];
        avg2_speed: number[];
    }

    type MatchDetails = Omit<MatchType, 'winner' | 'loser' | 'tid' | 'eid' | 'year' | 'sets' | 'tbs'>

    interface H2HType {
        p1: Pick<PlayerType, 'id' | 'name' | 'country' | 'wl' | 'wl_pc' | 'pm' | 'rh' | 'bh' | 'pro' | 'titles' | 'dob' | 'height' | 'ch'>;
        p2: Pick<PlayerType, 'id' | 'name' | 'country' | 'wl' | 'wl_pc' | 'pm' | 'rh' | 'bh' | 'pro' | 'titles' | 'dob' | 'height' | 'ch'>;
        matches: Pick<MatchType, 'mid' | 'round' | 'surface' | 'name' | 'tid' | 'eid' | 'winner_id' | 'year' | 'sets' | 'tbs' | 'incomplete'>[];
    }

    type SearchResultKeyType = 'players' | 'tournaments' | 'coaches' | 'countries' | 'venues' | 'surfaces' | 'supervisors' | 'umpires';

    interface SearchResultsType extends Record<SearchResultKeyType, any> {
        players?: Pick<PlayerType, 'id' | 'name' | 'country'>[];
        surfaces?: string[];
        supervisors?: string[];
        umpires?: string[];
        countries?: {
            id: string;
            name: string;
            alpha2: string | null;
        }[],
        coaches?: {
            id: string;
            name: string | null;
        }[],
        tournaments?: {
            id: string;
            name: string;
        }[],
        venues?: {
            name: string;
            city: string;
            country: {
                id: string;
                name: string;
                alpha2: string | null
            };
        }[]
    }

    interface UmpireSearchResultsType {
        name: string;
        tid: string;
        eid: string;
        year: string;
        rounds: {
            round: RoundType;
            matches: {
                mid: string;
                p1: string;
                p2:string
            }[]
        }[]
    }
}

export {}