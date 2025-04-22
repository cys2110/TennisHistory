<script setup lang="ts">
definePageMeta({ name: "players" })
useHead({ title: "Players", templateParams: { subPage: null } })

interface PlayerAPIResponse {
  count: number
  players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]
}

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

// API call
const { data, status } = await useFetch<PlayerAPIResponse>("/api/all-players", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 25), limit: pageSize }
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
    <!--Only show cards if any players returned-->
    <u-page-grid
      v-if="data && data.count > 0"
      class="mt-10"
    >
      <player-card
        v-for="player in data.players"
        :key="player.id"
        :id="player.id"
        :player
      />
    </u-page-grid>

    <u-page-grid v-else-if="status === 'pending'">
      <player-loading-card
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      :icon="ICONS.noPeople"
      title="No players found"
      :status
      error="Error fetching players"
    />
  </paginated-overview>
</template>
