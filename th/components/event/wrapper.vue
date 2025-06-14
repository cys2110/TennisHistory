<script setup lang="ts">
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const {
  params: { id, name, year, eid }
} = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const xlAndUp = breakpoints.greaterOrEqual("xl")

type APIResponseType = Pick<EventInterface, "tours" | "atp_link" | "wiki_link" | "wta_link"> & {
  years: number[]
  coach: boolean
}

// API call
const { data: event } = await useFetch<APIResponseType>(() => "/api/events/overview", {
  query: { id: eid }
})

const otherLinks = computed(() => {
  if (event.value) {
    return [
      event.value.atp_link && {
        label: "ATP Profile",
        color: event.value.tours.includes("ITF") ? "men" : "atp",
        icon: appIcons.external,
        to: event.value.atp_link
      },
      event.value.wta_link && {
        label: "WTA Profile",
        color: event.value.tours.includes("ITF") ? "women" : "wta",
        icon: appIcons.external,
        to: event.value.wta_link
      },
      event.value.wiki_link && { label: "Wikipedia", color: "primary", icon: appIcons.external, to: event.value.wiki_link }
    ].filter(Boolean) as { label: string; icon?: string; to?: string; color: "wta" | "atp" | "primary" | "men" | "women" }[]
  }
  return []
})
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <div
        v-if="xlAndUp"
        class="flex items-center gap-2"
      >
        <event-page-buttons
          :id="Number(id as string)"
          :year="Number(year as string)"
          :tournament="{ name: decodeName(name as string), id: Number(id as string) }"
        />
        <u-button
          v-for="button in otherLinks"
          :key="button.label"
          :icon="button.icon"
          :label="button.label"
          :to="button.to"
          size="xs"
          :color="button.color"
        />
      </div>
      <u-dropdown-menu
        v-else
        :items="[...EVENT_PAGES, ...otherLinks]"
      >
        <u-button
          :icon="icons.layers"
          color="neutral"
          variant="link"
          size="xl"
        />
      </u-dropdown-menu>
    </template>

    <template
      #toolbar
      v-if="$slots.toolbar"
    >
      <slot
        v-if="event"
        name="toolbar"
        :tours="event.tours"
      />
    </template>

    <slot
      v-if="event"
      :tours="event.tours"
    />
  </page-wrapper>
</template>
