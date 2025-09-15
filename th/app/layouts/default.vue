<script setup lang="ts">
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const lgAndUp = breakpoints.greaterOrEqual("lg")
const { setTableMode } = useDefaults()

const navLinks = [
  { label: "Results Archive", icon: icons.event, to: { name: "results-archive" } },
  { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } },
  { label: "Players", icon: icons.player, to: { name: "players" } },
  { label: "Head to Head", icon: icons.h2h, to: { name: "h2h" } },
  {
    label: "Other",
    icon: "tabler:grid-dots",
    children: [
      { label: "Categories", to: { name: "categories" }, icon: icons.categories },
      { label: "Coaches", to: { name: "coaches" }, icon: icons.coach },
      { label: "Countries", to: { name: "countries" }, icon: icons.countries },
      { label: "Supervisors", to: { name: "supervisors" }, icon: icons.supervisor },
      { label: "Surfaces", to: { name: "surfaces" }, icon: icons.court },
      { label: "Umpires", to: { name: "umpires" }, icon: icons.umpire },
      { label: "Venues", to: { name: "venues" }, icon: icons.venue },
      { label: "Years", to: { name: "years" }, icon: icons.year }
    ]
  },
  { label: "Stats/Records", icon: icons.stats, to: { name: "statistics-and-records" } },
  { label: "Ranking Rules", icon: icons.seeds, to: { name: "ranking-rules" } },
  { label: "Search", icon: uIcons.search, to: { name: "search" } },
  { label: "About", icon: uIcons.info, to: { name: "about" } }
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

const groups = computed(() => [
  {
    id: "tableMode",
    label: "Default table view",
    items: [
      {
        label: "Grouped",
        suffix: "View data in tables with grouping and aggregations where available",
        onSelect: () => setTableMode("grouped")
      },
      {
        label: "Ungrouped",
        suffix: "View data in tables in a running list without aggregations",
        onSelect: () => setTableMode("ungrouped")
      }
    ]
  }
])
</script>

<template>
  <u-dashboard-group>
    <u-dashboard-search :groups />

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
          label="Shortcuts"
        />
        <!--@vue-expect-error-->
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
