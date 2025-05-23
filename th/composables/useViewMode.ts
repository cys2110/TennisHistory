export function useViewMode() {
  const viewMode = useState<"cards" | "list">("viewMode", () => {
    if (process.server) {
      const cookie = useCookie<"cards" | "list">("viewMode")
      return cookie.value || "cards"
    }

    return "cards"
  })

  const setViewMode = (mode: "cards" | "list") => {
    viewMode.value = mode
    const cookie = useCookie<"cards" | "list">("viewMode")
    cookie.value = mode
  }

  return { viewMode, setViewMode }
}
