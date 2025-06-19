<script setup lang="ts">
definePageMeta({ name: "results" })
const { icons } = useAppConfig()

const {
  name,
  params: { name: paramName, year, eid }
} = useRoute()
const currentPage = computed(() => EVENT_PAGES.find(page => page.name === name))
const tournamentName = computed(() => decodeName(paramName as string))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: `${tournamentName.value} ${year}` } })

// API call
const { data: results, status } = await useFetch<ResultsType[]>("/api/events/results", {
  query: { id: eid },
  default: () => []
})
</script>

<template>
  <!-- <event-wrapper> -->
  <div
    v-if="results"
    class="flex flex-col gap-3 overflow-y-auto"
  >
    <div
      v-for="result in results"
      :key="result.title"
    >
      <div class="font-bold">{{ result.title }}</div>
      <div class="flex flex-col gap-2">
        <div
          v-for="(match, index) in result.matches"
          :key="index"
        >
          <div>Umpire: {{ match.umpire }}</div>
          <div>Court: {{ match.court }}</div>
          <div>Date: {{ match.date }}</div>
          <div>Winner: {{ match.winner }}</div>
          <div>Loser: {{ match.loser }}</div>
          <div>Incomplete: {{ match.incomplete }}</div>
        </div>
      </div>
    </div>
  </div>
  <!-- </event-wrapper> -->
</template>
