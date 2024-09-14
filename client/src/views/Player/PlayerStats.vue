<script setup lang="ts">
import { ref, type Ref, watch, watchEffect } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getPlayerStats } from '@/services/PlayerService';
import type { PlayerStats } from '@/utils/interfaces';
import Loading from '@/components/Global/Loading.vue';
import StatItem from '@/components/Player/StatItem.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string
}>()

const load: Ref<boolean> = ref(false)
const selectedYear = ref('Career')
const selectedSurface = ref('All')
const surfaces = ['All', 'Clay', 'Grass', 'Hard', 'Carpet']
const years = ref(['Career'])

const stats: Ref<PlayerStats[]> = ref([])

const updateStats = () => {

    const { query, variables } = getPlayerStats(props.id, selectedYear.value === 'Career' ? undefined : parseInt(selectedYear.value), selectedSurface.value === 'All' ? undefined : selectedSurface.value)
    const { result, loading, error } = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) {
            const earliest = newResult.players[0].years.earliest
            const latest = newResult.players[0].years.latest
            const yearArray = Array.from({ length: latest - earliest + 1 }, (_, index) => earliest + index)
            years.value = ['Career', ...yearArray]

            const aggregate = newResult.players[0].scoresAggregate.node
            stats.value = [
                {
                    category: 'Serve',
                    stats: [
                        {
                            metric: 'Aces',
                            total: aggregate.aces.sum
                        },
                        {
                            metric: 'Double faults',
                            total: aggregate.dfs.sum
                        },
                        {
                            metric: '1st serve',
                            win: aggregate.serve1_pts.sum,
                            total: aggregate.serve1_pts.sum + aggregate.serve2_pts.sum
                        },
                        {
                            metric: '1st serve points won',
                            win: aggregate.serve1_pts_w.sum,
                            total: aggregate.serve1_pts.sum
                        },
                        {
                            metric: '2nd serve points won',
                            win: aggregate.serve2_pts_w.sum,
                            total: aggregate.serve2_pts.sum
                        },
                        {
                            metric: 'Break points faced',
                            total: aggregate.bps_faced.sum
                        },
                        {
                            metric: 'Break points saved',
                            win: aggregate.bps_saved.sum,
                            total: aggregate.bps_faced.sum
                        },
                        {
                            metric: 'Total service points won',
                            win: aggregate.serve1_pts_w.sum + aggregate.serve2_pts_w.sum,
                            total: aggregate.serve1_pts.sum + aggregate.serve2_pts.sum
                        }
                    ]
                },
                {
                    category: 'Return',
                    stats: [
                        {
                            metric: '1st serve return points won',
                            win: aggregate.ret1_w.sum,
                            total: aggregate.ret1.sum
                        },
                        {
                            metric: '2nd serve return points won',
                            win: aggregate.ret2_w.sum,
                            total: aggregate.ret2.sum
                        },
                        {
                            metric: 'Break point opportunities',
                            total: aggregate.bp_opps.sum
                        },
                        {
                            metric: 'Break points converted',
                            win: aggregate.bps_converted.sum,
                            total: aggregate.bp_opps.sum
                        },
                        {
                            metric: 'Return points won',
                            win: aggregate.ret1_w.sum + aggregate.ret2_w.sum,
                            total: aggregate.ret1.sum + aggregate.ret2.sum
                        },
                        {
                            metric: 'Total points won',
                            win: aggregate.serve1_pts_w.sum + aggregate.serve2_pts_w.sum + aggregate.ret1_w.sum + aggregate.ret2_w.sum,
                            total: aggregate.serve1_pts.sum + aggregate.serve2_pts.sum + aggregate.ret1.sum + aggregate.ret2.sum
                        }
                    ]
                }
            ]
            load.value = false
        }
    }, { immediate: true })

    watch(loading, (newLoad) => load.value = newLoad)

    watch(error, (newError) => {
        if (newError) {
            load.value = false
            console.error(newError)
        }
    }, { immediate: true })
}

watchEffect(() => {
    load.value = true
    updateStats()
})
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="6" sm="4" lg="3">
                <v-select class="text-zinc-300" variant="outlined" density="compact" :items="years"
                    v-model="selectedYear" />
            </v-col>
            <v-col cols="6" sm="4" lg="3">
                <v-select class="text-zinc-300" variant="outlined" density="compact" :items="surfaces"
                    v-model="selectedSurface" />
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="stats.length > 0" v-for="category in stats" :key="category.category" cols="12" md="6">
                <div class="font-bold text-zinc-300 text-base my-1">{{ category.category }}</div>
                <div v-for="stat in category.stats" :key="stat.metric" class="my-1 text-zinc-400 text-base">
                    <StatItem :metric="stat.metric" :win="stat.win" :total="stat.total" />
                </div>
            </v-col>
            <Loading v-else :loading="load">
                <template #none>No stats available</template>
            </Loading>
        </v-row>
    </v-container>
</template>