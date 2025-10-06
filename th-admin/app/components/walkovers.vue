<script setup lang="ts">
const { query } = useRoute()
const addWalkovers = ref<number[]>([])

const { data: entries, status } = await useFetch("/api/get-retirements", {
  query: { id: query.id, type: "WALKOVER" },
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
      <add-retirement
        v-for="n in addWalkovers"
        :key="`add-walkover-${n}`"
        type="Walkover"
      />
    </client-only>
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <edit-retirement
      v-for="(entry, index) in entries"
      :key="`walkover-${index}`"
      :entry
      type="Walkover"
    />
  </u-page-list>
</template>
