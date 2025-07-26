import appConfig from "~/app.config"

export const convertToFt = (height: number) => {
  const ftDecimal = convert(height, "cm").to("ft")
  const ft = Math.floor(ftDecimal)
  const inches = Math.round((ftDecimal - ft) * 12)
  return `${ft}' ${inches}"`
}

export const constructMid = (match_no: number, labels: string[]) => {
  const genderPrefix =
    labels.includes("WTA") ? "l"
    : labels.includes("ATP") ? "g"
    : labels.includes("Men") ? "m"
    : "w"
  const typePrefix = labels.includes("Singles") ? "s" : "d"
  const drawTypePrefix = labels.includes("Main") ? "m" : "q"
  const suffix =
    match_no < 10 ? `00${match_no}`
    : match_no < 100 ? `0${match_no}`
    : match_no
  return `${drawTypePrefix}${genderPrefix}${typePrefix}${suffix}`
}

export const getDate = (date: DateType) => {
  return new Date(date.year, date.month - 1, date.day)
}

export const getFlagCode = (country: CountryInterface) => {
  const countryMapping: Record<string, string> = {
    HKG: "hong-kong-sar-china",
    GBR: "united-kingdom",
    TCH: "czechia",
    FRG: "germany",
    CIV: "cote-divoire"
  }

  if (countryMapping[country.id]) {
    return `twemoji:flag-${countryMapping[country.id]}`
  } else if (country.id === "URS") {
    return "circle-flags:soviet-union"
  } else if (country.alpha2) {
    return `twemoji:flag-${country.name.toLowerCase().replace(/ /g, "-")}`
  } else {
    return `flags:${country.id}`
  }
}

export const getLinkColor = (tours: TourType[]) => {
  if (tours.length === 1) {
    return `${tours[0]?.toLowerCase()}-link`
  }
  return "joint-link"
}

export const getTourColor = (tours: TourType[]) => {
  if (tours.length === 1) {
    return tours[0]?.toLowerCase() as keyof typeof appConfig.ui.colors
  }
  return "joint"
}

export const handedness = (handedness: boolean) =>
  handedness === true ? "Right-Handed"
  : handedness === false ? "Left-Handed"
  : "Unknown"
