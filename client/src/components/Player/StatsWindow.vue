<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { DateTime } from 'luxon';
import EditionService from '@/services/EditionService';
import type { PlayerDetails, PlayerStat, RawPlayerStat } from '../interfaces';
import StatItem from './StatItem.vue';

const props = defineProps<{
    player: PlayerDetails
}>()

const selectedYear = ref('Career')
const selectedSurface = ref('All')
const surfaces = ['All', 'Clay', 'Grass', 'Hard', 'Carpet']
const years = computed(() => {
    const retirementYear = props.player.retired ?? DateTime.now().year
    const yearArray = Array.from({length: retirementYear - props.player.turned_pro + 1}, (_, index) => props.player.turned_pro + index)
    return ['Career', ...yearArray]
})

const stats: Ref<PlayerStat[]> = ref([])

const getStats = () => {
    EditionService.getPlayerStats(props.player.id, selectedYear.value, selectedSurface.value)
    .then(response => {
        stats.value = []
        const rawResults: RawPlayerStat = response.data.stats
        if (rawResults && Object.keys(response.data.stats).length !== 0) {
            stats.value = [
                {
                    category: 'Serve',
                    stats: [
                        {
                            metric: 'Aces',
                            total: +rawResults.aces
                        },
                        {
                            metric: 'Double faults',
                            total: +rawResults.dfs
                        },
                        {
                            metric: '1st serve',
                            win: +rawResults.serve1_in,
                            total: +rawResults.total_serve1
                        },
                        {
                            metric: '1st serve points won',
                            win: +rawResults.serve1_pts_w,
                            total: +rawResults.serve1_pts
                        },
                        {
                            metric: '2nd serve points won',
                            win: +rawResults.serve2_pts_w,
                            total: +rawResults.serve2_pts
                        },
                        {
                            metric: 'Break points faced',
                            total: +rawResults.bps_faced
                        },
                        {
                            metric: 'Break points saved',
                            win: +rawResults.bps_saved,
                            total: +rawResults.bps_faced
                        },
                        {
                            metric: 'Total service points won',
                            win: +rawResults.serve1_pts_w + +rawResults.serve2_pts_w,
                            total: +rawResults.serve1_pts + +rawResults.serve2_pts
                        }
                    ]
                },
                {
                    category: 'Return',
                    stats: [
                        {
                            metric: '1st serve return points won',
                            win: +rawResults.ret1_w,
                            total: +rawResults.ret1
                        },
                        {
                            metric: '2nd serve return points won',
                            win: +rawResults.ret2_w,
                            total: +rawResults.ret2
                        },
                        {
                            metric: 'Break point opportunities',
                            total: +rawResults.bp_opps
                        },
                        {
                            metric: 'Break points converted',
                            win: +rawResults.bps_converted,
                            total: +rawResults.bp_opps
                        },
                        {
                            metric: 'Return points won',
                            win: +rawResults.ret_pts,
                            total: +rawResults.ret_pts_total
                        },
                        {
                            metric: 'Total points won',
                            win: +rawResults.pts_w,
                            total: +rawResults.total_pts
                        }
                    ]
                }
            ]
        }
    })
    .catch(e => console.log(e))
}

onMounted(() => {
    getStats()
})
</script>

<template>
    <v-container>
        <v-row>
            <v-col
                cols="6"
                sm="4"
                lg="3"
            >
                <v-select
                    class="text-zinc-300"
                    variant="outlined"
                    density="compact"
                    :items="years"
                    v-model="selectedYear"
                    @update:model-value="getStats"
                />
            </v-col>
            <v-col
                cols="6"
                sm="4"
                lg="3"
            >
                <v-select
                    class="text-zinc-300"
                    variant="outlined"
                    density="compact"
                    :items="surfaces"
                    v-model="selectedSurface"
                    @update:model-value="getStats"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col
                v-if="stats.length > 0"
                v-for="category in stats"
                :key="category.category"
                cols="12"
                md="6"
            >
                <div class="font-bold text-zinc-300 text-base my-1">{{ category.category }}</div>
                <div
                    v-for="stat in category.stats"
                    :key="stat.metric"
                    class="my-1 text-zinc-400 text-base"
                >
                    <StatItem :metric="stat.metric" :win="stat.win" :total="stat.total" />
                </div>
            </v-col>
            <div
                v-else
                class="text-zinc-400 mx-auto"
            >
                No data available
            </div>
        </v-row>
    </v-container>
    
</template>