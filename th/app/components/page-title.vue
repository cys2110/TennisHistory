<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui"

const {
  ui: { icons }
} = useAppConfig()
const { name: routeName } = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: useSSRWidth() })
const mdAndUp = breakpoints.greaterOrEqual("md")

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const crumbs: BreadcrumbItem[] = [{ label: "Home", icon: ICONS.home, to: { name: "home" } }]

  switch (routeName) {
    case "about":
      crumbs.push({ label: "About", icon: icons.info, to: { name: "about" } })
      break
    case "countries":
      crumbs.push({ label: "Countries", icon: ICONS.countries, to: { name: "countries" } })
      break
    case "results-archive":
      crumbs.push({ label: "Results Archive", icon: ICONS.event, to: { name: "results-archive" } })
      break
    case "players":
      crumbs.push({ label: "Players", icon: ICONS.player, to: { name: "players" } })
      break
    case "tournaments":
      crumbs.push({ label: "Tournaments", icon: ICONS.tournament, to: { name: "tournaments" } })
      break
    default:
      break
  }

  return crumbs
})

const pageTitle = computed(() => {
  switch (routeName) {
    default:
      return capitalCase(routeName)
  }
})
</script>

<template>
  <u-breadcrumb
    v-if="mdAndUp"
    :items="breadcrumbs"
  />

  <div
    v-else
    class="font-semibold text-muted text-wrap text-sm"
  >
    {{ pageTitle }}
  </div>
</template>
