export const useDefaults = () => {
  const viewMode = useState<"cards" | "list" | "hybrid">("viewMode", () => {
    if (process.server) {
      const cookie = useCookie<"cards" | "list" | "hybrid">("viewMode")
      return cookie.value || "hybrid"
    }

    return "hybrid"
  })

  const setViewMode = (mode: "cards" | "list" | "hybrid") => {
    viewMode.value = mode
    const cookie = useCookie<"cards" | "list" | "hybrid">("viewMode")
    cookie.value = mode
  }

  const tableMode = useState<"grouped" | "ungrouped">("table", () => {
    if (process.server) {
      const cookie = useCookie<"grouped" | "ungrouped">("table")
      return cookie.value || "ungrouped"
    }

    return "ungrouped"
  })

  const setTableMode = (mode: "grouped" | "ungrouped") => {
    tableMode.value = mode
    const cookie = useCookie<"grouped" | "ungrouped">("table")
    cookie.value = mode
  }

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

  return { viewMode, setViewMode, tableMode, setTableMode, itemsPerPage, setItemsPerPage }
}
