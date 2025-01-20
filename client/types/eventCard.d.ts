declare global {
    interface EventCardType {
        year: string;
        surface: string;
        tid: string;
        tname: string;
        city: string;
        country: CountriesEnum;
        start: string;
        dates: string | null;
        eid: string;
        category: string | null;
        ename: string | null;
    }
}

export {};
