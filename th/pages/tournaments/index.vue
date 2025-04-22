<script setup lang="ts">
definePageMeta({ name: "tournaments" })
useHead({ title: "Tournaments", templateParams: { subPage: null } })

interface TournamentAPIResponse {
  count: number
  tournaments: (Pick<TournamentInterface, "id" | "name" | "years"> & { draw_type: DrawType })[]
}

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

// API call
const { data, status } = await useFetch<TournamentAPIResponse>("/api/all-tournaments", { query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 25), limit: pageSize } })

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", icon: ICONS.tournament }
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
    <!--Only show cards if any tournaments returned-->
    <u-page-grid
      v-if="data && data.count > 0"
      class="mt-10"
    >
      <tournament-card
        v-for="tournament in data.tournaments"
        :key="tournament.id"
        :id="tournament.id"
        :tournament
      />
    </u-page-grid>

    <u-page-grid v-else-if="status === 'pending'">
      <base-loading-card
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      :icon="ICONS.noTournament"
      title="No tournaments found"
      :status
      error="Error fetching tournaments"
    />
  </paginated-overview>
</template>
