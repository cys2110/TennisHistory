import { breakpoints } from '../utils/variables'

export function useGlobalBreakpoints() {
  const currentBreakpoint = ref<string | null>(null)

  const breakpointOrder = Object.keys(breakpoints)

  const updateBreakpoint = () => {
    for (const [key, query] of Object.entries(breakpoints)) {
      if (window.matchMedia(query).matches) {
        currentBreakpoint.value = key
        return
      }
    }
    currentBreakpoint.value = null
  }

  onMounted(() => {
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateBreakpoint)
  })

  const isBreakpointOrUp = (key: keyof typeof breakpoints) => {
    const index = breakpointOrder.indexOf(key)
    const currentIndex = currentBreakpoint.value
      ? breakpointOrder.indexOf(currentBreakpoint.value)
      : -1
    return currentIndex >= index
  }

  return {
    currentBreakpoint,
    isBreakpoint: (key: keyof typeof breakpoints) => currentBreakpoint.value === key,
    isBreakpointOrUp,
  }
}
