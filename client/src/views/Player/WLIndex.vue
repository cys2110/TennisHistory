<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { getWLIndex } from '@/services/APICalls';
import WLIndexItem from '@/components/Player/WLIndexItem.vue';
import type { WLIndex } from '@/components/interfaces';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string
}>()
const index: Ref<WLIndex[]> = ref([])

const {query, variables } = getWLIndex(props.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        index.value = [
            {
                category: 'Match Record',
                stats: [
                    {
                        metric: 'Overall',
                        win: newResult.players[0].indexMatches.overallWins,
                        total: newResult.players[0].indexMatches.overallTotal,
                        titles: newResult.players[0].indexTitles.overallTitles
                    },
                    {
                        metric: 'Grand Slam',
                        win: newResult.players[0].indexMatches.gsWins,
                        total: newResult.players[0].indexMatches.gsTotal,
                        titles: newResult.players[0].indexTitles.gsTitles
                    },
                    {
                        metric: 'ATP Masters 1000',
                        win: newResult.players[0].indexMatches.mastersWins,
                        total: newResult.players[0].indexMatches.mastersTotal,
                        titles: newResult.players[0].indexMatches.mastersTitles
                    }
                ]
            },
            {
                category: 'Pressure Points',
                stats: [
                    {
                        metric: 'Tiebreaks',
                        win: newResult.players[0].indexTb.tbWins,
                        total: newResult.players[0].indexTb.tbTotal
                    },
                    {
                        metric: 'Versus Top 10',
                        win: newResult.players[0].indexOpponents.v10Wins,
                        total: newResult.players[0].indexOpponents.v10Total
                    },
                    {
                        metric: 'Finals',
                        win: newResult.players[0].indexTitles.overallTitles,
                        total: newResult.players[0].indexFinals + newResult.players[0].indexTitles.overallTitles
                    },
                    {
                        metric: 'Deciding set',
                        win: newResult.players[0].indexMatches.decidersWins,
                        total: newResult.players[0].indexMatches.decidersTotal
                    },
                    {
                        metric: '5th set record',
                        win: newResult.players[0].indexMatches.set5Wins,
                        total: newResult.players[0].indexMatches.set5Total
                    }
                ]
            },
            {
                category: 'Environment',
                stats:[
                    {
                        metric: 'Clay',
                        win: newResult.players[0].indexMatches.clayWins,
                        total: newResult.players[0].indexMatches.clayTotal,
                        titles: newResult.players[0].indexTitles.clayTitles
                    },
                    {
                        metric: 'Grass',
                        win: newResult.players[0].indexMatches.grassWins,
                        total: newResult.players[0].indexMatches.grassTotal,
                        titles: newResult.players[0].indexTitles.grassTitles
                    },
                    {
                        metric: 'Hard',
                        win: newResult.players[0].indexMatches.hardWins,
                        total: newResult.players[0].indexMatches.hardTotal,
                        titles: newResult.players[0].indexTitles.hardTitles
                    },
                    {
                        metric: 'Carpet',
                        win: newResult.players[0].indexMatches.carpetWins,
                        total: newResult.players[0].indexMatches.carpetTotal,
                        titles: newResult.players[0].indexTitles.carpetTitles
                    },
                    {
                        metric: 'Indoor',
                        win: newResult.players[0].indexMatches.indoorWins,
                        total: newResult.players[0].indexMatches.indoorTotal,
                        titles: newResult.players[0].indexTitles.indoorTitles
                    },
                    {
                        metric: 'Outdoor',
                        win: newResult.players[0].indexMatches.outdoorWins,
                        total: newResult.players[0].indexMatches.outdoorTotal,
                        titles: newResult.players[0].indexTitles.outdoorTitles
                    }
                ]
            },
            {
                category: 'Other',
                stats: [
                    {
                        metric: 'After winning 1st set',
                        win: newResult.players[0].indexOpponents.win1Wins,
                        total: newResult.players[0].indexOpponents.win1Total
                    },
                    {
                        metric: 'After losing 1st set',
                        win: newResult.players[0].indexOpponents.lose1Wins,
                        total: newResult.players[0].indexOpponents.lose1Total
                    },
                    {
                        metric: 'vs. right-handers',
                        win: newResult.players[0].indexOpponents.rhWins,
                        total: newResult.players[0].indexOpponents.rhTotal
                    },
                    {
                        metric: 'vs. left-handers',
                        win: newResult.players[0].indexOpponents.lhWins,
                        total: newResult.players[0].indexOpponents.lhTotal
                    }
                ]
            }
        ]
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})
</script>

<template>
    <v-container v-if="index.length > 0">
        <div
            v-for="category in index"
            :key="category.category"
            class="mb-2"
        >
            <v-row>
                <v-col class="text-center">
                    <div class="font-bold text-uppercase">{{ category.category }}</div>
                </v-col>
            </v-row>
            <WLIndexItem
                v-for="index in category.stats"
                :key="index.win"
                :win="index.win"
                :total="index.total"
                :titles="index.titles"
            >
                <template #metric>{{ index.metric }}</template>
            </WLIndexItem>
        </div>
    </v-container>
    <div v-else class="text-zinc-300">No data available</div>
</template>