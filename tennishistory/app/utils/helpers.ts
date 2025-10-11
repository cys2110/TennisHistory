import appConfig from "~/app.config"

export const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

export const constructMid = (match_no: number, tour: TourType, type: MatchType, draw: DrawType) => {
  const genderPrefix = tour === "WTA" ? "l" : tour === "ATP" ? "g" : tour === "Men" ? "m" : "w"
  const typePrefix = type === "Singles" ? "s" : "d"
  const drawTypePrefix = draw === "Main" ? "m" : "q"
  const suffix = match_no < 10 ? `00${match_no}` : match_no < 100 ? `0${match_no}` : match_no
  return `${drawTypePrefix}${genderPrefix}${typePrefix}${suffix}`
}

export const convertToFt = (height: number) => {
  const ftDecimal = convert(height, "cm").to("ft")
  const ft = Math.floor(ftDecimal)
  const inches = Math.round((ftDecimal - ft) * 12)
  return `${ft}' ${inches}"`
}

export const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric"
})

export const filterIncludesString = (row: any, columnId: string, filterValue: string[]) => {
  const rowValue = row.getValue(columnId)
  if (filterValue.length === 0 || filterValue.includes(rowValue)) {
    return true
  }
  return false
}

export const filterIncludesName = (row: any, columnId: string, filterValue: string[]) => {
  const rowValue = row.getValue(columnId).map((name: string) => {
    const nameArray = name.split(", ")
    return `${nameArray[1]} ${nameArray[0]}`
  })
  if (filterValue.length === 0 || filterValue.some(value => rowValue.includes(value))) {
    return true
  }
  return false
}

export const filterIncludesNameString = (row: any, columnId: string, filterValue: string[]) => {
  const rowValue = row.getValue(columnId).split(", ")
  if (filterValue.length === 0 || filterValue.includes(`${rowValue[1]} ${rowValue[0]}`)) {
    return true
  }
  return false
}

export const getAge = (age: { months: number; days: number }) => {
  const years = Math.floor(age.months / 12)
  const months = age.months % 12
  const days = age.days
  return `${years} years, ${months} months, ${days} days`
}

export const getColour = (index: number) => CATEGORY_COLOURS[index % CATEGORY_COLOURS.length]

export const getDate = (date: DateType) => new Date(date.year, date.month - 1, date.day)

export const getDrawColour = (draw: DrawType) => draw.toLowerCase() as keyof typeof appConfig.ui.colors

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

export const getMatchTypeColour = (type: MatchType) => type.toLowerCase() as keyof typeof appConfig.ui.colors

export const handedness = (handedness: boolean | undefined | null) =>
  handedness === true ? "Right-Handed" : handedness === false ? "Left-Handed" : "Unknown"

export const shortDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "numeric",
  year: "2-digit"
})

export const getTourColour = (tours: TourType | TourType[]) => {
  if (!Array.isArray(tours) || tours.length === 1) {
    const tour = Array.isArray(tours) ? tours[0] : tours
    return tour?.replace("ITF (M)", "men").replace("ITF (W)", "women").toLowerCase() as keyof typeof appConfig.ui.colors
  }
  return "primary"
}
