<script setup lang="ts">
definePageMeta({
  name: "results",
  layout: "dashboard-layout"
})
const toast = useToast()
const formatName = useFormatName()
const eid = useRouteParams<string>("eid")

// API call
const { data: results } = await useFetch<{ title: RoundType; matches: ResultsMatchType[] }[]>("/api/event-results", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching results for ${formatName.capitaliseName.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <event-wrapper>
    <u-stepper
      v-if="results"
      :items="results"
      :linear="false"
      color="secondary"
    >
      <template #indicator="{ item }">
        {{ SHORT_ROUNDS[item.title] }}
      </template>

      <template #content="{ item }">
        <u-page-grid class="py-10 xl:!grid-cols-3">
          <results-card
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
  </event-wrapper>
</template>
