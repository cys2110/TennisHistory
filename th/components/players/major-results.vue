<script setup lang="ts">
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))

// API call
const { data: results, status } = await useFetch<MajorResultsInterface[]>("/api/major-results", { query: { id } })
</script>

<template>
  <dashboard-subpanel
    title="Best Results"
    :icon="ICONS.tournament"
  >
    <u-page-columns
      v-if="results"
      class="lg:columns-2 xl:columns-2 2xl:columns-2"
    >
      <major-results-card
        v-for="result in results"
        :key="result.tid"
        :result
      />
    </u-page-columns>
    <u-page-columns
      v-else-if="status === 'pending'"
      class="lg:columns-2 xl:columns-2 2xl:columns-2"
    >
      <major-results-loading-card
        v-for="_ in 5"
        :key="_"
      />
    </u-page-columns>
    <error-message
      v-else
      :title="`No results found for ${name}`"
      :status
      :error="`Error fetching results for ${name}`"
      :icon="ICONS.noTournament"
    />
  </dashboard-subpanel>
</template>
