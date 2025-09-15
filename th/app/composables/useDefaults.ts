export const useDefaults = () => {
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

  return { tableMode, setTableMode }
}
