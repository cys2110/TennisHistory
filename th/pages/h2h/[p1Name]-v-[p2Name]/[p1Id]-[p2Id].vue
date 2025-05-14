<script setup lang="ts">
definePageMeta({ name: "h2h-players" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const lgAndUp = breakpoints.greaterOrEqual("lg")

const p1Name = computed(() => decodeName(route.params.p1Name as string))
const p2Name = computed(() => decodeName(route.params.p2Name as string))
useHead({ title: `${p1Name.value} v. ${p2Name.value}`, templateParams: { subPage: "H2H" } })

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Head to Head", to: { name: "h2h" }, icon: ICONS.h2h },
  { slot: "players" as const, label: `${p1Name.value} v. ${p2Name.value}` }
]

// Related links
const links = computed(() => [
  {
    label: p1Name.value,
    to: { name: "player", params: { name: route.params.p1Name, id: route.params.p1Id } },
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${route.params.p1Id}`,
      icon: ICONS.player
    }
  },
  {
    label: p2Name.value,
    to: { name: "player", params: { name: route.params.p2Name, id: route.params.p2Id } },
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${route.params.p2Id}`,
      icon: ICONS.player
    }
  }
])

// API call
const { data: h2h } = await useFetch<{ p1: CountryInterface; p2: CountryInterface }>("/api/h2h/countries", {
  query: { p1Id: route.params.p1Id, p2Id: route.params.p2Id },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching countries for ${p1Name.value} v. ${p2Name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items>
              <template #players-leading>
                <u-avatar
                  :src="`https://www.atptour.com/-/media/alias/player-headshot/${route.params.p1Id}`"
                  :icon="ICONS.player"
                  size="sm"
                />
              </template>
              <template #players-trailing>
                <u-avatar
                  :src="`https://www.atptour.com/-/media/alias/player-headshot/${route.params.p2Id}`"
                  :icon="ICONS.player"
                  size="sm"
                />
              </template>
            </u-breadcrumb>
          </template>

          <template #right>
            <u-button
              v-if="lgAndUp"
              v-for="link in links"
              :key="link.label"
              :to="link.to"
              :label="link.label"
              :avatar="link.avatar"
              size="sm"
            />
            <u-dropdown-menu
              v-else
              :items="links"
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

        <u-dashboard-toolbar>
          <player-search
            v-if="h2h"
            :index="1"
            :country="h2h?.p1"
          />
          <player-search
            v-if="h2h"
            :index="2"
            :country="h2h?.p2"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <div v-if="h2h">
          <h2h-details
            v-if="h2h"
            :c1="h2h.p1"
            :c2="h2h.p2"
          />

          <h2h-matches v-if="h2h" />
        </div>

        <error-message
          v-else
          :icon="ICONS.noH2H"
          :message="`No head to head found between ${p1Name} and ${p2Name}`"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
