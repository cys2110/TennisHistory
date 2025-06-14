<script setup lang="ts">
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const { name, params, query } = useRoute()
const id = computed(() => (params.id ? decodeName(params.id as string) : null))
const paramName = computed(() => (params.name ? decodeName(params.name as string) : null))

const apiRoute = computed(() => {
  switch (name) {
    case "coach":
      return `/api/coaches/overview`
    case "country":
      return `/api/countries/overview`
    case "venue":
      return `/api/venues/overview`
    default:
      return ""
  }
})

const { data } = await useFetch<any>(apiRoute.value, { query: { id } })

const breadcrumbs = computed(() => {
  const crumbs: BreadcrumbType[] = [{ label: "Home", icon: icons.home, to: { name: "home" } }]

  switch (name) {
    case "about":
      return [...crumbs, { label: "About", icon: appIcons.info }]
    case "categories":
      return [...crumbs, { label: "Categories", icon: icons.categories }]
    case "category":
      return [...crumbs, { label: "Categories", icon: icons.categories, to: { name: "categories" } }, { label: id.value ?? "" }]
    case "coach":
      return [...crumbs, { label: "Coaches", icon: icons.coach, to: { name: "coaches" } }, { label: data.value?.name ?? "Loading..." }]
    case "coaches":
      return [...crumbs, { label: "Coaches", icon: icons.coach }]
    case "countries":
      return [...crumbs, { label: "Countries", icon: icons.countries }]
    case "country":
      return [
        ...crumbs,
        { label: "Countries", icon: icons.countries, to: { name: "countries" } },
        { label: data.value?.name ?? "Loading...", icon: getFlagCode(data.value) }
      ]
    case "event":
    case "results":
    case "draws":
      const eventPage = computed(() => EVENT_PAGES.find(page => page.name === name))
      return [
        ...crumbs,
        { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } },
        { label: paramName.value ?? "" },
        { label: params.year },
        { label: eventPage.value?.label ?? "", icon: eventPage.value?.icon, slot: "page" }
      ]
    case "h2h":
      return [...crumbs, { label: "Head to Head", icon: icons.h2h }]
    case "h2h-player":
      return [...crumbs, { label: "Head to Head", icon: icons.h2h, to: { name: "h2h" } }, { label: `${params.p1Name} vs ${params.p2Name}` }]
    // TODO: Add api to get player names
    case "match":
      return [
        ...crumbs,
        { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } },
        { label: paramName.value },
        { label: params.year }
      ]
    case "player":
    case "activity":
    case "titles-and-finals":
    case "wl-index":
    case "stats":
    case "record":
      const playerPage = computed(() => PLAYER_PAGES.find(page => page.name === name))
      return [
        ...crumbs,
        { label: "Players", icon: icons.player, to: { name: "players" } },
        { label: paramName.value ?? "" },
        { label: playerPage.value?.label ?? "", icon: playerPage.value?.icon }
      ]
    case "players":
      return [...crumbs, { label: "Players", icon: icons.player }]
    case "ranking-rules":
      return [...crumbs, { label: "Ranking Rules", icon: icons.seeds }, { label: query.year as string }]
    case "results-archive":
      return [...crumbs, { label: "Results Archive", icon: icons.event }]
    case "search":
      return [...crumbs, { label: "Search", icon: appIcons.search }]
    case "statistics-and-records":
      return [...crumbs, { label: "Statistics and Records", icon: icons.stats }]
    case "supervisor":
      return [...crumbs, { label: "Supervisors", icon: icons.supervisor, to: { name: "supervisors" } }, { label: id.value ?? "" }]
    case "supervisors":
      return [...crumbs, { label: "Supervisors", icon: icons.supervisor }]
    case "surface":
      return [
        ...crumbs,
        { label: "Surfaces", icon: icons.court, to: { name: "surfaces" } },
        { label: id.value ?? "", avatar: { src: `/surfaces/${id.value?.replace("Indoor ", "").replace("Outdoor ", "")}.jpg`, alt: id.value ?? "" } }
      ]
    case "surfaces":
      return [...crumbs, { label: "Surfaces", icon: icons.court }]
    case "tournament":
      return [...crumbs, { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } }, { label: paramName.value }]
    case "tournaments":
      return [...crumbs, { label: "Tournaments", icon: icons.tournament }]
    case "umpire":
      return [...crumbs, { label: "Umpires", icon: icons.umpire, to: { name: "umpires" } }, { label: id.value ?? "" }]
    case "umpires":
      return [...crumbs, { label: "Umpires", icon: icons.umpire }]
    case "upcoming-tournaments":
      return [...crumbs, { label: "Upcoming Tournaments", icon: icons.upcoming }]
    case "venue":
      return [
        ...crumbs,
        { label: "Venues", icon: icons.venue, to: { name: "venues" } },
        {
          label: data.value?.country.name ?? "Loading...",
          to: { name: "country", params: { id: data.value?.country.id, name: encodeName(data.value.country.name) } },
          icon: getFlagCode(data.value?.country)
        },
        { label: data.value?.city ?? "Loading..." },
        { label: data.value?.name ?? "" }
      ]
    case "venues":
      return [...crumbs, { label: "Venues", icon: icons.venue }]
    case "years":
      return [...crumbs, { label: "Years", icon: icons.year }, { label: query.year as string }]
    default:
      return crumbs
  }
})
</script>

<template>
  <u-breadcrumb :items="breadcrumbs">
    <!--@vue-expect-error-->
    <template #page-leading="{ item }">
      <u-icon
        v-if="item.icon === icons.draw"
        :name="item.icon"
        class="rotate-90 text-lg"
      />
    </template>
  </u-breadcrumb>
</template>
