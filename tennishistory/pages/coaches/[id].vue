<script setup lang="ts">
// XXX: Add coach's players' stats
definePageMeta({ name: "coach" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")

interface CoachAPIResponse {
  labels: string[]
  name: string
  players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]
}

// API call
const { data: coach, status } = await useFetch<CoachAPIResponse>("/api/coaches/coach-details", {
  query: { id: route.params.id },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details about ${decodeName(route.params.id as string)}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
  }
})

useHead({
  title: coach.value?.name ?? decodeName(route.params.id as string),
  templateParams: { subPage: "Coaches" }
})

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Coaches", to: { name: "coaches" }, icon: ICONS.coach },
  { slot: "coach", label: coach.value?.name }
])

// Anchor links
const links = computed(() => {
  if (coach.value)
    return coach.value.players.map(player => ({
      to: player.id,
      label: player.name
    }))
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items="items">
          <template #coach-leading>
            <u-avatar
              v-if="coach && coach.labels.includes('Player')"
              :src="`https://www.atptour.com/-/media/alias/player-headshot/${route.params.id}`"
              :to="{
                name: 'player',
                params: { id: route.params.id, name: encodeName(coach.name) }
              }"
              :icon="ICONS.coach"
              size="sm"
            />
          </template>
        </u-breadcrumb>
      </template>

      <template #right>
        <ClientOnly>
          <u-button
            v-if="coach && coach.labels.includes('Player')"
            :icon="ICONS.player"
            label="Player Profile"
            :to="{ name: 'player', params: { id: route.params.id, name: encodeName(coach.name) } }"
            :size="mdAndUp ? 'md' : 'sm'"
          />
        </ClientOnly>
      </template>

      <template #toolbar>
        <div class="text-(--ui-text-muted) text-sm font-semibold">
          Players coached by {{ coach?.name }}
        </div>

        <!--TOC-->
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
      </template>

      <u-page-grid v-if="coach?.players.length || ['pending', 'error'].includes(status)">
        <player-card
          v-if="coach"
          v-for="player in coach.players"
          :key="player.id"
          :id="player.id"
          :player
        />
        <player-loading-card
          v-else
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS.noPeople"
        :title="`No players coached by ${coach?.name}`"
      />
    </nuxt-layout>
  </div>
</template>
