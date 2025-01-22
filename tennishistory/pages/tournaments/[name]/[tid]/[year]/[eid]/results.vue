<script setup lang="ts">
definePageMeta({ name: "results", layout: "event-layout" })
const route = useRoute()
const toast = useToast()

// API call
const { data: results, status } = await useFetch<EventResultsType[]>("/api/eventResults", {
  query: { eid: route.params.eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-stepper
    v-if="results"
    :items="results"
    :linear="false"
  >
    <template #indicator="{ item }">
      {{ SHORT_ROUNDS[item.title] }}
    </template>

    <template #content="{ item }">
      <u-page-grid>
        <result-card
          v-for="match in item.matches"
          :key="match.mid"
          :match
        />
      </u-page-grid>
    </template>
  </u-stepper>
</template>
