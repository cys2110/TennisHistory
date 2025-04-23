<script setup lang="ts">
definePageMeta({ name: "players" })
useHead({ title: "Players", templateParams: { subPage: null } })
const toast = useToast()

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

interface PlayerAPIResponse {
  count: number
  players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]
}

// API call
const { data, status } = await useFetch<PlayerAPIResponse>("/api/all-players", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 25), limit: pageSize },
  default: () => ({ count: 0, players: [] }),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching players",
      description: error?.message,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Players", icon: ICONS.people }
])
</script>

<template>
  <paginated-overview
    :breadcrumbs
    v-model="selectedLetter"
    v-model:page="page"
    v-model:page-size="pageSize"
    :count="data?.count"
  >
    <u-page-grid
      class="mt-10"
      v-if="data.count || ['pending', 'idle'].includes(status)"
    >
      <!--Only show cards if any players returned-->
      <player-card
        v-if="data.count"
        v-for="player in data.players"
        :key="player.id"
        :id="player.id"
        :player
      />

      <!--Loading state-->
      <player-loading-card
        v-else
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <!--Error state / No results-->
    <error-message
      v-else
      :icon="ICONS.noPeople"
      title="No players found"
      :status
      error="players"
    />
  </paginated-overview>
</template>
