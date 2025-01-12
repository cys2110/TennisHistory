import type { Categories, Countries, Surfaces } from "./enums";

declare global {
    interface EventCardType {
        year: string;
        surface: Surfaces;
        tid: string;
        tname: string;
        city: string;
        country: Countries;
        start: string;
        dates: string | null;
        eid: string;
        category: Categories | null;
        ename: string | null;
    }
}

export {};
