<script setup lang="ts">
import defaultLayout from "./default.vue"
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")

const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === route.name))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: name.value } })

// API call
const { data: years } = await useFetch<{ years: number[]; labels: string[][] }>("/api/player-years", { query: { id } })

// Set state for other player components
const playerYears = useState("player-years", () => years.value?.years ?? [])

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Players", to: { name: "players" }, icon: ICONS.people },
  {
    label: name.value,
    avatar: { src: `https://www.atptour.com/-/media/alias/player-headshot/${id.value}`, icon: ICONS.player, class: "border border-neutral-400" },
    to: { name: "player", params: { name: paramName.value, id: id.value } }
  },
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
          <u-button
            v-if="mdAndUp && years && years.labels[0].includes('Coach')"
            :icon="ICONS.coach"
            label="Coach Profile"
            :to="{ name: 'coach', params: { id } }"
            size="xs"
          />
          <u-dropdown-menu
            v-if="!mdAndUp"
            :items="[...PLAYER_PAGES, { label: 'Coach Profile', icon: ICONS.coach, to: { name: 'coach', params: { id } } }]"
          >
            <u-button
              :icon="ICONS.layers"
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
      <slot />
    </default-layout>
  </div>
</template>
