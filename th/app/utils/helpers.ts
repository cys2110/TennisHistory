import appConfig from "~/app.config"

export const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
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

export const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric"
})

export const getDate = (date: DateType) => new Date(date.year, date.month - 1, date.day)

export const getFlagCode = (country: CountryInterface) => {
  const countryMapping: Record<string, string> = {
    HKG: "hong-kong-sar-china",
    GBR: "united-kingdom",
    TCH: "czechia",
    FRG: "germany",
    CIV: "cote-divoire",
    CGO: "congo-brazzaville",
    COD: "congo-kinshasa"
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

export const shortDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "numeric",
  year: "2-digit"
})

export const getTourColour = (tours: TourType[]) => {
  if (tours.length === 1) {
    return tours[0]?.replace("ITF (M)", "men").replace("ITF (W)", "women").toLowerCase() as keyof typeof appConfig.ui.colors
  }
  return "joint"
}
