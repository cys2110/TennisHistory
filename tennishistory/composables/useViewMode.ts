import { useStorage } from "@vueuse/core"

export const useViewMode = () => {
  const viewMode = useStorage("viewMode", "cards")
  return { viewMode }
}
