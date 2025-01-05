import type { SearchResultKeysEnum } from "./enums";

declare global {
    interface SearchResultsType {
        [SearchResultKeysEnum.PLAYERS]: {
            id: string;
            name: string;
            country: string;
        }[];
        [SearchResultKeysEnum.SURFACES]: string[];
        [SearchResultKeysEnum.SUPERVISORS]: string[];
        [SearchResultKeysEnum.UMPIRES]: string[];
        [SearchResultKeysEnum.TOURNAMENTS]: {
            id: string;
            name: string;
        }[];
        [SearchResultKeysEnum.COUNTRIES]: {
            id: string;
            name: string;
        }[];
        [SearchResultKeysEnum.VENUES]: {
            name: string;
            city: string;
            country: string;
        }[];
        [SearchResultKeysEnum.COACHES]: {
            id: string;
            name: string | null;
        }[];
    }
}

export {};
