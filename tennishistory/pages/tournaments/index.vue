<script setup lang="ts">
useHead({ title: "Tournaments", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", icon: ICONS.tournament }
])

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

interface TournamentAPIResponse {
  count: number
  tournaments: (Pick<TournamentInterface, "id" | "name" | "years"> & { draw_type: DrawType })[]
}

// API call
const { data, status } = await useFetch<TournamentAPIResponse>("/api/tournaments", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 25), limit: pageSize },
  default: () => ({ count: 0, tournaments: [] }),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching tournaments",
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
  }
})
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
      v-if="data.count || ['pending', 'idle'].includes(status)"
      class="mt-10"
    >
      <!--Only show cards if any tournaments returned-->
      <tournament-card
        v-if="data.count"
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
    />
  </paginated-overview>
</template>
