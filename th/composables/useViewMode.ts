export function useViewMode() {
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

  return { viewMode, setViewMode }
}
