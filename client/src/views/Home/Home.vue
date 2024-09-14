<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { getUpcomingEvents } from '@/services/EventService';
import type { Event } from '@/utils/interfaces';
import Title from '@/components/Global/Title.vue';
import Loading from '@/components/Global/Loading.vue';
import EventCard from '@/components/Global/EventCard.vue';

provideApolloClient(apolloClient)

const { query, variables } = getUpcomingEvents(DateTime.now().toISODate())
const { result, loading, error } = useQuery(query, variables)

const events: Ref<Event[]> = ref([])

watch(result, (newResult) => {
    if (newResult) events.value = newResult.events
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
})
</script>

<template>
    <v-sheet class="bg-transparent m-16 w-75 pa-3 mx-auto">
        <Title>
            <template #title>Upcoming Tournaments</template>
        </Title>
        <v-container v-if="events.length > 0">
            <v-row>
                <v-col v-for="event in events" :key="event.id" cols="12" sm="4" xl="3">
                    <EventCard :event />
                </v-col>
            </v-row>
        </v-container>
        <Loading v-else :loading>
            <template #none>No upcoming tournaments</template>
        </Loading>
    </v-sheet>
</template>