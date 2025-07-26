import appConfig from "~/app.config"

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

export const shortDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "numeric",
  year: "2-digit"
})

export const getTourColor = (tours: TourType[]) => {
  if (tours.length === 1) {
    return tours[0]?.toLowerCase() as keyof typeof appConfig.ui.colors
  }
  return "joint"
}
