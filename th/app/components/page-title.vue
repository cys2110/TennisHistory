<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui"

const { name: routeName, params, query } = useRoute()
const { id, name, year, mid, eid, p1Id, p2Id, p1Name, p2Name } = params as {
  id: string
  name: string
  year: string
  mid: string
  eid: string
  p1Id: string
  p2Id: string
  p1Name?: string
  p2Name?: string
}
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")

const apiRoute = computed(() => {
  switch (routeName) {
    case "category":
      return {
        route: `/api/categories/overview?id=${id}`,
        key: `category-overview-${id}`
      }
    case "coach":
      return {
        route: `/api/coaches/overview?id=${id}`,
        key: `coach-overview-${id}`
      }
    case "country":
      return {
        route: `/api/countries/overview?id=${id}`,
        key: `country-overview-${id}`
      }
    case "event":
    case "results":
    case "draws":
    case "tournament":
      return {
        route: `/api/tournaments/overview?id=${id}`,
        key: `tournament-overview-${id}`
      }
    case "h2h-players":
      return {
        route: `/api/h2h/players?p1Id=${p1Id}&p2Id=${p2Id}`,
        key: `h2h-players-${p1Id}-${p2Id}`
      }
    case "match":
      return {
        route: `/api/matches/overview?id=${eid}&mid=${mid}`,
        key: `match-overview-${eid}-${mid}`
      }
    case "player":
    case "activity":
    case "titles-and-finals":
    case "wl-index":
    case "stats":
    case "record":
      return {
        route: `/api/players/overview?id=${id}`,
        key: `player-overview-${id}`
      }
    case "supervisor":
      return {
        route: `/api/supervisors/overview?id=${id}`,
        key: `supervisor-overview-${id}`
      }
    case "umpire":
      return {
        route: `/api/umpires/overview?id=${id}`,
        key: `umpire-overview-${id}`
      }
    case "venue":
      return {
        route: `/api/venues/overview?id=${id}`,
        key: `venue-overview-${id}`
      }
    default:
      return {
        route: "",
        key: ""
      }
  }
})

const { data } = await useFetch<any>(() => apiRoute.value.route, {
  key: apiRoute.value.key
})

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const crumbs: BreadcrumbItem[] = [{ label: "Home", icon: icons.home, to: { name: "home" } }]

  switch (routeName) {
    case "about":
      return [...crumbs, { label: "About", icon: uIcons.info, to: { name: "about" } }]
    case "categories":
    case "category":
      return [
        ...crumbs,
        { label: "Categories", icon: icons.categories, to: { name: "categories" } },
        ...(routeName === "category" ? [{ label: data.value ?? capitalCase(id as string) }] : [])
      ]
    case "coach":
    case "coaches":
      return [
        ...crumbs,
        { label: "Coaches", icon: icons.coach, to: { name: "coaches" } },
        ...(routeName === "coach" ? [{ label: data.value ? `${data.value.first_name} ${data.value.last_name}` : capitalCase(id as string) }] : [])
      ]
    case "country":
    case "countries":
      return [
        ...crumbs,
        { label: "Countries", icon: icons.countries, to: { name: "countries" } },
        ...(routeName === "country" ? [{ label: data.value?.name || capitalCase(name as string), icon: getFlagCode(data.value) }] : [])
      ]
    case "h2h":
    case "h2h-players":
      return [
        ...crumbs,
        { label: "H2H", icon: icons.h2h, to: { name: "h2h" } },
        ...(routeName === "h2h-players" ?
          [
            {
              label: `${data.value ? `${data.value.p1.first_name} ${data.value.p1.last_name}` : capitalCase(p1Name as string)} v ${data.value ? `${data.value.p2.first_name} ${data.value.p2.last_name}` : capitalCase(p2Name as string)}`
            }
          ]
        : [])
      ]
    case "match":
      const { type, tour } = destructureMid(mid)
      return [
        ...crumbs,
        { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } },
        { label: data.value?.name || capitalCase(name as string), to: { name: "tournament", params: { id, name } } },
        { label: year as string, to: { name: "event", params: { id, name, year, eid } } },
        { label: tour },
        { label: type },
        { label: data.value?.round || "Loading..." },
        { label: data.value ? `${data.value.player1} v ${data.value.player2}` : "Loading..." }
      ]
    case "players":
    case "player":
    case "activity":
    case "titles-and-finals":
    case "wl-index":
    case "stats":
    case "record":
      return [
        ...crumbs,
        { label: "Players", icon: icons.player, to: { name: "players" } },
        ...(routeName !== "players" ?
          [
            {
              label: data.value ? `${data.value.first_name} ${data.value.last_name}` : capitalCase(name as string),
              icon: data.value ? getFlagCode(data.value.country) : uIcons.loading
            },
            {
              label: PLAYER_PAGES.find(page => page.name === routeName)?.label || "",
              icon: PLAYER_PAGES.find(page => page.name === routeName)?.icon
            }
          ]
        : [])
      ]
    case "ranking-rules":
      return [
        ...crumbs,
        { label: "Ranking Rules", icon: icons.seeds, to: { name: "ranking-rules" } },
        ...(query.year ? [{ label: query.year as string }] : [])
      ]
    case "results-archive":
      return [...crumbs, { label: "Results Archive", icon: icons.event, to: { name: "results-archive" } }]
    case "search":
      return [...crumbs, { label: "Search", icon: uIcons.search, to: { name: "search" } }]
    case "statistics-and-records":
      return [...crumbs, { label: "Statistics and Records", icon: icons.stats, to: { name: "statistics-and-records" } }]
    case "supervisor":
    case "supervisors":
      return [
        ...crumbs,
        { label: "Supervisors", icon: icons.supervisor, to: { name: "supervisors" } },
        ...(routeName === "supervisor" ? [{ label: data.value?.id || capitalCase(id as string) }] : [])
      ]
    case "surfaces":
    case "surface":
      return [
        ...crumbs,
        { label: "Surfaces", icon: icons.court, to: { name: "surfaces" } },
        ...(routeName === "surface" ?
          [
            {
              label: capitalCase(id as string),
              avatar: {
                src: `/surfaces/${capitalCase(id as string)
                  .replace("Indoor ", "")
                  .replace("Outdoor ", "")}.jpg`,
                alt: capitalCase(id as string)
              }
            }
          ]
        : [])
      ]
    case "tournament":
    case "tournaments":
    case "event":
    case "results":
    case "draws":
      return [
        ...crumbs,
        { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } },
        ...(routeName !== "tournaments" ? [{ label: data.value?.name || capitalCase(name), to: { name: "tournament", params: { id, name } } }] : []),
        ...(!["tournaments", "tournament"].includes(routeName) ?
          [
            { label: year as string },
            { label: EVENT_PAGES.find(page => page.name === routeName)?.label || "", icon: EVENT_PAGES.find(page => page.name === routeName)?.icon }
          ]
        : [])
      ] as BreadcrumbItem[]
    case "umpire":
    case "umpires":
      return [
        ...crumbs,
        { label: "Umpires", icon: icons.umpire, to: { name: "umpires" } },
        ...(routeName === "umpire" ? [{ label: data.value?.id || capitalCase(id as string) }] : [])
      ]
    case "venue":
    case "venues":
      return [
        ...crumbs,
        { label: "Venues", icon: icons.venue, to: { name: "venues" } },
        ...(routeName === "venue" ?
          [
            {
              label: data.value?.country.name || "Loading...",
              to: { name: "country", params: { id: data.value?.country.id, name: kebabCase(data.value?.country.name || "") } },
              icon: getFlagCode(data.value?.country)
            },
            { label: data.value?.city || "Loading..." },
            { label: data.value?.name || capitalCase(id as string) }
          ]
        : [])
      ] as BreadcrumbItem[]
    case "years":
      return [...crumbs, { label: "Years", icon: icons.year, to: { name: "years" } }, ...(query.year ? [{ label: query.year as string }] : [])]
    default:
      return crumbs
  }
})

const pageTitle = computed(() => {
  switch (routeName) {
    case "category":
      return data.value || capitalCase(id as string)
    case "coach":
      return data.value ? `${data.value.first_name} ${data.value.last_name}` : capitalCase(id as string)
    case "h2h-players":
      return data.value ?
          `${data.value.p1.first_name} ${data.value.p1.last_name} v ${data.value.p2.first_name} ${data.value.p2.last_name}`
        : `${capitalCase(p1Name as string)} v ${capitalCase(p2Name as string)}`
    case "ranking-rules":
      return query.year ? `Ranking Rules ${query.year}` : "Ranking Rules"
    case "supervisor":
    case "umpire":
      return data.value?.id || capitalCase(id as string)
    case "surface":
      return capitalCase(id as string)
    case "years":
      return `Years - ${query.year ?? new Date().getFullYear()}`
    default:
      return `${capitalCase(routeName)}`
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

    <div v-else-if="routeName === 'match'">
      <div>{{ data ? `${data.player1} vs ${data.player2}` : `${capitalCase(name as string)} ${year}` }}</div>
      <div>{{
        data ?
          `${data.name} ${year}`
        : `${destructureMid(mid).tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)")} ${destructureMid(mid).type} ${
            destructureMid(mid).draw
          } ${destructureMid(mid).match_no}`
      }}</div>
    </div>

    <div v-else-if="routeName === 'venue'">
      <div>{{ data?.name ? `${data.name}, ${data.city}` : (data?.city ?? capitalCase(id as string)) }}</div>
      <country-link
        v-if="data"
        :country="data.country"
        :icon-only="false"
      />
    </div>

    <div v-else-if="['player', 'activity', 'titles-and-finals', 'wl-index', 'stats', 'record'].includes(routeName)">
      <div>{{ PLAYER_PAGES.find(page => page.name === routeName)?.label }}</div>
      <div class="truncate">{{ data ? `${data.first_name} ${data.last_name}` : capitalCase(name as string) }}</div>
    </div>

    <country-link
      v-else-if="data && routeName === 'country'"
      :country="data"
      :icon-only="false"
      class="mx-auto"
    />

    <template v-else>{{ pageTitle }}</template>
  </div>
</template>
