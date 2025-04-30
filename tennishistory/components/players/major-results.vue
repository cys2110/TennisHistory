<script setup lang="ts">
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

// API call
const {
  data: results,
  status,
  refresh
} = await useFetch<MajorResultsType[]>("/api/players/major-results", {
  query: { id },
  default: () => [],
  watch: false,
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

watch(
  () => id.value,
  newId => {
    if (newId && route.name === "player") refresh()
  },
  { immediate: true }
)
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
