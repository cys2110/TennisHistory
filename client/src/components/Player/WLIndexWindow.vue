<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue';
import PlayerService from '@/services/PlayerService';
import WLIndexItem from './WLIndexItem.vue';
import type { WLIndex, Index } from '../interfaces';

const props = defineProps<{
    id: string
}>()
const index: Ref<WLIndex | null> = ref(null)

const indexCategories: Ref<Index[] | null> = ref([])

onMounted(() => {
    PlayerService.getPlayerIndex(props.id)
    .then(response => index.value = response.data[0])
    .catch(e => console.log(e))
})

watch(() => index.value, (newValue: WLIndex | null, oldValue: WLIndex | null) => {
    if (newValue !== null) {
        indexCategories.value = [
            {
                category: 'Match Record',
                stats: [
                    {
                        metric: 'Overall',
                        win: +newValue.overallWins,
                        total: +newValue.overallTotal,
                        titles: +newValue.overallTitles
                    },
                    {
                        metric: 'Grand Slam',
                        win: +newValue.gsWins,
                        total: +newValue.gsTotal,
                        titles: +newValue.gsTitles
                    },
                    {
                        metric: 'ATP Masters 1000',
                        win: +newValue.mastersWins,
                        total: +newValue.mastersTotal,
                        titles: +newValue.mastersTitles
                    }
                ]
            },
            {
                category: 'Pressure Points',
                stats: [
                    {
                        metric: 'Tiebreaks',
                        win: (+newValue.p1tb1Wins) + (+newValue.p1tb2Wins) + (+newValue.p1tb3Wins) + (+newValue.p1tb4Wins) + (+newValue.p1tb5Wins) + (+newValue.p2tb1Wins) + (+newValue.p2tb2Wins) + (+newValue.p2tb3Wins) + (+newValue.p2tb4Wins) + (+newValue.p2tb5Wins),
                        total: (+newValue.total1Tbs) + (+newValue.total2Tbs) + (+newValue.total3Tbs) + (+newValue.total4Tbs) + (+newValue.total5Tbs)
                    },
                    {
                        metric: 'Versus Top 10',
                        win: (+newValue.v10Wins1) + (+newValue.v10Wins2),
                        total: (+newValue.v10Total1) + (+newValue.v10Total2)
                    },
                    {
                        metric: 'Finals',
                        win: +newValue.overallTitles,
                        total: +newValue.finalsTotal
                    },
                    {
                        metric: 'Deciding set',
                        win: +newValue.decidersWins,
                        total: +newValue.decidersTotal
                    },
                    {
                        metric: '5th set record',
                        win: +newValue.set5Wins,
                        total: +newValue.set5Total
                    }
                ]
            },
            {
                category: 'Environment',
                stats:[
                    {
                        metric: 'Clay',
                        win: +newValue.clayWins,
                        total: +newValue.clayTotal,
                        titles: +newValue.clayTitles
                    },
                    {
                        metric: 'Grass',
                        win: +newValue.grassWins,
                        total: +newValue.grassTotal,
                        titles: +newValue.grassTitles
                    },
                    {
                        metric: 'Hard',
                        win: +newValue.hardWins,
                        total: +newValue.hardTotal,
                        titles: +newValue.hardTitles
                    },
                    {
                        metric: 'Carpet',
                        win: +newValue.carpetWins,
                        total: +newValue.carpetTotal,
                        titles: +newValue.carpetTitles
                    },
                    {
                        metric: 'Indoor',
                        win: +newValue.indoorWins,
                        total: +newValue.indoorTotal,
                        titles: +newValue.indoorTitles
                    },
                    {
                        metric: 'Outdoor',
                        win: +newValue.outdoorWins,
                        total: +newValue.outdoorTotal,
                        titles: +newValue.outdoorTitles
                    }
                ]
            },
            {
                category: 'Other',
                stats: [
                    {
                        metric: 'After winning 1st set',
                        win: +newValue.win1Wins,
                        total: +newValue.win1Total
                    },
                    {
                        metric: 'After losing 1st set',
                        win: +newValue.lose1Wins,
                        total: +newValue.lose1Total
                    },
                    {
                        metric: 'vs. right-handers',
                        win: (+newValue.rhWins1) + (+newValue.rhWins2),
                        total: (+newValue.rhTotal1) + (+newValue.rhTotal2)
                    },
                    {
                        metric: 'vs. left-handers',
                        win: (+newValue.lhWins1) + (+newValue.lhWins2),
                        total: (+newValue.lhTotal1) + (+newValue.lhTotal2)
                    }
                ]
            }
        ]
    }
}, {deep: true})
</script>

<template>
    <v-container v-if="index">
        <div
            v-for="category in indexCategories"
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