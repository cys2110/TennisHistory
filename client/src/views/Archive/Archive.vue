<script setup lang="ts">
import { ref, watch, watchEffect, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon'
import { getEventsByYear } from '@/services/EventService';
import type { Event } from '@/utils/interfaces';
import ArchiveCard from '@/components/Archive/ArchiveCard.vue';

provideApolloClient(apolloClient)

const years = Array.from({ length: (DateTime.now().year + 1) - 1968 }, (_, index) => DateTime.now().year - index)
const searchYear: Ref<number> = ref(DateTime.now().year)
const events: Ref<Event[]> = ref([])
const load = ref(false)

const updateResults = () => {
    load.value = true

    const { query, variables } = getEventsByYear(searchYear.value)
    const { result, loading, error } = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) events.value = newResult.events
    }, { immediate: true })

    watch(loading, (newLoad) => load.value = newLoad)

    watch(error, (newError) => {
        if (newError) console.error(newError)
    })
}

watchEffect(() => updateResults())
</script>

<template>
    <v-sheet class='bg-transparent m-16 w-75 pa-3 mx-auto'>
        <v-container>
            <v-row class="flex items-center">
                <v-col class="text-4xl text-zinc-300">
                    Results Archive
                </v-col>
                <v-col cols="12" sm="3">
                    <v-combobox class="text-zinc-300" variant="underlined" v-model="searchYear" :items="years" />
                </v-col>
            </v-row>
            <v-row>
                <v-col v-if="events.length > 0" v-for="event in events" :key="event.id" cols="12" sm="4" xl="3">
                    <ArchiveCard :event />
                </v-col>
                <v-col v-else-if="load" class="text-zinc-400 my-5 text-3xl">
                    Loading...
                </v-col>
                <v-col v-else class="text-zinc-400">
                    No data available
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>