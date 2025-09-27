export const convertDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return { hours, minutes, seconds: remainingSeconds }
}

export const destructureMid = (mid: string) => {
  const parts = mid.split("")
  const [drawPart, tourPart, typePart, ...numberParts] = parts
  const draw = drawPart === "m" ? "Main" : "Qualifying"
  const tour = tourPart === "l" ? "WTA" : tourPart === "g" ? "ATP" : tourPart === "w" ? "Women" : "Men"
  const type = typePart === "d" ? "Doubles" : "Singles"
  const number = numberParts.join("").trim()
  return { draw, tour, type, match_no: Number(number) }
}

export const getCorrectTours = (tours: TourType[]) => tours.map(tour => tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)"))

export const percentage = (value1: number, value2: number) => Math.round((value1 / value2) * 100)
