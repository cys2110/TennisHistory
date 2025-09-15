<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui"

const {
  name: routeName,
  params: { id, name, year, eid }
} = useRoute("match")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

// API call
const { data: event } = await useFetch<
  Pick<EventInterface, "tours" | "atp_link" | "wta_link" | "men_link" | "women_link" | "wiki_link" | "tournament">
>("/api/events/overview", {
  key: `event-overview-${eid}`,
  query: { id: eid },
  server: false
})

const otherLinks = computed(() => {
  if (event.value) {
    return [
      event.value.atp_link && {
        label: "ATP Profile",
        color: "atp",
        to: event.value.atp_link,
        target: "_blank"
      },
      event.value.wta_link && {
        label: "WTA Profile",
        color: "wta",
        to: event.value.wta_link,
        target: "_blank"
      },
      event.value.men_link && {
        label: "ITF (M) Profile",
        color: "men",
        to: event.value.men_link,
        target: "_blank"
      },
      event.value.women_link && {
        label: "ITF (W) Profile",
        color: "women",
        to: event.value.women_link,
        target: "_blank"
      },
      event.value.wiki_link && { label: "Wikipedia", color: "joint", to: event.value.wiki_link, target: "_blank" }
    ].filter(Boolean) as { label: string; icon?: string; to?: string; color: "wta" | "atp" | "primary" | "men" | "women"; target?: string }[]
  }
  return []
})

onMounted(() => {
  if (routeName !== "match") {
    useHead({
      title: `${EVENT_PAGES.find(page => page.name === routeName)?.label} | ${event.value?.tournament.name ?? capitalCase(name as string)} ${year}`
    })
  }
})

const tours = useState<TourType[]>("tours", () => event.value?.tours ?? [])
const tournamentName = useState<string>("tournament-name", () => event.value?.tournament.name || capitalCase(name as string))

watch(
  event,
  () => {
    if (event.value) {
      tours.value = event.value.tours
      tournamentName.value = event.value.tournament.name || capitalCase(name as string)
    }
  },
  { immediate: true }
)

const toc = [
  { label: "Details", to: "#details", icon: icons.overview },
  { label: "Awards", to: "#awards", icon: icons.awards },
  { label: "Seeds", to: "#seeds", icon: icons.seeds },
  { label: "Entry Information", to: "#entry-info", icon: uIcons.info },
  { label: "Entries", to: "#entries", icon: icons.player }
]
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template #right>
            <slot name="navbar-right" />
            <u-dropdown-menu
              :items="EVENT_PAGES.map(page => ({ ...page, to: { name: page.name, params: { year, eid, name, id } } }) as DropdownMenuItem)"
            >
              <u-button
                :icon="icons.layers"
                variant="ghost"
              />
            </u-dropdown-menu>
            <u-dropdown-menu :items="otherLinks">
              <u-button
                :icon="uIcons.ellipsis"
                variant="ghost"
                :ui="{ leadingIcon: 'rotate-90' }"
              />
            </u-dropdown-menu>
            <!--@vue-expect-error-->
            <u-dropdown-menu
              v-if="routeName === 'event' && !COUNTRY_DRAWS.includes(id as string)"
              :items="toc"
            >
              <u-button
                :icon="icons.toc"
                variant="ghost"
              />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar v-if="$slots['toolbar']">
          <slot name="toolbar" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <slot />
      </template>
    </u-dashboard-panel>
  </div>
</template>
