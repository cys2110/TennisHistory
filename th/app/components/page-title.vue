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
  ui: { icons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")

const apiRoute = computed(() => {
  switch (routeName) {
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
    case "head-to-head":
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
  const crumbs: BreadcrumbItem[] = [{ label: "Home", icon: ICONS.home, to: { name: "home" } }]

  switch (routeName) {
    case "about":
      return [...crumbs, { label: "About", icon: icons.info, to: { name: "about" } }]
    case "country":
    case "countries":
      return [
        ...crumbs,
        { label: "Countries", icon: ICONS.countries, to: { name: "countries" } },
        ...(routeName === "country" ? [{ label: data.value?.name || capitalCase(name as string), icon: getFlagCode(data.value) }] : [])
      ]
    case "h2h":
    case "head-to-head":
      return [
        ...crumbs,
        { label: "H2H", icon: ICONS.h2h, to: { name: "h2h" } },
        ...(routeName === "head-to-head"
          ? [
              {
                label: `${data.value ? `${data.value.p1.first_name} ${data.value.p1.last_name}` : capitalCase(p1Name as string)} v ${
                  data.value ? `${data.value.p2.first_name} ${data.value.p2.last_name}` : capitalCase(p2Name as string)
                }`
              }
            ]
          : [])
      ]
    case "match":
      const { type, tour } = destructureMid(mid)
      return [
        ...crumbs,
        { label: "Tournaments", icon: ICONS.tournament, to: { name: "tournaments" } },
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
        { label: "Players", icon: ICONS.player, to: { name: "players" } },
        ...(routeName !== "players"
          ? [
              {
                label: data.value ? `${data.value.first_name} ${data.value.last_name}` : capitalCase(name as string),
                icon: data.value ? getFlagCode(data.value.country) : icons.loading
              },
              {
                label: PLAYER_PAGES.find(page => page.name === routeName)?.label || "",
                icon: PLAYER_PAGES.find(page => page.name === routeName)?.icon
              }
            ]
          : [])
      ]
    case "results-archive":
      return [
        ...crumbs,
        { label: "Results Archive", icon: ICONS.event, to: { name: "results-archive" } },
        { label: query.year ?? new Date().getFullYear() }
      ] as BreadcrumbItem[]
    // case "statistics-and-records":
    //   return [...crumbs, { label: "Statistics and Records", icon: icons.stats, to: { name: "statistics-and-records" } }]
    case "tournament":
    case "tournaments":
    case "event":
    case "results":
    case "draws":
      return [
        ...crumbs,
        { label: "Tournaments", icon: ICONS.tournament, to: { name: "tournaments" } },
        ...(routeName !== "tournaments" ? [{ label: data.value?.name || capitalCase(name), to: { name: "tournament", params: { id, name } } }] : []),
        ...(!["tournaments", "tournament"].includes(routeName)
          ? [
              { label: year as string },
              {
                label: EVENT_PAGES.find(page => page.name === routeName)?.label || "",
                icon: EVENT_PAGES.find(page => page.name === routeName)?.icon,
                ui: { linkLeadingIcon: routeName === "draws" ? "rotate-270" : undefined }
              }
            ]
          : [])
      ] as BreadcrumbItem[]
    case "years":
      return [
        ...crumbs,
        { label: "Years", icon: ICONS.year, to: { name: "years" } },
        ...(query.year ? [{ label: query.year as string }] : [{ label: new Date().getFullYear() }])
      ] as BreadcrumbItem[]
    default:
      return crumbs
  }
})

const pageTitle = computed(() => {
  switch (routeName) {
    case "h2h":
      return "Head to Head"
    case "head-to-head":
      return data.value
        ? `${data.value.p1.first_name} ${data.value.p1.last_name} v ${data.value.p2.first_name} ${data.value.p2.last_name}`
        : `${capitalCase(p1Name as string)} v ${capitalCase(p2Name as string)}`
    case "results-archive":
      return `Results Archive ${query.year ?? new Date().getFullYear()}`
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
    <div v-if="['player', 'activity', 'titles-and-finals', 'wl-index', 'stats', 'record'].includes(routeName)">
      <div>{{ PLAYER_PAGES.find(page => page.name === routeName)?.label }}</div>
      <div class="truncate">{{ data ? `${data.first_name} ${data.last_name}` : capitalCase(name as string) }}</div>
    </div>

    <div v-else-if="routeName === 'tournament'">
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
        data
          ? `${data.name} ${year}`
          : `${destructureMid(mid).tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)")} ${destructureMid(mid).type} ${
              destructureMid(mid).draw
            } ${destructureMid(mid).match_no}`
      }}</div>
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
