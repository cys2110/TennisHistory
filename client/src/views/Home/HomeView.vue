<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { DateTime } from 'luxon'
import { GET_UPCOMING } from '@/services/EventService'
import type { EventCard } from '@/utils/types'

// Update document title
document.title = 'Upcoming Tournaments | TennisHistory'

// Variables
const events: Ref<EventCard[] | null> = ref(null)

// API call to get upcoming tournaments
const { query, variables } = GET_UPCOMING(DateTime.now().toISODate())
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) events.value = newResult.events
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
  <Title>
    <template #title>Upcoming Tournaments</template>
  </Title>
  <div v-if="events" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 w-3/4 mx-auto">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
  </div>
  <Loading v-else :loading>
    <template #none>No upcoming tournaments</template>
  </Loading>
</template>