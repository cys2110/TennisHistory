<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { DateTime } from 'luxon'
import { GET_ARCHIVE } from '@/services/EventService'
import type { EventCard } from '@/utils/types'

// [FUTURE: ADD FILTERS BY MONTH AND CATEGORY]

const router = useRouter()
const route = useRoute()

// Update document title
document.title = 'Results Archive | TennisHistory'

// Variables
const events: Ref<EventCard[] | null> = ref(null)
const years = Array.from({ length: DateTime.now().year - 1968 + 1 }, (_, index) => ({
  label: 1968 + index,
  value: 1968 + index,
}))
const searchYear = ref(
  route.query.year ? parseInt(route.query.year as string) : DateTime.now().year,
)

// API call
const { query, variables } = GET_ARCHIVE(searchYear.value)
const { result, loading, error } = useQuery(query, variables)

watch(
  result,
  (newResult) => {
    if (newResult) events.value = newResult.events
  },
  { immediate: true },
)

watch(
  error,
  (newError) => {
    if (newError) console.error(newError)
  },
  { immediate: true },
)

// Handle year selection
const handleSelection = () => router.push({ query: { year: searchYear.value } })
</script>

<template>
  <Title>
    <template #title>Results Archive</template>
  </Title>
  <a-select show-search :options="years" v-model:value="searchYear" size="large" class="text-center mb-5"
    @change="handleSelection" />
  <a-row v-if="events" justify="space-evenly" align="stretch" :gutter="[0, 32]">
    <a-col v-for="event in events" :key="event.id" :xs="24" :sm="11" :md="10" :xl="5">
      <EventCard :event />
    </a-col>
  </a-row>
  <Loading v-else :loading>
    <template #none>No tournaments played</template>
  </Loading>
</template>