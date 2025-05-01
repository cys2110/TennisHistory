<script setup lang="ts">
definePageMeta({ name: "results" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))

type ResultsType = {
  title: RoundType
  matches: Pick<
    MatchInterface,
    "match_no" | "date" | "court" | "duration" | "incomplete" | "umpire" | "winner" | "loser"
  >[]
}

// API call
const { data: results, status } = await useFetch<ResultsType[]>("/api/events/results", {
  query: { eid: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching results for ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="event-layout">
      <u-stepper
        v-if="results.length"
        :items="results"
        :linear="false"
        color="secondary"
      >
        <template #indicator="{ item }">
          {{ SHORT_ROUNDS[item.title] }}
        </template>
        <template #content="{ item }">
          <u-page-grid class="py-10 xl:!grid-cols-3">
            <result-card
              v-for="match in item.matches"
              :key="match.match_no"
              :match="match"
            />
          </u-page-grid>
        </template>
      </u-stepper>
      <error-message
        v-else
        :title="`No results found for ${name}`"
      />
    </nuxt-layout>
  </div>
</template>
