import { Duration } from "luxon";

export const getCountryCode = (country) => {
    const key = Object.keys(COUNTRY_CODES).find((key) => COUNTRY_CODES[key] === country);
    return key || false;
};

export const getLongDates = (start, end) => {
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

export const formatTime = (time) => {
    const minutes = Duration.fromObject({ minutes: time.low });
    return minutes.toFormat("hh:mm");
};

export const percentage = (value1, total) => parseInt(((value1 / total) * 100).toFixed(0));

export const encodeName = (name) => name.replace(/ /g, "_");

export const unencodeName = (name) => name.replace(/_/g, " ");
