<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: results, status } = await useFetch<MajorResultsType[]>("/api/players/major-results", {
  query: { id: route.params.id },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name.value}'s best results`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Best Results"
    :icon="ICONS.tournament"
  >
    <u-page-columns
      v-if="results.length || ['pending', 'idle'].includes(status)"
      class="lg:columns-2 xl:columns-2 2xl:columns-2"
    >
      <!--Show if player has major results-->
      <major-results-card
        v-if="results.length"
        v-for="result in results"
        :key="result.tournament.id"
        :result
      />

      <!--Loading state-->
      <major-results-loading-card
        v-else
        v-for="_ in 5"
        :key="_"
      />
    </u-page-columns>

    <!--Error/no results state-->
    <error-message
      v-else
      :title="`No results found for ${name}`"
      :icon="ICONS.noTournament"
    />
  </dashboard-subpanel>
</template>
