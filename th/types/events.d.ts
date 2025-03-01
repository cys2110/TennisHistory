declare global {
    type IncompleteType = 'WO' | 'R' | 'B' | 'Def'

    interface Event {
        year: string;
        surface: string;
        tid: string;
        eid: string;
        name: string;
        ename: string | null;
        venue: string;
        city: string;
        country: {
            id: string;
            alpha2: string;
            name: string;
        };
        category: string | null;
        draw: string;
        start: string;
        dates: string;
        currency: CurrencyType | null;
        tfc: string | null;
        pm: string | null;
        winner: {
            id: string;
            name: string;
            country: {
                id: string;
                alpha2: string | null;
                name: string;
            };
        } | null;
        loser: {
            id: string;
            name: string;
            country: {
                id: string;
                alpha2: string | null;
                name: string;
            };
        } | null;
        sets: (string | null)[];
        tbs: (string | null)[];
        incomplete: IncompleteType | null;
        supervisors: string[]
    }

    type EventCard = Omit<Event, 'currency' | 'winner' | 'loser' | 'sets' | 'tbs' | 'incomplete' | 'venue' | 'pm' | 'tfc' | 'supervisors'>;

    type EventDetailsType = Pick<Event, 'ename' | 'category' | 'draw' | 'surface' | 'venue' | 'city' | 'country' | 'dates' | 'tfc' | 'pm' | 'currency' | 'supervisors'>

    interface EventAwardType {
        round: RoundType;
        pm: string | null;
        points: string | null;
        currency: CurrencyType | null;
    }

    interface EventSeedType {
        id: string;
        name: string;
        last: string;
        country: {
            id: string;
            name: string;
            alpha2: string | null;
        };
        seed: string;
        rank1: string | null;
        rank2: string | null;
        withdrew: boolean;
    }

    interface EventEntryInfoType {
        label: string;
        content: {
            id: string;
            name: string;
            country: {
                id: string;
                name: string;
                alpha2: string | null;
            };
            rank?: string;
            reason?: string;
            status?: StatusType | null;
        }[]
    }

    interface EventEntryType {
        id: string;
        name: string;
        last: string;
        country: {
            id: string;
            name: string;
            alpha2: string | null;
        };
        rank: string | null;
        seed: string | null;
        status: StatusType | null;
        withdrew: boolean | string;
    }

    type RoundType = 'Round of 128' | 'Round of 64' | 'Round of 32' | 'Round of 16' | 'Quarterfinals' | 'Semifinals' | 'Final' | 'Win'

    interface EventResultsType {
        title: RoundType;
        matches: Pick<MatchType, 'mid' | 'date' | 'court' | 'duration' | 'incomplete' | 'umpire' | 'winner' | 'loser'>[];
    }
}

export {}