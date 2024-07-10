<script setup lang="ts">
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon'
import { ref, watch, watchEffect, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { getEditionByYear } from '@/services/APICalls';
import ArchiveCard from '@/components/Archive/ArchiveCard.vue';
import type { Edition } from '@/components/interfaces';

provideApolloClient(apolloClient)

const years = Array.from({length: (DateTime.now().year + 1) - 1968}, (_, index) => 2024 - index)
const searchYear: Ref<number> = ref(DateTime.now().year)
const results: Ref<Edition[]> = ref([])

const updateResults = () => {
    const { query, variables } = getEditionByYear(searchYear.value)
    const { result, loading, error} = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) {
            results.value = result.value.events
        }
    }, {immediate: true})

    watch(error, (newError) => {
        if (newError) {
            console.error(newError)
        }
    })
}

watchEffect(() => {
    updateResults()
})
</script>

<template>
    <v-sheet class='bg-transparent m-16 w-75 pa-3 mx-auto'>
        <v-container>
            <v-row class="flex items-center">
                <v-col class="text-4xl text-zinc-300">Results Archive</v-col>
                <v-col cols="12" sm="3">
                    <v-combobox
                        class="text-zinc-300"
                        variant="underlined"
                        v-model="searchYear"
                        :items="years"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-tabs></v-tabs>
            </v-row>
            <v-row>
                <v-col
                    v-if="results.length > 0"
                    v-for="edition in results"
                    :key="edition.id"
                    cols="4"
                >
                    <ArchiveCard :edition />
                </v-col>
                <v-col v-else class="text-zinc-400">No data available</v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>