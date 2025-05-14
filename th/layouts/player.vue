<script setup lang="ts">
import defaultLayout from "./default.vue"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const lgAndUp = breakpoints.greaterOrEqual("lg")

const id = computed(() => route.params.id as string)
const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === route.name))
const name = computed(() => decodeName(route.params.name as string))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: name.value } })

type APIResponseType = {
  years: number[]
  labels: string[]
  atp_link: string | null
  wiki_link: string | null
}

// API call
const { data: player } = await useFetch<APIResponseType>("/api/players/years", {
  query: { id: route.params.id },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name.value}'s overview`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

// Set state for other player components
const playerYears = useState("player-years", () => player.value?.years ?? [])

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Players", to: { name: "players" }, icon: ICONS.people },
  {
    label: name.value,
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${route.params.id}`,
      icon: ICONS.player
    },
    to: { name: "player", params: { name: route.params.name, id: route.params.id } }
  },
  { label: currentPage.value?.label ?? "", icon: currentPage.value?.icon }
])

const additionalButtons = computed(() => {
  if (player.value) {
    return [
      player.value.labels.includes("Coach") && {
        label: "Coach Profile",
        icon: ICONS.coach,
        to: { name: "coach", params: { id } }
      },
      player.value.atp_link && {
        label: "ATP Profile",
        to: player.value.atp_link
      },
      player.value.wiki_link && {
        label: "Wikipedia",
        to: player.value.wiki_link
      }
    ].filter(Boolean) as { label: string; icon?: string; to: string }[]
  }
  return []
})
</script>

<template>
  <div class="w-full">
    <default-layout>
      <u-dashboard-panel>
        <template #header>
          <u-dashboard-navbar>
            <template #leading>
              <u-dashboard-sidebar-collapse />
            </template>

            <template #title>
              <u-breadcrumb :items="breadcrumbs" />
            </template>

            <!--Player subpages / coach profile navigation-->
            <template #right>
              <div
                v-if="lgAndUp"
                class="flex items-center gap-2"
              >
                <player-page-buttons
                  :name
                  :id
                />
                <u-button
                  v-for="button in additionalButtons"
                  :key="button.label"
                  :icon="button.icon ?? appConfig.ui.icons.external"
                  :label="button.label"
                  :to="button.to"
                  size="xs"
                  :color="button.label === 'Coach Profile' ? 'secondary' : 'primary'"
                />
              </div>
              <u-dropdown-menu
                v-else
                :items="[...PLAYER_PAGES, ...additionalButtons]"
              >
                <u-button
                  :icon="ICONS.layers"
                  color="neutral"
                  variant="link"
                  size="xl"
                />
              </u-dropdown-menu>
            </template>
          </u-dashboard-navbar>

          <u-dashboard-toolbar v-if="$slots.toolbar">
            <slot name="toolbar" />
          </u-dashboard-toolbar>
        </template>

        <template #body>
          <slot />
        </template>
      </u-dashboard-panel>
    </default-layout>
  </div>
</template>
