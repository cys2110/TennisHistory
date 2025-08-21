<script setup lang="ts">
const { setViewMode, setTableMode, setItemsPerPage } = useDefaults()

const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

// Internal navigation links
const NAV_LINKS = [
  { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } },
  { label: "Results Archive", to: { name: "results-archive" }, icon: icons.event },
  { label: "Players", icon: icons.player, to: { name: "players" } },
  { label: "Head to Head", to: { name: "h2h" }, icon: icons.h2h },
  { label: "Stats/Records", to: { name: "statistics-and-records" }, icon: icons.stats },
  { label: "Ranking Rules", to: { name: "ranking-rules" }, icon: icons.seeds },
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
  { label: "Search", to: { name: "search" }, icon: uIcons.search },
  { label: "About", to: { name: "about" }, icon: uIcons.info },
  { label: "Settings", to: { name: "settings" }, icon: icons.settings }
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
      },
      {
        label: "Hybrid",
        suffix: "View data in hybrid mode",
        icon: icons.hybrid,
        onSelect: () => setViewMode("hybrid")
      }
    ]
  },
  {
    id: "itemsPerPage",
    label: "Default items per page",
    items: [
      {
        icon: "tabler:number-10-small",
        label: " ",
        suffix: "Display 10 items per page",
        onSelect: () => setItemsPerPage(10)
      },
      {
        icon: "tabler:number-20-small",
        label: " ",
        suffix: "Display 20 items per page",
        onSelect: () => setItemsPerPage(25)
      },
      {
        icon: "tabler:number-50-small",
        label: " ",
        suffix: "Display 50 items per page",
        onSelect: () => setItemsPerPage(50)
      },
      {
        icon: "tabler:number-100-small",
        label: " ",
        suffix: "Display 100 items per page",
        onSelect: () => setItemsPerPage(100)
      }
    ]
  },
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

    <u-dashboard-sidebar :default-size="5">
      <template #header> TH </template>

      <template #default>
        <u-dashboard-search-button
          size="sm"
          variant="ghost"
          :kbds="[]"
          label="Shortcuts"
        />

        <template
          v-for="link in NAV_LINKS"
          :key="link.label"
        >
          <u-tooltip :text="link.label">
            <!--@vue-expect-error-->
            <u-button
              v-if="link.to"
              :icon="link.icon"
              :to="link.to"
              variant="link"
              color="neutral"
              class="2xl:flex-col"
            />

            <u-popover
              v-else
              class="mx-auto"
              :content="{ side: 'right' }"
            >
              <u-button
                :icon="link.icon"
                variant="link"
                color="neutral"
                class="flex-col"
                label="Other"
                size="sm"
                block
              />

              <template #content>
                <!--@vue-expect-error-->
                <u-navigation-menu
                  :items="link.children"
                  orientation="vertical"
                />
              </template>
            </u-popover>
          </u-tooltip>
        </template>
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
              :items="RELATED_LINKS"
              orientation="vertical"
            />
          </template>
        </u-popover>
      </template>
    </u-dashboard-sidebar>

    <!--Main content-->
    <slot />
  </u-dashboard-group>
</template>
