<script setup lang="ts">
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const { name, params } = useRoute()
const {
  year,
  eid,
  name: paramName,
  id
} = params as {
  name: string
  year: string
  eid: string
  id: string
}

type APIResponseType = Pick<EventInterface, "tours" | "atp_link" | "wiki_link" | "wta_link" | "men_link" | "women_link"> & { tournament: string }

// API call
const { data: event } = await useFetch<APIResponseType>(() => "/api/events/overview", {
  query: { id: eid }
})

useHead({
  title: `${EVENT_PAGES.find(page => page.name === name)?.label} | ${event.value?.tournament} ${year}`
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

// TOC
const toc = computed(() => [
  {
    label: "Details",
    to: "#details",
    icon: icons.overview
  },
  {
    label: "Awards",
    to: "#awards",
    icon: icons.awards
  },
  {
    label: "Seeds",
    to: "#seeds",
    icon: icons.seeds
  },
  {
    label: "Entry Information",
    to: "#entry-info",
    icon: appIcons.info
  },
  {
    label: "Entries",
    to: "#entries",
    icon: icons.player
  }
])
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <!--@vue-expect-error-->
      <u-dropdown-menu :items="EVENT_PAGES.map(page => ({ ...page, to: { name: page.name, params: { year, eid, name: paramName, id } } }))">
        <u-button
          :icon="icons.layers"
          variant="ghost"
        />
      </u-dropdown-menu>
      <u-dropdown-menu :items="otherLinks">
        <u-button
          :icon="appIcons.ellipsis"
          variant="ghost"
          :ui="{ leadingIcon: 'rotate-90' }"
        />
      </u-dropdown-menu>
      <u-dropdown-menu
        v-if="name === 'event'"
        :items="toc"
      >
        <u-button
          :icon="icons.toc"
          variant="ghost"
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
