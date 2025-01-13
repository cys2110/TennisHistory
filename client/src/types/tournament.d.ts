import type { Countries } from "./enums";

declare global {
    interface TournamentEventType {
        eid: string;
        name: string | null;
        venue: string;
        year: string;
        match_no: string;
        winner_name: string | null;
        winner_id: string | null;
        winner_country: Countries | null;
        loser_name: string | null;
        loser_id: string | null;
        loser_country: Countries | null;
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

    interface TournamentType {
        website: string | null;
        name: string;
        years: string;
        names: string[];
        venues: {
            name: string;
            city: string;
            country: Countries;
        }[];
    }
}

export {};
