export const ATP_CATEGORIES: CategoryType[] = [
  "Grand Slam",
  "ATP Finals",
  "ATP Masters 1000",
  "ATP 500",
  "ATP 250",
  "Next Gen ATP Finals",
  "Laver Cup",
  "ATP Challenger 125",
  "ATP Challenger 100",
  "ATP Challenger 75",
  "ATP Challenger 50",
  "ATP Cup",
  "ATP Masters Series",
  "ATP International Series Gold",
  "ATP International Series",
  "ATP World Series",
  "ATP Super 9",
  "ATP Championship Series",
  "ATP Championship Series, Single Week",
  "World Team Cup",
  "Grand Slam Cup",
  "ILTF",
  "NTL",
  "Grand Prix"
]

export const WTA_CATEGORIES: CategoryType[] = [
  "Grand Slam",
  "WTA Finals",
  "WTA 1000",
  "WTA 500",
  "WTA 250",
  "WTA 125",
  "ATP Cup",
  "WTA Elite Trophy",
  "WTA Premier Mandatory",
  "WTA Premier Five",
  "WTA Premier",
  "WTA International Tournaments",
  "ILTF",
  "NTL"
]

export const ATP_CHALLENGER_CATEGORIES: CategoryType[] = ["ATP Challenger 125", "ATP Challenger 100", "ATP Challenger 75", "ATP Challenger 50"]

export const WTA_CHALLENGER_CATEGORIES: CategoryType[] = ["WTA 125"]

export const CHALLENGER_CATEGORIES: CategoryType[] = [...ATP_CHALLENGER_CATEGORIES, ...WTA_CHALLENGER_CATEGORIES]

export const ITF_MEN_CATEGORIES: CategoryType[] = ["Davis Cup", "Olympics", "ITF M25", "ITF"]

export const ITF_WOMEN_CATEGORIES: CategoryType[] = ["Billie Jean King Cup", "Olympics", "ITF", "ITF W75"]

export const MASTERS_CATEGORIES: CategoryType[] = [
  "ATP Masters 1000",
  "ATP Masters Series",
  "ATP Championship Series",
  "ATP Championship Series, Single Week",
  "WTA 1000",
  "WTA Premier Mandatory"
]

export const MONTHS: MonthType[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

export const MONTHS_SERVER: Record<MonthType, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
}
