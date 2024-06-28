<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { getResults } from '@/services/APICalls';
import type { Result, Status } from '@/components/interfaces';
import ResultCard from '@/components/Edition/ResultCard.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    editionNo: string
}>()

const { query, variables } = getResults(parseInt(props.editionNo))
const { result, loading, error} = useQuery(query, variables)

const rounds: Ref<Result[]> = ref([])
const seeds: Ref<string[]> = ref([])
const statuses: Ref<Status> = ref({WC: [], Alt: [], LL: [], Q: [], PR: [], SE: []})

watch(result, (newResult) => {
    if (newResult) {
        rounds.value = newResult.events[0].rounds
        seeds.value = newResult.events[0].resultSeeds.seeds
        statuses.value.WC = newResult.events[0].statuses.WC ?? []
        statuses.value.Alt = newResult.events[0].statuses.Alt ?? []
        statuses.value.LL = newResult.events[0].statuses.LL ?? []
        statuses.value.Q = newResult.events[0].statuses.Q ?? []
        statuses.value.PR = newResult.events[0].statuses.PR ?? []
        statuses.value.SE = newResult.events[0].statuses.SE ?? []
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})

const tab = ref('Round of 128' || 'Round of 64' || 'Round of 32')
</script>

<template>
    <v-container>
        <v-tabs
            v-model="tab"
            show-arrows
        >
            <v-tab
                v-for="round in rounds"
                :key="round.round"
                :value="round.round"
            >
                {{ round.round }}
            </v-tab>
        </v-tabs>
        <v-window
            v-model="tab"
            direction="vertical"
        >
            <v-window-item
                v-for="round in rounds"
                :key="round.round"
                :value="round.round"
            >
                <div class="flex flex-wrap justify-center">
                    <ResultCard
                        v-for="match in round.matches"
                        :key="match.id"
                        :match
                        :seeds
                        :statuses
                    />
                </div>
            </v-window-item>
        </v-window>
    </v-container>
</template>