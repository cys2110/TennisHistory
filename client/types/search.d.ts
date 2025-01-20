import type { CountriesEnum, SearchResultKeysEnum } from "../utils/enums";

declare global {
    interface SearchResultsType {
        [SearchResultKeysEnum.PLAYERS]: {
            id: string;
            name: string;
            country: CountriesEnum;
        }[];
        [SearchResultKeysEnum.SURFACES]: string[];
        [SearchResultKeysEnum.SUPERVISORS]: string[];
        [SearchResultKeysEnum.UMPIRES]: string[];
        [SearchResultKeysEnum.TOURNAMENTS]: {
            id: string;
            name: string;
        }[];
        [SearchResultKeysEnum.COUNTRIES]: {
            id: CountriesEnum;
            name: string;
        }[];
        [SearchResultKeysEnum.VENUES]: {
            name: string;
            city: string;
            country: CountriesEnum;
        }[];
        [SearchResultKeysEnum.COACHES]: {
            id: string;
            name: string | null;
        }[];
    }
}

export {};
