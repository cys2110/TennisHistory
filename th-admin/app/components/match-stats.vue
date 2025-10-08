<script setup lang="ts">
const { query } = useRoute()

const { data: matches, status } = await useFetch<any>("/api/get-matches", {
  query: { id: query.id },
  default: () => []
})
</script>

<template>
  <u-page-list class="*:m-2">
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <edit-match
      v-else
      v-for="match in matches"
      :key="match.id"
      :match
    />
  </u-page-list>
</template>
