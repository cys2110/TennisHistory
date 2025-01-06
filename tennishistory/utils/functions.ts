import { Duration } from "luxon";

export const getCountryCode = (country: string) => {
	const key = Object.keys(COUNTRY_CODES).find((key) => COUNTRY_CODES[key as keyof typeof COUNTRY_CODES] === country);
	return key || false;
};

export const getLongDates = (start: any, end: any) => {
	const {
		day: { low: sDay },
		month: { low: sMonth },
		year: { low: sYear }
	} = start;
	const {
		day: { low: eDay },
		month: { low: eMonth },
		year: { low: eYear }
	} = end;
	if (sYear !== eYear) {
		return `${sDay} ${MONTHS[sMonth - 1]} ${sYear} - ${eDay} ${MONTHS[eMonth - 1]} ${eYear}`;
	} else if (sMonth !== eMonth) {
		return `${sDay} ${MONTHS[sMonth - 1]} - ${eDay} ${MONTHS[eMonth - 1]} ${eYear}`;
	} else {
		return `${sDay} - ${eDay} ${MONTHS[eMonth - 1]} ${eYear}`;
	}
};

export const formatTime = (time: any) => {
	const minutes = Duration.fromObject({ minutes: time.low });
	return minutes.toFormat("hh:mm");
};

export const percentage = (value1: number, total: number) => parseInt(((value1 / total) * 100).toFixed(0));

export const encodeName = (name: string) => name.replace(/ /g, "_");

export const unencodeName = (name: string) => name.replace(/_/g, " ");

export const handedness = (rh: boolean | null) => {
	switch (rh) {
		case true:
			return "Right-handed";
		case false:
			return "Left-handed";
		default:
			"—";
	}
};

export const bh = (bh: boolean | null) => {
	switch (bh) {
		case true:
			return "One-handed";
		case false:
			return "Two-handed";
		default:
			"—";
	}
};
