<script setup lang="ts">
import defaultLayout from "./default.vue"
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual("lg")
const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === route.name))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: name.value } })

// API call
const { data: years, refresh } = await useFetch<{ years: number[]; labels: string[] }>(
  "/api/players/years",
  {
    query: { id },
    watch: false,
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching ${name.value}'s active years`,
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

watch(
  () => id.value,
  newId => {
    if (
      newId &&
      ["player", "activity", "titles-and-finals", "wl-index", "stats"].includes(
        route.name as string
      )
    )
      refresh()
  },
  { immediate: true }
)

// Set state for other player components
const playerYears = useState("player-years", () => years.value?.years ?? [])

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Players", to: { name: "players" }, icon: ICONS.people },
  {
    label: name.value,
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${id.value}`,
      icon: ICONS.player,
      class: "border border-neutral-600 dark:border-neutral-400"
    },
    to: { name: "player", params: { name: paramName.value, id: id.value } }
  },
  { label: currentPage.value?.label ?? "", icon: currentPage.value?.icon }
])
</script>

<template>
  <div>
    <default-layout>
      <template #title>
        <u-breadcrumb :items="items" />
      </template>

      <!--Player subpages / coach profile navigation-->
      <template #right>
        <ClientOnly>
          <div
            v-if="lgAndUp"
            class="flex items-center gap-2"
          >
            <player-page-buttons
              :name="paramName"
              :id
            />
            <u-button
              v-if="years && years.labels.includes('Coach')"
              :icon="ICONS.coach"
              label="Coach Profile"
              :to="{ name: 'coach', params: { id } }"
              size="xs"
            />
          </div>
          <u-dropdown-menu
            v-else
            :items="[
              ...PLAYER_PAGES,
              { label: 'Coach Profile', icon: ICONS.coach, to: { name: 'coach', params: { id } } }
            ]"
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
        #toolbar
        v-if="$slots.toolbar"
      >
        <slot name="toolbar" />
      </template>
      <slot />
    </default-layout>
  </div>
</template>
