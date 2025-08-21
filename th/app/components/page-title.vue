<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui"

const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const {
  name: routeName,
  // @ts-ignore
  params: { id, name, year, mid, eid },
  query
} = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")

const apiRoute = computed(() => {
  switch (routeName) {
    case "category":
      return {
        route: `/api/categories/overview?id=${id}`,
        key: `category-overview-${id}`
      }
    case "match":
      return {
        route: `/api/matches/overview?id=${eid}&mid=${mid}`,
        key: `match-overview-${eid}-${mid}`
      }
    case "supervisor":
      return {
        route: `/api/supervisors/overview?id=${id}`,
        key: `supervisor-overview-${id}`
      }
    case "tournament":
    case "event":
    case "results":
    case "draws":
      return {
        route: `/api/tournaments/overview?id=${id}`,
        key: `tournament-overview-${id}`
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

// @ts-ignore
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const crumbs: BreadcrumbItem[] = [{ label: "Home", icon: icons.home, to: { name: "home" } }]

  switch (routeName) {
    case "about":
      return [...crumbs, { label: "About", icon: appIcons.info, to: { name: "about" } }]
    case "categories":
    case "category":
      return [
        ...crumbs,
        { label: "Categories", icon: icons.categories, to: { name: "categories" } },
        ...(routeName === "category" ? [{ label: data.value ?? capitalCase(id as string) }] : [])
      ]
    case "coaches":
      return [...crumbs, { label: "Coaches", icon: icons.coach, to: { name: "coaches" } }]
    case "countries":
      return [...crumbs, { label: "Countries", icon: icons.countries, to: { name: "countries" } }]
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
      return [...crumbs, { label: "Players", icon: icons.player, to: { name: "players" } }]
    case "results-archive":
      return [...crumbs, { label: "Results Archive", icon: icons.event, to: { name: "results-archive" } }]
    case "supervisor":
    case "supervisors":
      return [
        ...crumbs,
        { label: "Supervisors", icon: icons.supervisor, to: { name: "supervisors" } },
        ...(routeName === "supervisor" ? [{ label: data.value?.id || capitalCase(id as string) }] : [])
      ]
    case "surface":
    case "surfaces":
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
    case "tournaments":
    case "tournament":
    case "event":
    case "results":
    case "draws":
      return [
        ...crumbs,
        { label: "Tournaments", icon: icons.tournament, to: { name: "tournaments" } },
        ...(routeName !== "tournaments" ?
          [{ label: data.value?.name || capitalCase(name as string), to: { name: "tournament", params: { id, name } } }]
        : []),
        ...(!["tournaments", "tournament"].includes(routeName) ?
          [
            { label: year as string },
            { label: EVENT_PAGES.find(page => page.name === routeName)?.label || "", icon: EVENT_PAGES.find(page => page.name === routeName)?.icon }
          ]
        : [])
      ]
    case "umpires":
      return [...crumbs, { label: "Umpires", icon: icons.umpire, to: { name: "umpires" } }]
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
      ]
    default:
      return crumbs
  }
})

const pageTitle = computed(() => {
  switch (routeName) {
    case "category":
      return data.value || capitalCase(id as string)
    case "supervisor":
      return data.value?.id || capitalCase(id as string)
    case "surface":
      return capitalCase(id as string)
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

    <div v-else-if="routeName === 'venue'">
      <div>{{ data?.name ? `${data.name}, ${data.city}` : (data?.city ?? capitalCase(id as string)) }}</div>
      <country-link
        v-if="data"
        :country="data.country"
        :icon-only="false"
      />
    </div>

    <div v-else-if="routeName === 'match'">
      <div>{{ data ? `${data.player1} vs ${data.player2}` : `${capitalCase(name as string)} ${year}` }}</div>
      <div>{{
        data ?
          `${data.name} ${year}`
        : `${destructureMid(mid).tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)")} ${destructureMid(mid).type} ${destructureMid(mid).draw} ${destructureMid(mid).match_no}`
      }}</div>
    </div>

    <template v-else>{{ pageTitle }}</template>
  </div>
</template>
