<script setup lang="ts">
definePageMeta({ name: "results" })
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const eid = useRouteParams<string>("eid")

// API call
const { data: results, status } = await useFetch<{ title: RoundType; matches: ResultsMatchType[] }[]>("/api/event-results", { query: { eid } })
</script>

<template>
  <div>
    <nuxt-layout name="event-layout">
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
        :icon="ICONS.noInfo"
        :title="`No results found for ${name}`"
        :status
        :error="`Error fetching results for ${name}`"
      />
    </nuxt-layout>
  </div>
</template>
