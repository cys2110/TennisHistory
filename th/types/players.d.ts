declare global {
    interface PlayerType {
        id: string;
        name: string;
        country: {
            id: string;
            alpha2: string | null;
            name: string;
        },
        wl: string;
        wl_pc: string;
        pm: string;
        rh: boolean;
        bh: string;
        pro: string;
        titles: string;
        dob: string | null;
        height: string | null;
        ch: string | null;
        ch_date: string | null;
        age: string | null;
        hof: string | null;
        dod: string | null;
        gladiator: boolean;
        active_years: string;
        years_total: string;
        coaches: {
            id: string;
            name: string | null;
        }[];
        countries: {
            id: string;
            name: string;
            alpha2: string | null;
            dates: string
        }[];
    }

    interface MajorResultsType {
        name: string;
        tid: string;
        round: RoundType;
        events: {
            year: string;
            eid: string;
        }[]
    }

    interface WLIndexType {
        category: string;
        stat: string;
        wins: string;
        losses: string;
        titles: string | null;
        value: number;
    }

    interface PlayerTitlesType {
        name: string;
        eid: string;
        tid: string;
        surface: string;
        date: string
    }

    interface TitlesAndFinalsType {
        title: string;
        events: PlayerTitlesType[]
    }

    interface PlayerStatsType {
        category: string;
        value: string;
        suffix?: boolean;
    }

    interface PlayerActivityStats {
        category: string;
        value: string;
    }

    interface PlayerActivityOpponentType {
        round: RoundType;
        match_no: string;
        incomplete: IncompleteType | null;
        country: {
            id: string;
            alpha2: string | null;
            name: string;
        };
        id: string;
        name: string;
        seed: string;
        status: StatusType | null;
        rank: string | null;
        winner: string;
        sets: string[];
        tbs: string[];
        player_incomplete: IncompleteType | null;
    }

    interface PlayerActivityType {
        name: string;
        tid: string;
        eid: string;
        ename: string | null;
        dates: string;
        category: string | null;
        city: string;
        country: {
            id: string;
            name: string;
            alpha2: string | null;
        };
        surface: string;
        seed: string | null;
        status: StatusType | null;
        rank: string | null;
        points: string | null;
        pm: string | null;
        currency: CurrencyType | null;
        matches: PlayerActivityOpponentType[];
    }

    interface PlayerYearType {
        stats: PlayerActivityStats[];
        activity: PlayerActivityType[];
    }
}

export {}