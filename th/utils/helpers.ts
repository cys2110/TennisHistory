export const convertToFt = (height: number) => {
  const ftDecimal = convert(height, "cm").to("ft")
  const ft = Math.floor(ftDecimal)
  const inches = Math.round((ftDecimal - ft) * 12)
  return `${ft}' ${inches}"`
}

export const decodeName = (name: string) => name?.replace?.(/_/g, " ") ?? ""

export const encodeName = (name: string) => name.replace(/ /g, "_")

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

let textClass =
  "inline-block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:origin-center after:transition-all after:ease-in-out after:duration-500 hover:after:scale-x-100 "
export const wtaClass = textClass + "text-wta hover:text-wta-700 dark:hover:text-wta-300 after:bg-wta-700 dark:after:bg-wta-300"
export const atpClass = textClass + "text-atp hover:text-atp-800 dark:hover:text-atp-300 after:bg-atp-800 dark:after:bg-atp-300"
const combinedClass =
  textClass + "text-primary dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 after:bg-primary-800 dark:after:bg-primary-300"

export const getTourColours = (tours: string[]) => {
  const hoverClass =
    tours.length === 2 ? combinedClass
    : tours.includes("ATP") ? atpClass
    : wtaClass
  const cardColour: "atp" | "wta" | "primary" =
    tours.length === 2 ? "primary"
    : tours.includes("ATP") ? "atp"
    : "wta"
  return { hoverClass, cardColour }
}

export const handedness = (handedness: boolean) =>
  handedness === true ? "Right-Handed"
  : handedness === false ? "Left-Handed"
  : "Unknown"

export const percentage = (value1: number, value2: number) => Math.round((value1 / value2) * 100)
