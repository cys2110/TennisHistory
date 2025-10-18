import type appConfig from "~/app.config"

export const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric"
})

export const filterIncludesString = (row: any, columnId: string, filterValue: string[]) => {
  const rowValue = row.getValue(columnId)
  if (filterValue.length === 0 || filterValue.includes(rowValue)) return true

  return false
}

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

export const getTourColour = (tours: TourEnum | TourEnum[]) => {
  if (!Array.isArray(tours) || tours.length === 1) {
    const tour = Array.isArray(tours) ? tours[0] : tours
    return tour?.replace("ITF (M)", "Men").replace("ITF (W)", "Women") as keyof typeof appConfig.ui.colors
  }
  return "primary"
}
