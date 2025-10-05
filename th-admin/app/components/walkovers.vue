<script setup lang="ts">
const { query } = useRoute()
const addWalkovers = ref<number[]>([])

const { data: entries, status } = await useFetch("/api/get-walkovers", {
  query: { id: query.id },
  default: () => []
})

function handleAddWalkover() {
  addWalkovers.value.push(Date.now()) // ensures unique key
}
</script>

<template>
  <u-page-list class="*:m-2">
    <u-button
      label="Add Walkover"
      @click="handleAddWalkover"
    />
    <client-only>
      <add-walkover
        v-for="n in addWalkovers"
        :key="`add-walkover-${n}`"
      />
    </client-only>
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <edit-walkover
      v-for="(entry, index) in entries"
      :key="`walkover-${index}`"
      :entry
    />
  </u-page-list>
</template>
