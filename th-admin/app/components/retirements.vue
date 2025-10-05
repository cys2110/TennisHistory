<script setup lang="ts">
const { query } = useRoute()
const addRetirements = ref<number[]>([])

const { data: entries, status } = await useFetch("/api/get-retirements", {
  query: { id: query.id },
  default: () => []
})

function handleAddRetirement() {
  addRetirements.value.push(Date.now()) // ensures unique key
}
</script>

<template>
  <u-page-list class="*:m-2">
    <u-button
      label="Add Retirement"
      @click="handleAddRetirement"
    />
    <client-only>
      <add-retirement
        v-for="n in addRetirements"
        :key="`add-retirement-${n}`"
      />
    </client-only>
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <edit-retirement
      v-for="(entry, index) in entries"
      :key="`retirement-${index}`"
      :entry
    />
  </u-page-list>
</template>
