<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { DateTime } from 'luxon';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { getUpcomingEditions } from '@/services/APICalls';
import UpcomingCard from '@/components/Home/UpcomingCard.vue';
import type { Edition } from '@/components/interfaces';

provideApolloClient(apolloClient)

const { query, variables } = getUpcomingEditions(DateTime.now().toISODate())
const { result, loading, error} = useQuery(query, variables)

const upcoming: Ref<Edition[]> = ref([])

watch(result, (newResult) => {
    if (newResult) {
        upcoming.value = newResult.events
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})
</script>

<template>
    <v-sheet class='bg-transparent m-16 w-75 pa-3 mx-auto'>
        <div class="!text-4xl !text-zinc-300">Upcoming Tournaments</div>
        <v-container v-if="upcoming.length > 0">
            <v-row>
                <v-col
                    cols="4"
                    v-for="edition in upcoming"
                    :key="edition.id"
                >
                    <UpcomingCard :edition />
                </v-col>
            </v-row>
        </v-container>
        <div v-else class="!text-zinc-400 my-5">No upcoming tournaments</div>
    </v-sheet>
</template>