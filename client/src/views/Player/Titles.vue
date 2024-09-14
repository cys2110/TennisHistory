<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getPlayerTitles } from '@/services/PlayerService';
import type { Titles } from '@/utils/interfaces';
import Loading from '@/components/Global/Loading.vue';
import TitlesTable from '@/components/Player/TitlesTable.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string
}>()

const { query, variables } = getPlayerTitles(props.id)
const { result, loading, error } = useQuery(query, variables)

const results: Ref<Titles | null> = ref(null)
const selection = ref('Titles')
const items = ['Titles', 'Finals']

const selectedArray = computed(() => {
    // @ts-ignore
    return selection.value === 'Titles' ? results.value.titlesByYear : results.value.finalsByYear
})

watch(result, (newResult) => {
    if (newResult) results.value = newResult.players[0]
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <v-combobox class="text-zinc-300" variant="outlined" v-model="selection" :items="items"
                    density="compact" />
            </v-col>
        </v-row>
        <v-table v-if="results" class="text-zinc-300 bg-transparent mx-auto">
            <thead>
                <tr class="border-zinc-400 border-b-2">
                    <th class="text-center">Year</th>
                    <th class="text-center">Total</th>
                    <th>Tournaments</th>
                    <th>Surface</th>
                </tr>
            </thead>
            <tbody>
                <TitlesTable v-for="year in selectedArray" :key="year.year" :year />
            </tbody>
        </v-table>
        <Loading v-else :loading>
            <template #none>{{ selection === 'Titles' ? 'No titles won' : 'No finals played' }}</template>
        </Loading>
    </v-container>
</template>