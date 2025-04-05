<script setup lang="ts">
definePageMeta({ name: "coach" })
const toast = useToast()
const id = useRouteParams<string>("id")

interface CoachAPIResponse {
  labels: string[]
  name: string
  players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]
}

// API call
const { data: coach, status } = await useFetch<CoachAPIResponse>("/api/coach-details", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching coach details`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

useHead({ title: coach.value?.name, templateParams: { subPage: "Coaches" } })

// Breadcrumbs
const items = computed(() => [{ label: "Home", to: { name: "home" }, icon: ICONS.home }, { label: "Coaches", to: { name: "coaches" }, icon: ICONS.coach }, { label: coach.value?.name }])

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
        <u-breadcrumb :items="items" />
      </template>

      <!--TOC-->
      <template #right>
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
      </template>

      <template #toolbar>
        <div class="text-(--ui-text-muted) text-sm font-semibold">Players coached by {{ coach?.name }}</div>
      </template>

      <u-page-grid
        v-if="coach && coach.players.length > 0"
        class="mt-10"
      >
        <player-card
          v-for="player in coach.players"
          :key="player.id"
          :id="player.id"
          :player
        />
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS.noPeople"
        :title="`No players coached by ${coach?.name}`"
        :status
      />
    </nuxt-layout>
  </div>
</template>
