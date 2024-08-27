<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { getUpcomingEvents } from '@/services/EventService';
import type { Event } from '@/utils/interfaces';
import UpcomingCard from '@/components/Home/UpcomingCard.vue';

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
    <v-sheet class='bg-transparent m-16 w-75 pa-3 mx-auto'>
        <div class="!text-4xl !text-zinc-300">
            Upcoming Tournaments
        </div>
        <v-container v-if="events.length > 0">
            <v-row>
                <v-col v-for="event in events" :key="event.id" cols="12" sm="4" xl="3">
                    <UpcomingCard :event />
                </v-col>
            </v-row>
        </v-container>
        <div v-else-if="loading" class="!text-zinc-400 my-5">
            Loading...
        </div>
        <div v-else class="!text-zinc-400 my-5">
            No upcoming tournaments
        </div>
    </v-sheet>
</template>