import type { CategoryEnum, CountriesEnum, CurrencyEnum, RoundEnum, StatusEnum } from "./enums";

declare global {
    interface Event {
        year: string;
        surface: SurfaceEnum;
        tid: string;
        name: string;
        city: string;
        country: CountriesEnum;
        start: string;
        dates: string;
        eid: string;
        category: CategoryEnum | null;
        ename: string | null;
		venue: string | null;
		draw: string;
		tfc: string | null;
		pm: string | null;
		currency: CurrencyEnum | null;
		supervisors: string[];
    }

	type EventDetailsType = Pick<Event, "name" | "surface" | "venue" | "city" | "country" | "category" | "draw" | "dates" | "tfc" | "pm" | "currency" | "ename" | "supervisors">;

	interface EventAwardsType {
		round: RoundEnum;
		pm: string;
		points: string;
		currency: CurrencyEnum;
	}

	interface EventSeedType {
		id: string;
		name: string;
		last: string;
		country: CountriesEnum;
		seed: string;
		rank: string;
	}

	interface EventEntryInfoType {
		label: string;
		content: {
			id: string;
			name: string;
			country: CountriesEnum;
			rank?: string;
			reason?: string;
		}[];
	}

	interface EventEntryType {
		id: string;
		name: string;
		last: string;
		country_id: CountriesEnum;
		country_name: string;
		rank: string;
		seed: string | null;
		status: StatusEnum | null;
	}

	interface EventResultsMatchType {
		mid: string;
		date: string | null;
		court: string | null;
		duration: string | null;
		incomplete: string | null;
		umpire: string | null;
		winner_id: string;
		winner_name: string;
		winner_country: CountriesEnum;
		winner_seed: string | null;
		winner_status: string | null;
		loser_id: string | null;
		loser_name: string | null;
		loser_country: CountriesEnum | null;
		loser_seed: string | null;
		loser_status: string | null;
		loser_incomplete: string | null;
		ws1: string | null;
		ls1: string | null;
		ws2: string | null;
		ls2: string | null;
		ws3: string | null;
		ls3: string | null;
		ws4: string | null;
		ls4: string | null;
		ws5: string | null;
		ls5: string | null;
		wt1: string | null;
		lt1: string | null;
		wt2: string | null;
		lt2: string | null;
		wt3: string | null;
		lt3: string | null;
		wt4: string | null;
		lt4: string | null;
		wt5: string | null;
		lt5: string | null;
	}

	interface EventResultsType {
		title: RoundEnum;
		matches: EventResultsMatchType[];
	}

	interface EventDrawPlayerType {
		id: string;
		name: string;
		country: CountriesEnum;
		seed: string | null;
		rank: string | null;
		status: string | null;
		incomplete: string | null;
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
	}

	interface EventDrawMatchType {
		mid: string;
		incomplete: string | null;
		winner: string | null;
		p1: EventDrawPlayerType;
		p2: EventDrawPlayerType;
	}

	interface EventDrawType {
		round: RoundEnum;
		number: string;
		matches: EventDrawMatchType[];
	}

    interface MatchPlayerType {
		id: string;
		name: string;
		country: CountriesEnum;
		seed: string | null;
		status: string | null;
		rank: string | null;
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

	interface MatchStatsType {
		name: string;
		p1: string;
		p1_pc: {
			low: number;
			high: number;
		};
		p2: string;
		p2_pc: {
			low: number;
			high: number;
		};
	}

	interface MatchType {
		name: string;
		round: RoundEnum;
		surface: string;
		dates: string;
		date: string | null;
		court: string | null;
		umpire: string | null;
		duration: string | null;
		winner: string;
		p1: MatchPlayerType;
		p2: MatchPlayerType;
		service_speed: {
            name: string;
            p1: {
                low: number;
                high: number;
            };
            p2: {
                low: number;
                high: number;
            };
        }[] | null;
		return: MatchStatsType[];
		points: MatchStatsType[];
		points_extra: MatchStatsType[];
		service_stats: MatchStatsType[];
	}
}

export {}