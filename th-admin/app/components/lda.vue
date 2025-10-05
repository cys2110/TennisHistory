<script setup lang="ts">
const { query } = useRoute()
const addLdas = ref<number[]>([])

const { data: entries, status } = await useFetch("/api/get-lda", {
  query: { id: query.id },
  default: () => []
})

function handleAddLda() {
  addLdas.value.push(Date.now()) // ensures unique key
}
</script>

<template>
  <u-page-list class="*:m-2">
    <u-button
      label="Add LDA"
      @click="handleAddLda"
    />
    <client-only>
      <add-lda
        v-for="n in addLdas"
        :key="`add-lda-${n}`"
      />
    </client-only>
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <edit-lda
      v-for="(entry, index) in entries"
      :key="`lda-${index}`"
      :entry
    />
  </u-page-list>
</template>
