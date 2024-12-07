<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable'
import { DateTime } from 'luxon';
import { GET_UPCOMING } from '@/services/EventService';
import type { EventCard } from '@/utils/types';

// Update document title
document.title = "Upcoming Tournaments | TennisHistory"

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
    <a-row v-if="events" justify="space-evenly" align="stretch" :gutter="[0, 32]">
        <a-col v-for="event in events" :key="event.id" :xs="24" :sm="11" :md="10" :xl="5">
            <EventCard :event />
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No upcoming tournaments</template>
    </Loading>
</template>