<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui"

const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const {
  name: routeName,
  params: { id, name, year },
  query
} = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")

const apiRoute = computed(() => {
  switch (routeName) {
    case "tournament":
    case "event":
    case "results":
    case "draws":
      return `/api/tournaments/overview?id=${id}`
    default:
      return ""
  }
})

const { data } = await useFetch<any>(() => apiRoute.value)

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const crumbs: BreadcrumbItem[] = [{ label: "Home", icon: icons.home, to: { name: "home" } }]

  switch (routeName) {
    case "results-archive":
      return [...crumbs, { label: "Results Archive", icon: icons.event, to: { name: "results-archive" } }]
    case "tournaments":
    case "tournament":
    case "event":
    case "results":
    case "draws":
      crumbs.push({ label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } })

      if (["tournament", "event", "results", "draws"].includes(routeName)) {
        crumbs.push({ label: data.value?.name || capitalCase(name as string), to: { name: "tournament", params: { id, name } } })

        if (["event", "results", "draws"].includes(routeName)) {
          const eventPage = computed(() => EVENT_PAGES.find(page => page.name === routeName))

          crumbs.push(
            { label: year as string },
            {
              label: eventPage.value?.label || "",
              icon: eventPage.value?.icon
            }
          )
        }
      }

      return crumbs
    default:
      return crumbs
  }
})

const pageTitle = computed(() => {
  switch (routeName) {
    case "results-archive":
      return "Results Archive"
    case "tournaments":
      return "Tournaments"
    default:
      return "Home"
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
    <div v-if="routeName === 'tournament'">
      <div>{{ data.name ?? capitalCase(name as string) }}</div>
      <div>
        <span v-if="data.established">{{ data.established }}</span>
        <span v-if="data.established && !data.abolished"> - present</span>
        <span v-else-if="data.abolished && data.established !== data.abolished"> - {{ data.abolished }}</span>
      </div>
    </div>
    <div v-else-if="['event', 'results', 'draws'].includes(routeName as string)">
      <div>{{ EVENT_PAGES.find(page => page.name === routeName)?.label }}</div>
      <div class="truncate">{{ data.value?.name || capitalCase(name as string) }} {{ year }}</div>
    </div>

    <template v-else>{{ pageTitle }}</template>
  </div>
</template>
