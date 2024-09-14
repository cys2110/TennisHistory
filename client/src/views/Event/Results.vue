<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getResults } from '@/services/EventService';
import type { Match, EntryInfo } from '@/utils/interfaces';
import Loading from '@/components/Global/Loading.vue';
import ResultCard from '@/components/Event/ResultCard.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    eventId: string
}>()

const { query, variables } = getResults(parseInt(props.eventId))
const { result, loading, error } = useQuery(query, variables)

const rounds: Ref<{ round: string; matches: Match[] }[]> = ref([])
const entryInfo: Ref<{ node: { id: string }; properties: EntryInfo; }[]> = ref([])
const tab: Ref<string> = ref('')

watch(result, (newResult) => {
    if (newResult) {
        tab.value = newResult.events[0].draw_type
        entryInfo.value = newResult.events[0].playersConnection.edges
        rounds.value = newResult.events[0].rounds
    }
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
    <v-container v-if="rounds.length > 0">
        <v-tabs v-model="tab" show-arrows>
            <v-tab v-for="round in rounds" :key="round.round" :value="round.round">
                {{ round.round }}
            </v-tab>
        </v-tabs>
        <v-window v-model="tab" direction="vertical" class="mt-5">
            <v-window-item v-for="round in rounds" :key="round.round" :value="round.round">
                <div class="flex flex-wrap justify-center">
                    <ResultCard v-for="match in round.matches" :key="match.match_no" :match :entryInfo />
                </div>
            </v-window-item>
        </v-window>
    </v-container>
    <Loading v-else :loading>
        <template #None>No data available</template>
    </Loading>
</template>