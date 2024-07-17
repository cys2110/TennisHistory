<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getResults } from '@/services/EventService';
import type { ActivityEntry, Round } from '@/utils/interfaces';
import ResultCard from '@/components/Event/ResultCard.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    eventId: string
}>()

const { query, variables } = getResults(parseInt(props.eventId))
const { result, loading, error} = useQuery(query, variables)

const rounds: Ref<Round[]> = ref([])
const entryInfo: Ref<ActivityEntry[]> = ref([])
const tab: Ref<string> = ref('')

watch(result, (newResult) => {
    if (newResult) {
        tab.value = newResult.events[0].draw_type
        entryInfo.value = newResult.events[0].playersConnection.edges
        if (newResult.events[0].draw_type === 'Round of 128') {
            rounds.value.push({
                round: 'Round of 128',
                matches: newResult.events[0].r128
            })
        }
        if (newResult.events[0].draw_type === 'Round of 64' || newResult.events[0].draw_type === 'Round of 128') {
            rounds.value.push({
                round: 'Round of 64',
                matches: newResult.events[0].r64
            })
        }
        rounds.value.push(
            {
                round: 'Round of 32',
                matches: newResult.events[0].r32
            },
            {
                round: 'Round of 16',
                matches: newResult.events[0].r16
            },
            {
                round: 'Quarterfinals',
                matches: newResult.events[0].qf
            },
            {
                round: 'Semifinals',
                matches: newResult.events[0].sf
            },
            {
                round: 'Final',
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
                <div
                    class="flex flex-wrap justify-center"
                >
                    <ResultCard
                        v-for="match in round.matches"
                        :key="match.match_no"
                        :match
                        :entryInfo
                    />
                </div>
            </v-window-item>
        </v-window>
    </v-container>
    <div
        v-else
        class="text-zinc-400 text-xl text-center"
    >
        No data available
    </div>
</template>