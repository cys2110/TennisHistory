import type { CountriesEnum, CurrencyEnum, RoundEnum, StatusEnum } from "./enums";

declare global {
    interface Player {
        name: string;
        country: CountriesEnum;
        years_active: string | null;
        active_years: string | null;
        gladiator: boolean;
        ch: string | null;
        ch_date: string | null;
        wl: string;
        titles: string;
        pm: string;
        coaches: { id: string; name: string | null }[];
        plays: boolean | null;
        bh: boolean | null;
        height: {
            low: number;
            high: number;
        } | null;
        countries: { id: CountriesEnum; name: string; dates: string }[];
        age: string | null;
        dob: string | null;
        hof: string | null;
        dod: string | null;
    }

    type PlayerName = Pick<Player, 'name' | 'country' | 'years_active' | 'active_years' | 'gladiator'>;

    type PlayerDetails = Pick<Player, 'ch' | 'ch_date' | 'wl' | 'titles' | 'pm' | 'coaches' | 'plays' | 'bh' | 'height' | 'countries' | 'age' | 'dob' | 'hof' | 'dod'>;

    interface PlayerBestResultsType {
        tname: string;
        tid: string;
        round: RoundEnum;
        events: {
            eid: string;
            year: string;
        }[]
    }

    interface ActivityMatchType {
        round: RoundEnum;
        match_no: string;
        incomplete: string | null;
        country: CountriesEnum | null;
        id: string | null;
        name: string | null;
        seed: string | null;
        status: StatusEnum | null;
        rank: string | null;
        winner: string;
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
        player_incomplete: string | null;
    }

    interface PlayerActivityType {
        name: string;
        tid: string;
        eid: string;
        ename: string | null;
        dates: string;
        category: string | null;
        city: string;
        country: CountriesEnum;
        surface: string;
        seed: string | null;
        status: StatusEnum | null;
        rank: string | null;
        points: string | null;
        pm: string | null;
        currency: CurrencyEnum | null;
        matches: ActivityMatchType[];
    }

    interface TitlesFinalsType {
        title: string;
        events: {
            date: string;
            eid: string;
            surface: string;
            tid: string;
            tname: string;
        }[];
    }

    type wlCategory = "Match Record" | "Pressure Points" | "Environment" | "Other";

    type wlStat = "Overall" | "Grand Slams" | "ATP Masters 1000" | "Tie Breaks" | "Versus Top 10" | "Finals" | "Deciding Set" | "5th Set Record" | "Clay" | "Grass" | "Hard" | "Carpet" | "Indoor" | "Outdoor" | "After Winning 1st Set" | "After Losing 1st Set" | "Vs. Right-Handers" | "Vs. Left-Handers";

    interface PlayerWLIndexType {
        category: wlCategory;
        stat: wlStat;
        wins: string;
        losses: string;
        titles?: string | null;
        value: number;
    }

    interface PlayerStatsType {
        category: string;
        value: {
            low: number;
            high: number;
        };
        suffix?: boolean;
    }
}

export {}