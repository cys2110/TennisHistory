<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getWLIndex } from '@/services/PlayerService';
import type { WLIndex } from '@/utils/interfaces';
import WLIndexItem from '@/components/Player/WLIndexItem.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string
}>()

const { query, variables } = getWLIndex(props.id)
const { result, loading, error } = useQuery(query, variables)

const index: Ref<WLIndex[]> = ref([])

watch(result, (newResult) => {
    if (newResult) {
        const stats = newResult.players[0]
        index.value = [
            {
                category: 'Match Record',
                stats: [
                    {
                        metric: 'Overall',
                        win: stats.overallWins.count,
                        total: stats.overallTotal.count,
                        titles: stats.overallTitles.count
                    },
                    {
                        metric: 'Grand Slam',
                        win: stats.gsWins.count,
                        total: stats.gsTotal.count,
                        titles: stats.gsTitles.count
                    },
                    {
                        metric: 'ATP Masters 1000',
                        win: stats.mastersWins.count,
                        total: stats.mastersTotal.count,
                        titles: stats.mastersTitles.count
                    }
                ]
            },
            {
                category: 'Pressure Points',
                stats: [
                    {
                        metric: 'Tiebreaks',
                        win: stats.indexTb.tbWins,
                        total: stats.indexTb.tbTotal
                    },
                    {
                        metric: 'Versus Top 10',
                        win: stats.indexOpponents.v10Wins,
                        total: stats.indexOpponents.v10Total
                    },
                    {
                        metric: 'Finals',
                        win: stats.overallTitles.count,
                        total: stats.overallTitles.count + stats.overallFinals.count
                    },
                    {
                        metric: 'Deciding set',
                        win: stats.decidersWins.count,
                        total: stats.decidersTotal.count
                    },
                    {
                        metric: '5th set record',
                        win: stats.set5Wins.count,
                        total: stats.set5Total.count
                    }
                ]
            },
            {
                category: 'Environment',
                stats:[
                    {
                        metric: 'Clay',
                        win: stats.clayWins.count,
                        total: stats.clayTotal.count,
                        titles: stats.clayTitles.count
                    },
                    {
                        metric: 'Grass',
                        win: stats.grassWins.count,
                        total: stats.grassTotal.count,
                        titles: stats.grassTitles.count
                    },
                    {
                        metric: 'Hard',
                        win: stats.hardWins.count,
                        total: stats.hardTotal.count,
                        titles: stats.hardTitles.count
                    },
                    {
                        metric: 'Carpet',
                        win: stats.carpetWins.count,
                        total: stats.carpetTotal.count,
                        titles: stats.carpetTitles.count
                    },
                    {
                        metric: 'Indoor',
                        win: stats.indoorWins.count,
                        total: stats.indoorTotal.count,
                        titles: stats.indoorTitles.count
                    },
                    {
                        metric: 'Outdoor',
                        win: stats.outdoorWins.count,
                        total: stats.outdoorTotal.count,
                        titles: stats.outdoorTitles.count
                    }
                ]
            },
            {
                category: 'Other',
                stats: [
                    {
                        metric: 'After winning 1st set',
                        win: stats.indexOpponents.win1Wins,
                        total: stats.indexOpponents.win1Total
                    },
                    {
                        metric: 'After losing 1st set',
                        win: stats.indexOpponents.lose1Wins,
                        total: stats.indexOpponents.lose1Total
                    },
                    {
                        metric: 'vs. right-handers',
                        win: stats.rhWins.count,
                        total: stats.rhTotal.count
                    },
                    {
                        metric: 'vs. left-handers',
                        win: stats.lhWins.count,
                        total: stats.lhTotal.count
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
}, {immediate: true})
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