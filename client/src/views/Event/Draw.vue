<script setup lang="ts">
import { ref, watch, type Ref, nextTick, onMounted } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getDraw } from '@/services/EventService';
import type { ActivityEntry, DrawRound } from '@/utils/interfaces';
import DrawCard from '@/components/Event/DrawCard.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    name: string,
    id: string,
    year: string,
    eventId: string
}>()

const rounds: Ref<DrawRound[]> = ref([])
const entryInfo: Ref<ActivityEntry[]> = ref([])
const selectedRound: Ref<number> = ref(1)

const { query, variables } = getDraw(parseInt(props.eventId))
const { result, loading, error} = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        entryInfo.value = newResult.events[0].playersConnection.edges
        if (newResult.events[0].draw_type === 'Round of 128') {
            rounds.value.push({
                round: 'R128',
                value: 7,
                matches: newResult.events[0].r128
            })
        }
        if (newResult.events[0].draw_type === 'Round of 64' || newResult.events[0].draw_type === 'Round of 128') {
            rounds.value.push({
                round: 'R64',
                value: 6,
                matches: newResult.events[0].r64
            })
        }
        rounds.value.push(
            {
                round: 'R32',
                value: 5,
                matches: newResult.events[0].r32
            },
            {
                round: 'R16',
                value: 4,
                matches: newResult.events[0].r16
            },
            {
                round: 'QF',
                value: 3,
                matches: newResult.events[0].qf
            },
            {
                round: 'SF',
                value: 2,
                matches: newResult.events[0].sf
            },
            {
                round: 'F',
                value: 1,
                matches: newResult.events[0].final
            }
        )
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})
</script>

<template>
    <v-container
        v-if="rounds.length > 0"
    >
        <v-row>
            <v-col
                class="text-center"
            >
                <v-btn-toggle
                    v-model="selectedRound"
                    rounded="xl"
                >
                    <v-btn
                        v-for="round in rounds"
                        :key="round.round"
                        :value="round.value"
                        class="bg-indigo-800"
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
                <v-col
                    v-if="selectedRound === round.value || selectedRound === round.value + 2 || selectedRound === round.value + 1"
                    class="d-flex flex-column justify-space-around"
                    cols="12"
                    md="6"
                    xl="4"
                >
                    <DrawCard
                        v-for="match in round.matches"
                        :key="match.match_no"
                        :match
                        :entryInfo
                        :name
                        :tournamentId="parseInt(id)"
                        :year="parseInt(year)"
                        :eventId="parseInt(eventId)"
                    />
                </v-col>
            </template>
        </v-row>
    </v-container>
    <div
        v-else
        class="text-zinc-400 text-xl text-center"
    >
        No data available
    </div>
</template>