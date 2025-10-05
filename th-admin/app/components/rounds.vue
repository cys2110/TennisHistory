<script setup lang="ts">
const { query } = useRoute()
const addRounds = ref<number[]>([])

const { data: rounds, status } = await useFetch("/api/get-rounds", {
  query: { id: query.id },
  default: () => []
})

function handleAddRound() {
  addRounds.value.push(Date.now()) // ensures unique key
}
</script>

<template>
  <u-page-list class="*:my-2">
    <u-button
      label="Add Round"
      @click="handleAddRound"
    />
    <client-only>
      <add-round
        v-for="n in addRounds"
        :key="`add-round-${n}`"
      />
    </client-only>
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <edit-round
      v-for="(round, index) in rounds"
      :key="`round-${index}`"
      :round
    />
  </u-page-list>
</template>
