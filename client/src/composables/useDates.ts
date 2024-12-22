export function useDates() {
  const startDate = ref<string | null>(null)
  const endDate = ref<string | null>(null)
  const date = ref<string | null>(null)

  const longDates = (start: string, end: string) => {
    startDate.value = start
    endDate.value = end

    const startYear = useDateFormat(start, 'YYYY').value
    const endYear = useDateFormat(end, 'YYYY').value
    const startMonth = useDateFormat(start, 'MMMM').value
    const endMonth = useDateFormat(end, 'MMMM').value

    if (startYear !== endYear) {
      return `${useDateFormat(start, 'DD MMMM YYYY').value} - ${useDateFormat(end, 'DD MMMM YYYY').value}`
    } else if (startMonth !== endMonth) {
      return `${useDateFormat(start, 'DD MMMM').value} - ${useDateFormat(end, 'DD MMMM YYYY').value}`
    } else {
      return `${useDateFormat(start, 'DD').value} - ${useDateFormat(end, 'DD MMMM YYYY').value}`
    }
  }

  return { longDates }
}
