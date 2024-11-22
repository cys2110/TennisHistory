<script setup>
import { ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import { DateTime } from 'luxon';
import { GET_UPCOMING } from '@/services/EventService';

document.title = "Upcoming Tournaments | TennisHistory"

provideApolloClient(apolloClient)

const { query, variables } = GET_UPCOMING(DateTime.now().toISODate())
const { result, loading, error } = useQuery(query, variables)

const events = ref([])

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
    <a-row v-if="events?.length > 0" justify="space-evenly" align="stretch" :gutter="[0, 32]">
        <a-col v-for="event in events" :key="event.id" :xs=24 :sm=11 :md=7 :xl=5>
            <EventCard :event />
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No upcoming tournaments</template>
    </Loading>
</template>