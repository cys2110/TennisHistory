<script setup lang="ts">
const formatName = useFormatName()
const paramName = useRouteParams<string>("name")
const id = useRouteParams<string>("id")
const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")

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
const items = computed(() => [{ label: "Players", to: { name: "players" } }, { label: player.value?.name ?? formatName.capitaliseName.value }, { label: currentPage.value?.label ?? "" }])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel
      id="player"
      class="min-h-screen"
    >
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
            <u-icon
              v-if="currentPage"
              :name="currentPage.icon"
            />
          </template>
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
        </u-dashboard-navbar>
        <u-dashboard-toolbar v-if="$slots['toolbar'] || $slots['toolbar-left'] || $slots['toolbar-right']">
          <template
            #left
            v-if="$slots['toolbar-left']"
          >
            <slot name="toolbar-left" />
          </template>
          <slot name="toolbar" />
          <template
            #right
            v-if="$slots['toolbar-right']"
          >
            <slot name="toolbar-right" />
          </template>
        </u-dashboard-toolbar>
      </template>
      <template #body>
        <u-page-header
          headline="Players"
          :title="player?.name ?? formatName.capitaliseName.value"
          :description="currentPage?.label"
        />
        <slot />
      </template>
    </u-dashboard-panel>
  </div>
</template>
