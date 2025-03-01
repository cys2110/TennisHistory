<script setup lang="ts">
definePageMeta({ name: "results", layout: "event-layout" })
const toast = useToast()
const eid = useRouteParams<string>("eid")
const formatName = useFormatName()

// API call
const { data: results } = await useFetch<EventResultsType[]>("/api/eventResults", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching event results",
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
    color="secondary"
  >
    <template #indicator="{ item }">
      {{ sHORTROUNDS[item.title] }}
    </template>

    <template #content="{ item }">
      <u-page-grid class="py-10 xl:!grid-cols-3">
        <result-card
          v-for="match in item.matches"
          :key="match.mid"
          :match="match"
        />
      </u-page-grid>
    </template>
  </u-stepper>
  <error-message
    v-else
    :icon="ICONS['no-info']"
    :title="`No results found for ${formatName.capitaliseName.value}`"
  />
</template>
