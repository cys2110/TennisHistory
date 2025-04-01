export const convertToFt = (height: number) => {
  const ftDecimal = convert(height, "cm").to("ft")
  const ft = Math.floor(ftDecimal)
  const inches = Math.round((ftDecimal - ft) * 12)
  return `${ft}' ${inches}"`
}

export const decodeName = (name: string) => name.replace(/_/g, " ")

export const encodeName = (name: string) => name.replace(/ /g, "_")

export const handedness = (handedness: boolean) => (handedness === true ? "Right-Handed" : handedness === false ? "Left-Handed" : "Unknown")

export const percentage = (value1: number, value2: number) => Math.round((value1 / value2) * 100)
