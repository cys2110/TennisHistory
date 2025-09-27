<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const {
  ui: { icons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const lgAndUp = breakpoints.greaterOrEqual("lg")

const searchTerm = ref("")

const navLinks: NavigationMenuItem[] = [
  { label: "Results Archive", to: { name: "results-archive" }, icon: ICONS.event },
  { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament },
  { label: "Players", to: { name: "players" }, icon: ICONS.player },
  { label: "Head to Head", to: { name: "h2h" }, icon: ICONS.h2h },
  { label: "Countries", to: { name: "countries" }, icon: ICONS.countries },
  { label: "Years", to: { name: "years" }, icon: ICONS.year },
  // { label: "Stats/Records", icon: icons.stats, to: { name: "statistics-and-records" } },
  { label: "About", to: { name: "about" }, icon: icons.info }
]

const relatedLinks = [
  {
    label: "Governing Bodies",
    children: [
      { label: "ATP", to: "https://www.atptour.com/", target: "_blank" },
      { label: "WTA", to: "https://www.wtatennis.com/", target: "_blank" },
      { label: "ITF", to: "https://www.itftennis.com/", target: "_blank" }
    ]
  },
  {
    label: "Grand Slams",
    children: [
      { label: "Australian Open", to: "https://www.ausopen.com/", target: "_blank" },
      { label: "Roland Garros", to: "https://www.rolandgarros.com/", target: "_blank" },
      { label: "Wimbledon", to: "https://www.wimbledon.com/", target: "_blank" },
      { label: "US Open", to: "https://www.usopen.org/", target: "_blank" }
    ]
  },
  {
    label: "Other Links",
    children: [
      { label: "About me", to: "https://www.claire-sheridan.com", target: "_blank" },
      { label: "Ranking Rules History", to: "https://openerarankings.com/Home", target: "_blank" },
      { label: "Tennis Abstract", to: "https://www.tennisabstract.com/", target: "_blank" }
    ]
  }
]

const { data: results, status } = await useFetch("/api/search", {
  key: `search-${searchTerm}`,
  query: { searchTerm },
  lazy: true,
  server: false,
  transform: (data: any) => {
    return data.map((item: any) => ({
      id: item.id?.low ?? item.id,
      label: item.name ?? `${item.first_name} ${item.last_name}`,
      to: {
        name: item.labels.includes("Player") ? "player" : item.labels.includes("Country") ? "country" : "tournament",
        params: {
          id: item.id?.low ?? item.id,
          name: kebabCase(item.name ?? `${item.first_name} ${item.last_name}`)
        }
      }
    }))
  }
})

const groups = computed(() => [
  {
    id: "results",
    label: searchTerm.value ? `Results matching ${searchTerm.value}` : "Search players, tournaments or countries",
    items: results.value || []
  }
])
</script>

<template>
  <u-dashboard-group>
    <u-dashboard-search
      :groups
      :loading="status === 'pending'"
    />

    <u-dashboard-sidebar
      :default-size="5"
      mode="drawer"
    >
      <template #header>{{ lgAndUp ? "TH" : "Tennis History" }}</template>

      <template #default>
        <u-dashboard-search-button
          v-if="lgAndUp"
          size="sm"
          variant="ghost"
          :kbds="[]"
          :icon="icons.search"
        />
        <u-navigation-menu
          orientation="vertical"
          :collapsed="lgAndUp"
          :tooltip="lgAndUp"
          :items="navLinks"
          :popover="lgAndUp"
          variant="link"
          class="mx-auto"
        />
      </template>

      <template #footer>
        <u-popover
          class="mx-auto"
          :content="{ side: 'right', sideOffset: 15 }"
        >
          <u-button
            label="More"
            variant="ghost"
            color="neutral"
            icon="solar:menu-dots-bold-duotone"
            class="flex-col"
            block
          />

          <template #content>
            <u-navigation-menu
              :items="relatedLinks"
              orientation="vertical"
            />
          </template>
        </u-popover>
      </template>
    </u-dashboard-sidebar>

    <slot />
  </u-dashboard-group>
</template>
