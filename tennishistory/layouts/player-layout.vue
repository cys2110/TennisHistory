<script setup lang="ts">
import defaultLayout from "./default.vue"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual("lg")
const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === route.name))
const name = computed(() => decodeName(route.params.name as string))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: name.value } })

// API call
const { data: years } = await useFetch<{ years: number[]; labels: string[] }>(
  "/api/players/years",
  {
    query: { id: route.params.id },
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

// Set state for other player components
const playerYears = useState("player-years", () => years.value?.years ?? [])

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Players", to: { name: "players" }, icon: ICONS.people },
  {
    label: name.value,
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${route.params.id}`,
      icon: ICONS.player,
      class: "border border-neutral-600 dark:border-neutral-400"
    },
    to: { name: "player", params: { name: route.params.name, id: route.params.id } }
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
              :name="route.params.name as string"
              :id="route.params.id as string"
            />
            <u-button
              v-if="years && years.labels.includes('Coach')"
              :icon="ICONS.coach"
              label="Coach Profile"
              :to="{ name: 'coach', params: { id: route.params.id } }"
              size="xs"
            />
          </div>
          <u-dropdown-menu
            v-else
            :items="[
              ...PLAYER_PAGES,
              {
                label: 'Coach Profile',
                icon: ICONS.coach,
                to: { name: 'coach', params: { id: route.params.id } }
              }
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
