<script setup lang="ts">
definePageMeta({ name: "tournaments" })
useHead({ title: "Tournaments", templateParams: { subPage: null } })
const toast = useToast()

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

interface TournamentAPIResponse {
  count: number
  tournaments: (Pick<TournamentInterface, "id" | "name" | "years"> & { draw_type: DrawType })[]
}

// API call
const { data, status } = await useFetch<TournamentAPIResponse>("/api/all-tournaments", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 25), limit: pageSize },
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching tournaments",
      description: error?.message,
      icon: ICONS.error,
      color: "error"
    })
  }
})

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
    <u-page-grid
      v-if="(data && data.count > 0) || status === 'pending'"
      class="mt-10"
    >
      <!--Only show cards if any tournaments returned-->
      <tournament-card
        v-if="data"
        v-for="tournament in data.tournaments"
        :key="tournament.id"
        :tournament
      />
      <!--Loading state-->
      <base-loading-card
        v-else
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <!--Error state/No results-->
    <error-message
      v-else
      :icon="ICONS.noTournament"
      title="No tournaments found"
      :status
      error="tournaments"
    />
  </paginated-overview>
</template>
