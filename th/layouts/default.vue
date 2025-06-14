<script setup lang="ts">
const { setViewMode } = useViewMode()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()

// Internal navigation links
const NAV_LINKS = [
  {
    label: "Tournaments",
    defaultOpen: true,
    children: [
      { label: "Alphabetical List", to: { name: "tournaments" }, icon: icons.tournament },
      { label: "Upcoming Tournaments", to: { name: "upcoming-tournaments" }, icon: icons.upcoming },
      { label: "Results Archive", to: { name: "results-archive" }, icon: icons.event }
    ]
  },
  {
    label: "Players",
    defaultOpen: true,
    children: [
      { label: "Alphabetical List", to: { name: "players" }, icon: icons.player },
      { label: "Head to Head", to: { name: "h2h" }, icon: icons.h2h }
    ]
  },
  { label: "Stats/Records", to: { name: "statistics-and-records" }, icon: icons.stats },
  { label: "Ranking Rules", to: { name: "ranking-rules" }, icon: icons.seeds },
  {
    label: "Other",
    defaultOpen: true,
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
  { label: "Search", to: { name: "search" }, icon: appIcons.search },
  { label: "About", to: { name: "about" }, icon: appIcons.info }
]

const RELATED_LINKS = [
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
    id: "viewMode",
    label: "View mode",
    items: [
      {
        label: "Cards",
        suffix: "View data in cards mode",
        icon: icons.cards,
        onSelect: () => setViewMode("cards")
      },
      {
        label: "List",
        suffix: "View data in list mode",
        icon: icons.list,
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
          :icon="icons.settings"
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
