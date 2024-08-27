import { DateTime, Duration } from "luxon";
import convert from "convert";

export const headshot = (player: string) => {
  return new URL(
    `https://www.atptour.com/-/media/alias/player-headshot/${player}`
  ).href;
};

export const gladiator = (player: string) => {
  return new URL(
    `https://www.atptour.com/-/media/alias/player-gladiator-headshot/${player}`
  ).href;
};

export const category = (category: string) => {
  return new URL(`../assets/category/${category}.svg`, import.meta.url).href;
};

export const flag = (country: string) => {
  return new URL(`../assets/flags/${country}.svg`, import.meta.url).href;
};

export const formatCurrency = (currency: string, amount: number) => {
  return amount.toLocaleString("en-gb", {
    style: "currency",
    currency: currency,
  });
};

export const formattedDates = (start: Date, end: Date) => {
  const startDate = DateTime.fromISO(start);
  const endDate = DateTime.fromISO(end);

  if (startDate.year !== endDate.year) {
    return `${startDate.setLocale("gb").toFormat("dd MMMM yyyy")} - ${endDate
      .setLocale("gb")
      .toFormat("dd MMMM yyyy")}`;
  } else if (startDate.month !== endDate.month) {
    return `${startDate.setLocale("gb").toFormat("dd MMMM")} - ${endDate
      .setLocale("gb")
      .toFormat("dd MMMM yyyy")}`;
  } else {
    return `${startDate.day} - ${endDate
      .setLocale("gb")
      .toFormat("dd MMMM yyyy")}`;
  }
};

export const formatDate = (ISODate: Date) => {
  const date = DateTime.fromISO(ISODate);
  return date.setLocale("gb").toLocaleString(DateTime.DATE_HUGE);
};

export const smallDate = (ISOdate: Date) => {
  const date = DateTime.fromISO(ISOdate);
  return date.setLocale("gb").toLocaleString(DateTime.DATE_SHORT);
};

export const formatTime = (time: number) => {
  const minutes = Duration.fromObject({ minutes: time });
  return minutes.toFormat("hh:mm");
};

export const convertToFt = (cm: number) => {
  const ftDecimal = convert(cm, "cm").to("ft");
  const ft = Math.floor(ftDecimal);
  const inches = Math.round((ftDecimal - ft) * 12);
  return `${ft}'${inches}"`;
};

export const percentage = (value1: number, total: number) => {
  return (value1 / total) * 100;
};

export const encodeName = (name: string) => {
  return name.replace(/ /g, "_");
};

export const unencodeName = (name: string) => {
  return name.replace(/_/g, " ");
};

export const plays = (hand: boolean) => {
  return hand ? "Right-handed" : "Left-handed";
};

export const bh = (value: boolean) => {
  return value ? "One-handed" : "Two-handed";
};

export const getTieBreak = (score1: number, score2: number) => {
  return score1 > score2 ? score2 : score1;
};

export const incomplete = (status: string) => {
  switch (status) {
    case "R":
      return "ret.";
    case "D":
      return "def.";
    case "WO":
      return "walkover";
    case "B":
      return "bye";
  }
};

export const round = (roundNumber: string) => {
  switch (roundNumber) {
    case "Round of 128":
      return "R128";
    case "Round of 64":
      return "R64";
    case "Round of 32":
      return "R32";
    case "Round of 16":
      return "R16";
    case "Quarterfinals":
      return "QF";
    case "Semifinals":
      return "SF";
    case "Final":
      return "F";
  }
};
