export function useDefaultItems() {
  const itemsPerPage = useState<number>("itemsPerPage", () => {
    if (process.server) {
      const cookie = useCookie<number>("itemsPerPage")
      return cookie.value || 20
    }

    return 20
  })

  const setItemsPerPage = (number: number) => {
    itemsPerPage.value = number
    const cookie = useCookie<number>("itemsPerPage")
    cookie.value = number
  }

  return { itemsPerPage, setItemsPerPage }
}
