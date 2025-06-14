<script setup lang="ts">
const page = ref(1)
const selectedLetter = defineModel<string>()

// API call
const { data, status } = await useFetch<APIUmpiresResponseType>("/api/umpires", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 40) }
})

// Reset page when the selected letter changes
watch(selectedLetter, () => (page.value = 1))
</script>

<template>
  <u-page-grid
    v-if="(data && data.count) || ['pending', 'idle'].includes(status)"
    class="my-5"
  >
    <u-page-card
      v-if="data?.count"
      v-for="umpire in data.umpires"
      :key="umpire.id"
      :title="umpire.name"
      :to="{ name: 'umpire', params: { id: encodeName(umpire.id) } }"
      highlight
      highlight-color="joint"
      :ui="{
        body: 'mx-auto w-full',
        title: 'text-center flex items-center gap-2 justify-center',
        container: 'items-center'
      }"
    />
    <loading-base
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    message="No umpires found"
  />
  <u-pagination
    v-if="data && data.count"
    v-model:page="page"
    :total="data.count"
    :items-per-page="40"
    variant="ghost"
    color="primary"
    active-variant="subtle"
    class="mx-auto mt-auto"
  />
</template>
