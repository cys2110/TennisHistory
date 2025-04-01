export enum SurfaceEnum {
  Clay = "Clay",
  Grass = "Grass",
  Hard = "Hard",
  Carpet = "Carpet"
}

export const BaseCategoryEnum = {
  "ATP 250": "ATP 250",
  "ATP 500": "ATP 500",
  "ATP Masters 1000": "ATP Masters 1000",
  "Grand Slam": "Grand Slam",
  "ATP Finals": "ATP Finals",
  "Next Gen Finals": "Next Gen Finals",
  "Laver Cup": "Laver Cup",
  "United Cup": "United Cup",
  "Davis Cup": "Davis Cup",
  Olympics: "Olympics"
} as const

export type BaseCategoryEnumType = keyof typeof BaseCategoryEnum

export const CategoryEnum = {
  ...BaseCategoryEnum,
  "ATP Cup": "ATP Cup",
  ITF: "ITF",
  ILTF: "ILTF",
  NTL: "NTL",
  "Grand Prix": "Grand Prix"
} as const

export type CategoryEnumType = keyof typeof CategoryEnum

export enum MonthsEnum {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}
