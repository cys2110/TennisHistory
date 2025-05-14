<script setup lang="ts">
defineProps<{
  results: MajorResultsType[]
  status: APIStatusType
}>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
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
    <base-loading-card
      v-else
      v-for="_ in 5"
      :key="_"
    />
  </u-page-columns>

  <!--Error/no results state-->
  <error-message
    v-else
    :message="`No results found for ${name}`"
    :icon="ICONS.noTournament"
  />
</template>
