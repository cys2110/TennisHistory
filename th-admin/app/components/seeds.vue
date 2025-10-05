<script setup lang="ts">
const { query } = useRoute()

const { data: seeds, status } = await useFetch("/api/get-seeds", {
  query: { id: query.id },
  default: () => []
})
</script>

<template>
  <u-page-list class="*:m-2">
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <edit-seed
      v-for="(seed, index) in seeds"
      :key="`seed-${index}`"
      :seed
    />
  </u-page-list>
</template>
