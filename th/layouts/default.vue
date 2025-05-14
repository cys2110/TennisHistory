<script setup lang="ts">
const { setViewMode } = useViewMode()
const appConfig = useAppConfig()

// Internal navigation links
const NAV_LINKS = [
  {
    label: "Tournaments",
    defaultOpen: true,
    children: [
      { label: "Alphabetical List", to: { name: "tournaments" }, icon: ICONS.tournament },
      { label: "Upcoming Tournaments", to: { name: "upcoming-tournaments" }, icon: ICONS.upcoming },
      { label: "Results Archive", to: { name: "results-archive" }, icon: ICONS.event }
    ]
  },
  {
    label: "Players",
    defaultOpen: true,
    children: [
      { label: "Alphabetical List", to: { name: "players" }, icon: ICONS.player },
      { label: "Head to Head", to: { name: "h2h" }, icon: ICONS.h2h }
    ]
  },
  { label: "Stats/Records", to: { name: "statistics-and-records" }, icon: ICONS.stats },
  { label: "Ranking Rules", to: { name: "ranking-rules" }, icon: ICONS.seeds },
  {
    label: "Other",
    defaultOpen: true,
    children: [
      { label: "Categories", to: { name: "categories" }, icon: ICONS.categories },
      { label: "Coaches", to: { name: "coaches" }, icon: ICONS.coach },
      { label: "Countries", to: { name: "countries" }, icon: ICONS.countries },
      { label: "Supervisors", to: { name: "supervisors" }, icon: ICONS.supervisor },
      { label: "Surfaces", to: { name: "surfaces" }, icon: ICONS.court },
      { label: "Umpires", to: { name: "umpires" }, icon: ICONS.umpire },
      { label: "Venues", to: { name: "venues" }, icon: ICONS.venue },
      { label: "Years", to: { name: "years" }, icon: ICONS.year }
    ]
  },
  { label: "Search", to: { name: "search" }, icon: appConfig.ui.icons.search },
  { label: "About", to: { name: "about" }, icon: appConfig.ui.icons.info }
]

const RELATED_LINKS = [
  {
    label: "Governing Bodies",
    children: [
      { label: "ATP", to: "https://www.atptour.com/", target: "_blank" },
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
    id: "viewMode",
    label: "View mode",
    items: [
      {
        label: "Cards",
        suffix: "View data in cards mode",
        icon: ICONS.cards,
        onSelect: () => setViewMode("cards")
      },
      {
        label: "List",
        suffix: "View data in list mode",
        icon: ICONS.list,
        onSelect: () => setViewMode("list")
      }
    ]
  }
])
</script>

<template>
  <u-dashboard-group>
    <!--Command palette-->
    <u-dashboard-search :groups />

    <u-dashboard-sidebar collapsible>
      <template #header="{ collapsed }">
        {{ collapsed ? "TH" : "TennisHistory" }}
      </template>

      <template #default="{ collapsed }">
        <!--Open command palette-->
        <u-dashboard-search-button
          :collapsed
          size="xs"
          label="Settings"
          :icon="ICONS.settings"
        />

        <!--Internal links-->
        <u-navigation-menu
          :collapsed
          :items="NAV_LINKS"
          orientation="vertical"
          highlight
        />
      </template>

      <template #footer="{ collapsed }">
        <!--External links-->
        <u-navigation-menu
          :collapsed
          :items="RELATED_LINKS"
          orientation="vertical"
        />
      </template>
    </u-dashboard-sidebar>

    <!--Main content-->
    <slot />
  </u-dashboard-group>
</template>
