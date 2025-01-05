declare global {
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
        country: string;
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
        round: string;
        surface: string;
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
}

export {};
