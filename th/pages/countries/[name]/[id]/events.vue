<script setup lang="ts">
import { CountryEventsGrid, CountryEventsTable } from "#components"

definePageMeta({ name: "country-events" })
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
useHead({ title: () => `Events | ${name.value}`, templateParams: { subPage: "Countries" } })

// API call
const { data: events, status } = await useFetch<Pick<EventInterface, "id" | "year" | "tournament" | "venues" | "tours">[]>("/api/countries/events", {
  query: { id: params.id },
  default: () => []
})

const relatedPages = [
  {
    label: "Overview",
    to: { name: "country" },
    icon: icons.overview
  },
  {
    label: "Players",
    to: { name: "country-players" },
    icon: icons.player
  }
]
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <u-button
        v-for="page in relatedPages"
        :key="page.label"
        :to="page.to"
        :size="mdAndDown ? 'xs' : 'sm'"
        :icon="page.icon"
        :label="mdAndDown ? undefined : page.label"
      />
    </template>

    <component
      :is="viewMode === 'list' ? CountryEventsTable : CountryEventsGrid"
      :key="viewMode"
      :events
      :status
    />
  </page-wrapper>
</template>
