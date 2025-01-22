import type { CountriesEnum, RoundEnum, SearchResultKeyEnum, SurfaceEnum } from "./enums";

declare global {
    type EventCardType = Pick<Event, 'year' | 'surface' | 'tid' | 'name' | 'city' | 'country' | 'start' | 'dates' | 'eid' | 'category' | 'ename'>;

    interface TournamentEventType {
        eid: string;
        year: string;
        match_no: string;
        winner_name: string | null;
        winner_id: string | null;
        winner_country: CountriesEnum | null;
        loser_name: string | null;
        loser_id: string | null;
        loser_country: CountriesEnum | null;
        s1: string | null;
        s2: string | null;
        s3: string | null;
        s4: string | null;
        s5: string | null;
        t1: string | null;
        t2: string | null;
        t3: string | null;
        t4: string | null;
        t5: string | null;
        incomplete: string | null;
    }

    interface TournamentDetailsType {
        name: string;
        website: string | null;
        years: string;
        names: string[];
        venues: {
            name: string;
            city: string;
            country: string;
        }[];
    }

    interface TournamentType {
        tournament: TournamentDetailsType;
        events: TournamentEventType[];
    }

    interface H2HPlayer {
        name: string;
        id: string;
        wl: string;
        wl_pc: {
            low: number;
            high: number;
        };
        pm: {
            low: number;
            high: number;
        };
        rh: boolean | null;
        bh: boolean | null;
        country: CountriesEnum;
        pro: string | null;
        titles: string;
        dob: string | null;
        height: {
            low: number;
            high: number;
        } | null;
        ch: {
            low: number;
            high: number;
        } | null;
    }

    interface H2HMatch {
        tname: string;
        tid: string;
        eid: string;
        mid: string;
        winner: string;
        winner_name: string;
        round: RoundEnum;
        surface: SurfaceEnum;
        year: string;
        s1: string | null;
        s2: string | null;
        s3: string | null;
        s4: string | null;
        s5: string | null;
        t1: string | null;
        t2: string | null;
        t3: string | null;
        t4: string | null;
        t5: string | null;
        incomplete: string | null;
    }

    interface H2H {
        p1: H2HPlayer;
        p2: H2HPlayer;
        matches: H2HMatch[];
    }

    interface SearchResultsType {
        [SearchResultKeyEnum.PLAYERS]: {
            id: string;
            name: string;
            country: CountriesEnum;
        }[];
        [SearchResultKeyEnum.SURFACES]: string[];
        [SearchResultKeyEnum.SUPERVISORS]: string[];
        [SearchResultKeyEnum.UMPIRES]: string[];
        [SearchResultKeyEnum.TOURNAMENTS]: {
            id: string;
            name: string;
        }[];
        [SearchResultKeyEnum.COUNTRIES]: {
            id: CountrieEnum;
            name: string;
        }[];
        [SearchResultKeyEnum.VENUES]: {
            name: string;
            city: string;
            country: CountriesEnum;
        }[];
        [SearchResultKeyEnum.COACHES]: {
            id: string;
            name: string | null;
        }[];
    }
}

export {}