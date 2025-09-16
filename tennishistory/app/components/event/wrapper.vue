<script setup lang="ts">
import type { PageLink } from "@nuxt/ui"

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
        to: event.value.atp_link,
        target: "_blank"
      },
      event.value.wta_link && {
        label: "WTA Profile",
        to: event.value.wta_link,
        target: "_blank"
      },
      event.value.men_link && {
        label: "ITF (M) Profile",
        to: event.value.men_link,
        target: "_blank"
      },
      event.value.women_link && {
        label: "ITF (W) Profile",
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
    }
  },
  { immediate: true }
)
</script>

<template>
  <u-container>
    <u-page>
      <template #left>
        <u-page-aside>
          <u-page-links
            :links="
              EVENT_PAGES.map(page => ({ label: page.label, to: { name: page.name, params: { name, id, year, eid } }, icon: page.icon }) as PageLink)
            "
            class="my-5"
          />
          <u-separator class="my-5" />
          <u-page-links :links="otherLinks" />
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <div id="page-right" />
        </u-page-aside>
      </template>

      <u-page-header :headline="`${tournamentName} ${year}`">
        <template #title>
          <slot
            v-if="$slots.title"
            name="title"
          />
          <template v-else> {{ EVENT_PAGES.find(page => page.name === routeName)?.label }} </template>
        </template>
      </u-page-header>

      <u-page-body>
        <slot />
      </u-page-body>
    </u-page>
  </u-container>
</template>
