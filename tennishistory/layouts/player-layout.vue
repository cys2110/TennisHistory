<script setup lang="ts">
import defaultLayout from "./default.vue"

const formatName = useFormatName()
const paramName = useRouteParams<string>("name")
const id = useRouteParams<string>("id")
const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: NAV_LINKS.flatMap(group => (group.children ? group.children : group))
  }
])

interface PlayerAPIResponse {
  name: string
  start: number
  end: number
}

// API call
const { data: player } = await useFetch<PlayerAPIResponse>("/api/player-name", { query: { id } })

// Set state for other player components
const startYear = useState("startYear", () => (player.value ? player.value.start : "—"))
const endYear = useState("endYear", () => (player.value ? player.value.end : "present"))

formatName.name.value = player.value?.name ?? paramName.value
const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === route.name))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: player.value?.name ?? formatName.capitaliseName.value } })

// Breadcrumbs
const items = computed(() => [
  { label: "Players", to: { name: "players" }, icon: ICONS.people },
  { label: player.value?.name ?? formatName.capitaliseName.value, avatar: { src: `https://www.atptour.com/-/media/alias/player-headshot/${id.value}`, icon: ICONS.person, class: "border border-neutral-400" } },
  { label: currentPage.value?.label ?? "", icon: currentPage.value?.icon }
])
</script>

<template>
  <div>
    <default-layout>
      <template #title>
        <u-breadcrumb :items />
      </template>
      <template #right>
        <ClientOnly>
          <player-page-buttons
            v-if="mdAndUp"
            :name="paramName"
            :id
          />
          <u-dropdown-menu
            v-else
            :items="PLAYER_PAGES"
          >
            <u-button
              :icon="ICONS.layer"
              color="neutral"
              variant="link"
              size="xl"
            />
          </u-dropdown-menu>
        </ClientOnly>
      </template>
      <template
        #toolbar-left
        v-if="$slots['toolbar-left']"
      >
        <slot name="toolbar-left" />
      </template>
      <template
        #toolbar-right
        v-if="$slots['toolbar-right']"
      >
        <slot name="toolbar-right" />
      </template>
      <template
        #toolbar
        v-if="$slots['toolbar']"
      >
        <slot name="toolbar" />
      </template>
      <u-page-header
        headline="Players"
        :title="player?.name ?? formatName.capitaliseName.value"
        :description="currentPage?.label"
      />
      <slot />
    </default-layout>
  </div>
</template>
