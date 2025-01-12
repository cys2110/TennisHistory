declare global {
    interface PlayerDetailsType {
        ch: string | null;
        ch_date: string | null;
        wl: string;
        titles: string;
        pm: string;
        coaches: {
            elementId: string;
            identity: {
                low: number;
                high: number;
            };
            labels: string[];
            properties: {
                bh1?: boolean | null;
                career_high?: {
                    low: number;
                    high: number;
                } | null;
                ch_date?: {
                    year: number;
                    month: number;
                    day: number;
                } | null;
                first_name?: string;
                dob?: {
                    year: number;
                    month: number;
                    day: number;
                } | null;
                gladiator?: boolean;
                height_cm?: {
                    low: number;
                    high: number;
                } | null;
                id: string;
                last_name?: string;
                loss?: {
                    low: number;
                    high: number;
                };
                pm_USD?: {
                    low: number;
                    high: number;
                };
                rh?: boolean | null;
                win?: {
                    low: number;
                    high: number;
                };
                titles?: {
                    low: number;
                    high: number;
                };
            };
        }[];
        plays: boolean | null;
        bh: boolean | null;
        height: {
            low: number;
            high: number;
        } | null;
        country_id: string;
        country_name: string;
        countries: {
            id: string;
            name: string;
            dates: string;
        }[];
        years_active: string | null;
        active_years: string | null;
        age: string | null;
        dob: string | null;
        gladiator: boolean;
    }

    type MajorTournaments = "ao" | "rg" | "wimbledon" | "us";

    interface PlayerBestResultsType {
        tname: string;
        tid: string;
        round: string;
        events: {
            eid: string;
            year: string;
        }[];
    }

    interface ActivityMatchType {
        round: string;
        match_no: string;
        incomplete: string | null;
        country: string | null;
        id: string | null;
        name: string | null;
        seed: string | null;
        status: string | null;
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
        start: string;
        end: string;
        category: string | null;
        city: string;
        country: string;
        surface: string;
        seed: string | null;
        status: string | null;
        rank: string | null;
        points: string | null;
        pm: string | null;
        currency: string | null;
        matches: ActivityMatchType[];
    }

    interface TitlesFinalsType {
        year: string;
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

export {};
