<script setup lang="ts">
import { computed, ref, type Ref, watch, watchEffect } from 'vue';
import { DateTime } from 'luxon';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { getPlayerStats } from '@/services/APICalls';
import type { PlayerStat, PlayerDetails } from '@/components/interfaces';
import StatItem from '@/components/Player/StatItem.vue';

const props = defineProps<{
    player: PlayerDetails
}>()

provideApolloClient(apolloClient)

const selectedYear = ref('Career')
const selectedSurface = ref('All')
const surfaces = ['All', 'Clay', 'Grass', 'Hard', 'Carpet']

const years = computed(() => {
    const retirementYear = props.player.retired?.id || DateTime.now().year
    const yearArray = Array.from({length: retirementYear - props.player.turned_pro.id + 1}, (_, index) => props.player.turned_pro.id + index)
    return ['Career', ...yearArray]
})

const stats: Ref<PlayerStat[]> = ref([])

const updateStats = () => {
    const { query, variables } = getPlayerStats(props.player.id, selectedYear.value === 'Career' ? undefined : parseInt(selectedYear.value), selectedSurface.value === 'All' ? undefined : selectedSurface.value)
    const { result, loading, error } = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) {
            stats.value = [
            {
                category: 'Serve',
                stats: [
                    {
                        metric: 'Aces',
                        total: newResult.players[0].stats.aces
                    },
                    {
                        metric: 'Double faults',
                        total: newResult.players[0].stats.dfs
                    },
                    {
                        metric: '1st serve',
                        win: newResult.players[0].stats.serve1_pts,
                        total: newResult.players[0].stats.serve1_pts + newResult.players[0].stats.serve2_pts
                    },
                    {
                        metric: '1st serve points won',
                        win: newResult.players[0].stats.serve1_pts_w,
                        total: newResult.players[0].stats.serve1_pts
                    },
                    {
                        metric: '2nd serve points won',
                        win: newResult.players[0].stats.serve2_pts_w,
                        total: newResult.players[0].stats.serve2_pts
                    },
                    {
                        metric: 'Break points faced',
                        total: newResult.players[0].stats.bps_faced
                    },
                    {
                        metric: 'Break points saved',
                        win: newResult.players[0].stats.bps_saved,
                        total: newResult.players[0].stats.bps_faced
                    },
                    {
                        metric: 'Total service points won',
                        win: newResult.players[0].stats.serve1_pts_w + newResult.players[0].stats.serve2_pts_w,
                        total: newResult.players[0].stats.serve1_pts + newResult.players[0].stats.serve2_pts
                    }
                ]
            },
            {
                category: 'Return',
                stats: [
                    {
                        metric: '1st serve return points won',
                        win: newResult.players[0].stats.ret1_pts_w,
                        total: newResult.players[0].stats.ret1_pts
                    },
                    {
                        metric: '2nd serve return points won',
                        win: newResult.players[0].stats.ret2_pts_w,
                        total: newResult.players[0].stats.ret2_pts
                    },
                    {
                        metric: 'Break point opportunities',
                        total: newResult.players[0].stats.bp_opps
                    },
                    {
                        metric: 'Break points converted',
                        win: newResult.players[0].stats.bps_converted,
                        total: newResult.players[0].stats.bp_opps
                    },
                    {
                        metric: 'Return points won',
                        win: newResult.players[0].stats.ret1_pts_w + newResult.players[0].stats.ret2_pts_w,
                        total: newResult.players[0].stats.ret1_pts + newResult.players[0].stats.ret2_pts
                    },
                    {
                        metric: 'Total points won',
                        win: newResult.players[0].stats.serve1_pts_w + newResult.players[0].stats.serve2_pts_w + newResult.players[0].stats.ret1_pts_w + newResult.players[0].stats.ret2_pts_w,
                        total: newResult.players[0].stats.serve1_pts + newResult.players[0].stats.serve2_pts + newResult.players[0].stats.ret1_pts + newResult.players[0].stats.ret2_pts
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
}

watchEffect(() => {
    updateStats()
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