<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { getDraw } from '@/services/APICalls';
import DrawCard from '@/components/Edition/DrawCard.vue';
import type { Draw, Status } from '@/components/interfaces';

provideApolloClient(apolloClient)

const props = defineProps<{
    editionNo: string,
}>()

const { query, variables } = getDraw(parseInt(props.editionNo))
const { result, loading, error} = useQuery(query, variables)

const rounds: Ref<Draw[]> = ref([])
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

const selectedRound = ref('Round of 128' || 'Round of 64' || 'Round of 32')
</script>

<template>
    <v-container>
        <v-row>
            <v-col class="text-center">
                <v-btn-toggle
                    v-model="selectedRound"
                    rounded="xl"
                >
                    <v-btn
                        v-for="round in rounds"
                        :key="round.round"
                        :value="round.round"
                        class="bg-zinc-700"
                        size="small"
                        slim
                    >
                        {{ round.round }}
                    </v-btn>
                </v-btn-toggle>
            </v-col>
        </v-row>
        <v-row>
            <template
                v-for="round in rounds"
                :key="round.round"
            >
            <!-- v-if="selectedRound === round.value || selectedRound === round.value*2 || selectedRound === round.value*4" -->
                <v-col
                    class="d-flex flex-column justify-space-around"
                    cols="12"
                    md="6"
                    xl="4"
                >
                    <DrawCard
                        v-for="match in round.matches"
                        :key="match.id"
                        :match
                        :seeds
                        :statuses
                    />
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>