<script setup lang="ts">
const {
  name,
  // @ts-ignore
  params: { year, eid, name: paramName }
} = useRoute()

// API call
const { data: event } = await useFetch<
  Pick<EventInterface, "tours" | "atp_link" | "wta_link" | "men_link" | "women_link" | "wiki_link" | "tournament">
>("/api/events/overview", { key: `event-overview-${eid}`, query: { id: eid } })

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
  if (name !== "match") {
    useHead({
      title: `${EVENT_PAGES.find(page => page.name === name)?.label} | ${event.value?.tournament.name ?? capitalCase(paramName as string)} ${year}`
    })
  }
})
</script>

<template>
  <div class="w-full">
    <slot
      v-if="event"
      :tours="event.tours"
      :tournament="event.tournament"
      :other-links="otherLinks"
    />
  </div>
</template>
