<script setup>
import { ref, watch, watchEffect } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { GET_PLAYER_STATS } from '@/services/PlayerService';
import { percentage, unencodeName } from '@/utils/functions';

const selectTheme = {
    activeBorderColor: "#8b5cf6",
    hoverBorderColor: "#8b5cf6",
    colorBorder: "#8b5cf6",
    colorText: "#d4d4d8",
}

const props = defineProps(['name', 'id'])

// Update document title
const updateDocumentTitle = () => document.title = `Stats | ${unencodeName(props.name)} | TennisHistory`
watch(() => props.name, () => updateDocumentTitle(), { immediate: true })

// Variables
const load = ref(false)
const selectedYear = ref(null)
const selectedSurface = ref(null)
const years = [{ label: 'Career', value: null }]
const surfaces = [{ label: 'All', value: null }, { label: 'Clay', value: 'Clay' }, { label: 'Grass', value: 'Grass' }, { label: 'Hard', value: 'Hard' }, { label: 'Carpet', value: 'Carpet' }]
const barStats = ref(null)
const pieStats = ref(null)

// [TODO: FIX REACTIVITY OF API CALL]
// API call
provideApolloClient(apolloClient)
const { query, variables } = GET_PLAYER_STATS(props.id, selectedYear.value, selectedSurface.value)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        const playerStats = newResult.players[0].stats
        pieStats.value = [{
            name: 'Aces',
            value: playerStats.aces,
            itemStyle: { color: '#6d28d9' }
        },
        {
            name: 'Double faults',
            value: playerStats.dfs,
            itemStyle: { color: '#166534' }
        }]
        barStats.value = [
            {
                category: '1st serve',
                value: percentage(playerStats.serve1, playerStats.serve1 + playerStats.serve2).toFixed(0),
                actualValue: playerStats.serve1,
                max: playerStats.serve1 + playerStats.serve2
            },
            {
                category: '1st serve points won',
                value: percentage(playerStats.serve1_w, playerStats.serve1).toFixed(0),
                actualValue: playerStats.serve1_w,
                max: playerStats.serve1
            },
            {
                category: '2nd serve points won',
                value: percentage(playerStats.serve2_w, playerStats.serve2).toFixed(0),
                actualValue: playerStats.serve2_w,
                max: playerStats.serve2
            },
            {
                category: 'Break points won',
                value: percentage(playerStats.bps_saved, playerStats.bps_faced).toFixed(0),
                actualValue: playerStats.bps_saved,
                max: playerStats.bps_faced
            },
            {
                category: 'Service points won',
                value: percentage(playerStats.serve1_w + playerStats.serve2_w, playerStats.serve1 + playerStats.serve2).toFixed(0),
                actualValue: playerStats.serve1_w + playerStats.serve2_w,
                max: playerStats.serve1 + playerStats.serve2
            },
            {
                category: '1st serve return points won',
                value: percentage(playerStats.ret1_w, playerStats.ret1).toFixed(0),
                actualValue: playerStats.ret1_w,
                max: playerStats.ret1
            },
            {
                category: '2nd serve return points won',
                value: percentage(playerStats.ret2_w, playerStats.ret2).toFixed(0),
                actualValue: playerStats.ret2_w,
                max: playerStats.ret2
            },
            {
                category: 'Break points converted',
                value: percentage(playerStats.bps_converted, playerStats.bp_opps).toFixed(0),
                actualValue: playerStats.bps_converted,
                max: playerStats.bp_opps
            },
            {
                category: 'Return points won',
                value: percentage(playerStats.ret1_w + playerStats.ret2_w, playerStats.ret1 + playerStats.ret2).toFixed(0),
                actualValue: playerStats.ret1_w + playerStats.ret2_w,
                max: playerStats.ret1 + playerStats.ret2
            },
            {
                category: 'Total points won',
                value: percentage(playerStats.serve1_w + playerStats.serve2_w + playerStats.ret1_w + playerStats.ret2_w, playerStats.serve1 + playerStats.serve2 + playerStats.ret1 + playerStats.ret2).toFixed(0),
                actualValue: playerStats.serve1_w + playerStats.serve2_w + playerStats.ret1_w + playerStats.ret2_w,
                max: playerStats.serve1 + playerStats.serve2 + playerStats.ret1 + playerStats.ret2
            }
        ]
        const yearsArray = Array.from({ length: newResult.players[0].years.latest - newResult.players[0].years.earliest + 1 }, (_, index) => ({
            label: newResult.players[0].years.earliest + index,
            value: newResult.players[0].years.earliest + index
        }))
        years.value = [years.value, ...yearsArray]
    }
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })

watchEffect(() => {
    variables.selectedYear = selectedYear.value
    variables.selectedSurface = selectedSurface.value
})
</script>

<template>
    <a-row align="middle">
        <a-col :span="18">
            <Title>
                <template #title>{{ unencodeName(name) }}</template>
                <template #subtitle>Player Stats</template>
            </Title>
        </a-col>
        <a-config-provider :theme="{ components: { Select: selectTheme } }">
            <a-col :span="3">
                <a-select :options="years" class="w-[90%] text-center mx-1" size="large" v-model:value="selectedYear" />
            </a-col>
            <a-col :span="3">
                <a-select :options="surfaces" class="w-[90%] text-center" size="large"
                    v-model:value="selectedSurface" />
            </a-col>
        </a-config-provider>
    </a-row>
    <!--[TODO: FIX SPACING]-->
    <StatsPieChart v-if="pieStats" :stats="pieStats" />
    <StatsBarChart v-if="barStats" :stats=barStats />
    <Loading v-else :loading>
        <template #none>No stats available</template>
    </Loading>
</template>