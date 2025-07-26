<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui"

const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const { name, params, query } = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

const {
  id,
  mid,
  eid,
  year,
  name: paramName
} = params as {
  id?: string
  mid?: string
  eid?: string
  year?: string
  name?: string
}

const apiRoute = computed(() => {
  switch (name) {
    case "category":
      return "/api/categories/overview"
    case "coach":
      return `/api/coaches/overview`
    case "country":
      // case "country-players":
      // case "country-events":
      return `/api/countries/overview`
    case "player":
    case "activity":
    case "titles-and-finals":
    case "wl-index":
    case "stats":
    case "record":
      return "/api/players/overview"
    case "supervisor":
      return `/api/supervisors/overview`
    case "tournament":
      return `/api/tournaments/overview`
    case "umpire":
      return `/api/umpires/overview`
    case "venue":
      return `/api/venues/overview`
    case "match":
      return "/api/matches/overview"
    case "event":
    case "results":
    case "draws":
      return "/api/events/overview"
    default:
      return ""
  }
})

const apiParams = computed(() => {
  switch (name) {
    case "event":
    case "results":
    case "draws":
    case "match":
      return { id: eid, mid }
    default:
      return { id }
  }
})

const { data } = await useFetch<any>(apiRoute.value, { query: apiParams })

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const crumbs: BreadcrumbItem[] = [{ label: "Home", icon: icons.home, to: { name: "home" } }]

  switch (name) {
    case "about":
      return [...crumbs, { label: "About", icon: appIcons.info }]
    case "categories":
      return [...crumbs, { label: "Categories", icon: icons.categories }]
    case "category":
      return [
        ...crumbs,
        { label: "Categories", icon: icons.categories, to: { name: "categories" } },
        { label: data.value || capitalCase(id as string) }
      ]
    // case "coach":
    //   return [...crumbs, { label: "Coaches", icon: icons.coach, to: { name: "coaches" } }, { label: data.value?.name ?? "Loading..." }]
    case "coaches":
      return [...crumbs, { label: "Coaches", icon: icons.coach }]
    case "countries":
      return [...crumbs, { label: "Countries", icon: icons.countries }]
    // case "country":
    //   return [
    //     ...crumbs,
    //     { label: "Countries", icon: icons.countries, to: { name: "countries" } },
    //     { label: data.value?.name || "Loading...", icon: getFlagCode(data.value) }
    //   ]
    // case "country-players":
    // case "country-events":
    //   return [
    //     ...crumbs,
    //     { label: "Countries", icon: icons.countries, to: { name: "countries" } },
    //     {
    //       label: data.value?.name || "Loading...",
    //       icon: getFlagCode(data.value),
    //       to: { name: "country", params: { id: params.id || "", name: params.name || "" } }
    //     },
    //     { label: name === "country-players" ? "Players" : "Events", icon: name === "country-players" ? icons.player : icons.event }
    //   ]
    // case "event":
    // case "results":
    // case "draws":
    //   const eventPage = computed(() => EVENT_PAGES.find(page => page.name === name))
    //   return [
    //     ...crumbs,
    //     { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } },
    //     { label: data.value?.tournament || capitalCase(paramName as string) },
    //     { label: year },
    //     {
    //       label: eventPage.value?.label || "",
    //       icon: eventPage.value?.icon,
    //       ui: { linkLeadingIcon: eventPage.value?.icon === icons.draw ? "rotate-90 text-lg" : undefined }
    //     }
    //   ]
    case "h2h":
      return [...crumbs, { label: "Head to Head", icon: icons.h2h }]
    // case "h2h-player":
    //   return [...crumbs, { label: "Head to Head", icon: icons.h2h, to: { name: "h2h" } }, { label: `${params.p1Name} vs ${params.p2Name}` }]
    // case "match":
    //   const { type, draw, tour } = destructureMid(mid as string)
    //   return [
    //     ...crumbs,
    //     { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } },
    //     { label: data.value?.tournament || "Loading...", to: { name: "tournament", params: { id, name: paramName } } },
    //     { label: year, to: { name: "event", params: { id, name: paramName, year, eid } } },
    //     { label: tour },
    //     { label: type },
    //     { label: draw },
    //     { label: data.value?.round || "Loading" },
    //     { label: data.value ? `${data.value.player1} v ${data.value.player2}` : "Loading..." }
    //   ] as BreadcrumbItem[]
    // case "player":
    // case "activity":
    // case "titles-and-finals":
    // case "wl-index":
    // case "stats":
    // case "record":
    //   const playerPage = computed(() => PLAYER_PAGES.find(page => page.name === name))
    //   return [
    //     ...crumbs,
    //     { label: "Players", icon: icons.player, to: { name: "players" } },
    //     {
    //       label: data.value ? `${get(data, "first_name")} ${get(data, "last_name")}` : capitalCase(paramName as string),
    //       icon: data.value ? getFlagCode(get(data, "country")) : appIcons.loading
    //     },
    //     { label: playerPage.value?.label || "", icon: playerPage.value?.icon }
    //   ]
    case "players":
      return [...crumbs, { label: "Players", icon: icons.player }]
    case "ranking-rules":
      return [...crumbs, { label: "Ranking Rules", icon: icons.seeds }, { label: (query.year as string) || "" }]
    case "results-archive":
      return [...crumbs, { label: "Results Archive", icon: icons.event }]
    case "search":
      return [...crumbs, { label: "Search", icon: appIcons.search }]
    case "statistics-and-records":
      return [...crumbs, { label: "Statistics and Records", icon: icons.stats }]
    case "supervisor":
      return [
        ...crumbs,
        { label: "Supervisors", icon: icons.supervisor, to: { name: "supervisors" } },
        { label: data.value?.id ?? capitalCase(id as string) }
      ]
    case "supervisors":
      return [...crumbs, { label: "Supervisors", icon: icons.supervisor }]
    case "surface":
      return [
        ...crumbs,
        { label: "Surfaces", icon: icons.court, to: { name: "surfaces" } },
        {
          label: capitalCase(id as string) || "Loading...",
          avatar: {
            src: `/surfaces/${capitalCase(id as string)
              .replace("Indoor ", "")
              .replace("Outdoor ", "")}.jpg`,
            alt: capitalCase(id as string) || ""
          }
        }
      ]
    case "surfaces":
      return [...crumbs, { label: "Surfaces", icon: icons.court }]
    case "tournament":
      return [
        ...crumbs,
        { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } },
        { label: data.value?.name || capitalCase(paramName as string) }
      ]
    case "tournaments":
      return [...crumbs, { label: "Tournaments", icon: icons.tournament }]
    case "umpire":
      return [...crumbs, { label: "Umpires", icon: icons.umpire, to: { name: "umpires" } }, { label: data.value?.id || capitalCase(id as string) }]
    case "umpires":
      return [...crumbs, { label: "Umpires", icon: icons.umpire }]
    case "upcoming-tournaments":
      return [...crumbs, { label: "Upcoming Tournaments", icon: icons.upcoming }]
    // case "venue":
    //   return [
    //     ...crumbs,
    //     { label: "Venues", icon: icons.venue, to: { name: "venues" } },
    //     {
    //       label: data.value?.country?.name || "Loading...",
    //       to: { name: "country", params: { id: data.value?.country?.id, name: kebabCase(data.value?.country?.name || "") } },
    //       icon: getFlagCode(data.value?.country)
    //     },
    //     { label: data.value?.city || "Loading..." },
    //     { label: data.value?.name || capitalCase(id as string) }
    //   ]
    case "venues":
      return [...crumbs, { label: "Venues", icon: icons.venue }]
    case "years":
      return [...crumbs, { label: "Years", icon: icons.year }, { label: (query.year as string) || "" }]
    default:
      return crumbs
  }
})

const pageTitle = computed(() => {
  switch (name) {
    case "category":
      return data.value || capitalCase(id as string)
    case "categories":
      return "Categories"
    case "coaches":
      return "Coaches"
    case "countries":
      return "Countries"
    case "match":
      return data.value ? `${data.value.player1} vs ${data.value.player2}` : "Loading..."
    case "players":
      return "Players"
    case "results-archive":
      return "Results Archive"
    case "supervisor":
      return data.value?.id || capitalCase(id as string)
    case "supervisors":
      return "Supervisors"
    case "surface":
      return capitalCase(id as string)
    case "surfaces":
      return "Surfaces"
    case "tournament":
      return data.value?.name || capitalCase(paramName as string)
    case "tournaments":
      return "Tournaments"
    case "umpire":
      return data.value?.id || capitalCase(id as string)
    case "umpires":
      return "Umpires"
    case "upcoming-tournaments":
      return "Upcoming Tournaments"
    case "venues":
      return "Venues"
    default:
      return "Home"
  }
})
</script>

<template>
  <u-breadcrumb
    v-if="mdAndUp"
    :items="breadcrumbs"
    class="lg:max-w-190 xl:max-w-full"
  />
  <div
    v-else
    className="font-semibold text-muted text-wrap"
  >
    <div
      v-if="name === 'venue' && data"
      class="text-sm"
    >
      <span
        v-if="data.name"
        class="truncate"
      >
        {{ data.name }}
      </span>
      <span class="flex items-center gap-2">{{ data.city }} <country-link :country="data.country" /></span>
    </div>
    <!--<div
      v-else-if="['event', 'results', 'draws'].includes(name)"
      class="text-sm"
    >
      <div>{{ EVENT_PAGES.find(page => page.name === name)?.label }}</div>
      <div class="truncate">{{ data?.tournament ?? capitalCase(id as string) }} {{ year }}</div>
    </div>
    <div
      v-else-if="['player', 'activity', 'titles-and-finals', 'wl-index', 'stats', 'record'].includes(name)"
      class="text-sm"
    >
      <div>{{ PLAYER_PAGES.find(page => page.name === name)?.label }}</div>
      <div class="truncate">{{ data ? `${data.first_name} ${data.last_name}` : capitalCase(paramName as string) }}</div>
    </div> -->
    <template v-else>{{ pageTitle }}</template>
  </div>
</template>
