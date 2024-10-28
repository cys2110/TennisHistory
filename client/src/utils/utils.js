import { DateTime, Duration } from "luxon";
import convert from "convert";

export const encodeName = (name) => {
  return name.replace(/ /g, "_");
};

export const unencodeName = (name) => {
  return name.replace(/_/g, " ");
};

export const percentage = (value1, total) => {
  return (value1 / total) * 100;
};

export const formatCurrency = (currency, amount) => {
  return amount.toLocaleString("en-gb", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  });
};

export const formattedDates = (start, end) => {
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

export const formatDate = (ISODate) => {
  const date = DateTime.fromISO(ISODate);
  return date.setLocale("gb").toLocaleString(DateTime.DATE_HUGE);
};

export const smallDate = (ISOdate) => {
  const date = DateTime.fromISO(ISOdate);
  return date.setLocale("gb").toLocaleString(DateTime.DATE_SHORT);
};

export const formatTime = (time) => {
  const minutes = Duration.fromObject({ minutes: time });
  return minutes.toFormat("hh:mm");
};

export const convertToFt = (cm) => {
  const ftDecimal = convert(cm, "cm").to("ft");
  const ft = Math.floor(ftDecimal);
  const inches = Math.round((ftDecimal - ft) * 12);
  return `${ft}'${inches}"`;
};
