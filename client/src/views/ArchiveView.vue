<script setup lang="ts">
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon'
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { getEditionByYear } from '@/services/APICalls';
import ArchiveCard from '@/components/Archive/ArchiveCard.vue';
import type { Edition } from '@/components/interfaces';

provideApolloClient(apolloClient)

const years = Array.from({length: (DateTime.now().year + 1) - 1968}, (_, index) => 2024 - index)
const searchYear: Ref<number> = ref(DateTime.now().year)
const results: Ref<Edition[]> = ref([])

const { query, variables } = getEditionByYear(searchYear.value)
const { result, loading, error} = useQuery(query, variables)

watch(searchYear, (newYear) => {
    if (newYear !== null && !isNaN(newYear)) {
        const { query, variables } = getEditionByYear(newYear)
        const { result, loading, error} = useQuery(query, variables)
        watch(result, (newResult) => {
            if (result.value) {
                results.value = result.value.events
            }
        })
    }
}, {immediate: true})
</script>

<template>
    <view-sheet>
        <v-container>
            <v-row class="flex items-center">
                <v-col class="text-3xl text-zinc-300">Results Archive</v-col>
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
                <v-col>
                    <div v-if="results.length > 0">
                        <ArchiveCard v-for="edition in results" :key="edition.id" :edition />
                    </div>
                    <div class="text-zinc-400" v-else>No data available.</div>
                </v-col>
            </v-row>
        </v-container>
    </view-sheet>
</template>