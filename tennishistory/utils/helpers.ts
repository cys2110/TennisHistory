export const convertToFt = (height: number) => {
  const ftDecimal = convert(height, "cm").to("ft")
  const ft = Math.floor(ftDecimal)
  const inches = Math.round((ftDecimal - ft) * 12)
  return `${ft}' ${inches}"`
}

export const handedness = (rh: boolean) => {
  switch (rh) {
    case true:
      return "Right-handed"
    case false:
      return "Left-handed"
    default:
      return "Unknown"
  }
}

export const percentage = (value1: number, value2: number) => {
  return Math.round((value1 / value2) * 100)
}
