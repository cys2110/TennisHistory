<script setup lang="ts">
defineProps<{
  results: CoachesAPIResponseType
  status: "success" | "pending" | "idle" | "error"
}>()
</script>

<template>
  <u-page-grid
    v-if="results.count || status !== 'error'"
    class="mt-10"
  >
    <coach-card
      v-if="results.count"
      v-for="coach in results.coaches"
      :key="coach.id"
      :coach
    />
    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>

  <error-message
    v-else
    title="No coaches found"
  />
</template>
