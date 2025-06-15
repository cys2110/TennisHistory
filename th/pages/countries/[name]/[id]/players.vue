<script setup lang="ts">
import { CountryPlayersGrid, CountryPlayersTable } from "#components"

definePageMeta({ name: "country-players" })
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
useHead({ title: () => `Players | ${name.value}`, templateParams: { subPage: "Countries" } })
const selectedLetter = ref<string>("A")

// API call
const { data: players, status } = await useFetch<Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year" | "tour" | "last_name">[]>(
  "/api/countries/players",
  {
    query: { id: params.id, letter: selectedLetter },
    default: () => []
  }
)

const relatedPages = [
  {
    label: "Overview",
    to: { name: "country" },
    icon: icons.overview
  },
  {
    label: "Events",
    to: { name: "country-events" },
    icon: icons.event
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
      <u-slideover
        v-if="mdAndDown"
        title="Filters"
        class="ml-auto"
      >
        <u-button
          :icon="icons.filter"
          size="xs"
        />
        <template #body>
          <select-letters v-model="selectedLetter" />
        </template>
      </u-slideover>
    </template>
    <template
      #toolbar
      v-if="!mdAndDown"
    >
      <select-letters v-model="selectedLetter" />
    </template>

    <component
      :is="viewMode === 'list' ? CountryPlayersTable : CountryPlayersGrid"
      :key="viewMode"
      :players
      :status
    />
  </page-wrapper>
</template>
