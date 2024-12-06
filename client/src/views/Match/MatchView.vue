<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_MATCH } from '@/services/MatchService';
import { encodeName, flag, headshot, percentage, unencodeName, updateDocumentTitle } from '@/utils/functions';
import { COLOURS } from '@/utils/variables';

// Variables
const props = defineProps(['name', 'id', 'eid', 'year', 'mid'])

document.title = `${unencodeName(props.name)} ${props.year} | TennisHistory`
const match = ref(null)
const stats = ref(null)
const serviceSpeed = ref(null)
const anchorItems = ref([
    { key: 1, href: '#service-stats', title: "Service Stats" },
    { key: 2, href: '#return-stats', title: 'Return Stats' },
    { key: 3, href: '#points-stats', title: 'Points Stats' }
])

// Get player params
const playerParams = (player) => {
    const name = encodeName(player.player.player.full_name)
    return {
        name: name,
        id: player.player.player.id
    }
}

// API call
const { query, variables } = GET_MATCH(parseInt(props.mid), parseInt(props.eid))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        match.value = newResult.matches[0]
        updateDocumentTitle(`${match.value.p1.player.player.full_name} vs. ${match.value.p2.player.player.full_name} | ${unencodeName(props.name)} ${props.year} | TennisHistory`)
        const serviceStats = [
            {
                category: 'Aces',
                p1Value: match.value.p1.aces,
                p2Value: match.value.p2.aces
            },
            {
                category: 'Double faults',
                p1Value: match.value.p1.dfs,
                p2Value: match.value.p2.dfs
            },
            {
                category: 'First serve',
                p1Actual: match.value.p1.serve1_pts,
                p1Max: match.value.p1.serve1_pts + match.value.p1.serve2_pts,
                p2Actual: match.value.p2.serve1_pts,
                p2Max: match.value.p2.serve1_pts + match.value.p2.serve2_pts
            },
            {
                category: '1st serve points won',
                p1Actual: match.value.p1.serve1_pts_w,
                p1Max: match.value.p1.serve1_pts,
                p2Actual: match.value.p2.serve1_pts_w,
                p2Max: match.value.p2.serve1_pts
            },
            {
                category: '2nd serve points won',
                p1Actual: match.value.p1.serve2_pts_w,
                p1Max: match.value.p1.serve2_pts,
                p2Actual: match.value.p2.serve2_pts_w,
                p2Max: match.value.p2.serve1_pts
            },
            {
                category: 'Break points saved',
                p1Actual: match.value.p1.bps_saved,
                p1Max: match.value.p1.bps_faced,
                p2Actual: match.value.p2.bps_saved,
                p2Max: match.value.p2.bps_faced
            }
        ]
        serviceStats.map(stat => {
            if (stat.p1Max) {
                stat.p1Value = percentage(stat.p1Actual, stat.p1Max)
                stat.p2Value = percentage(stat.p2Actual, stat.p2Max)
            }
        })
        const returnStats = [
            {
                category: '1st serve return points won',
                p1Actual: match.value.p1.ret1_w,
                p1Max: match.value.p1.ret1,
                p2Actual: match.value.p2.ret1_w,
                p2Max: match.value.p2.ret1
            },
            {
                category: '2nd serve return points won',
                p1Actual: match.value.p1.ret2_w,
                p1Max: match.value.p1.ret2,
                p2Actual: match.value.p2.ret2_w,
                p2Max: match.value.p2.ret2
            },
            {
                category: 'Break points converted',
                p1Actual: match.value.p1.bps_converted,
                p1Max: match.value.p1.bp_opps,
                p2Actual: match.value.p2.bps_converted,
                p2Max: match.value.p2.bp_opps
            }
        ]
        returnStats.map(stat => {
            stat.p1Value = percentage(stat.p1Actual, stat.p1Max)
            stat.p2Value = percentage(stat.p2Actual, stat.p2Max)
        })

        let pointStats = [
            {
                category: 'Service points won',
                p1Actual: match.value.p1.serve1_pts_w + match.value.p1.serve2_pts_w,
                p1Max: match.value.p1.serve1_pts + match.value.p1.serve2_pts,
                p2Actual: match.value.p2.serve1_pts_w + match.value.p2.serve2_pts_w,
                p2Max: match.value.p2.serve1_pts + match.value.p2.serve2_pts
            },
            {
                category: 'Return points won',
                p1Actual: match.value.p1.ret1_w + match.value.p1.ret2_w,
                p1Max: match.value.p1.ret1 + match.value.p1.ret2,
                p2Actual: match.value.p2.ret1_w + match.value.p2.ret2_w,
                p2Max: match.value.p2.ret1 + match.value.p2.ret2
            },
            match.value.p1.net && {
                category: 'Net points won',
                p1Actual: match.value.p1.net_w,
                p1Max: match.value.p1.net,
                p2Actual: match.value.p2.net_w,
                p2Max: match.value.p2.net
            },
            match.value.p1.winners && {
                category: 'Winners',
                p1Value: match.value.p1.winners,
                p2Value: match.value.p2.winners
            },
            match.value.p1.ues && {
                category: 'Unforced errors',
                p1Value: match.value.p1.ues,
                p2Value: match.value.p2.ues
            },
            {
                category: 'Total Points Won',
                p1Actual: match.value.p1.serve1_pts_w +
                    match.value.p1.serve2_pts_w +
                    match.value.p1.ret1_w +
                    match.value.p1.ret2_w,
                p1Max: match.value.p1.serve1_pts + match.value.p1.serve2_pts + match.value.p1.ret1 + match.value.p1.ret2,
                p2Actual: match.value.p2.serve1_pts_w +
                    match.value.p2.serve2_pts_w +
                    match.value.p2.ret1_w +
                    match.value.p2.ret2_w,
                p2Max: match.value.p1.serve1_pts + match.value.p1.serve2_pts + match.value.p1.ret1 + match.value.p1.ret2
            }
        ].filter(Boolean)
        pointStats.map(stat => {
            if (stat.p1Max) {
                stat.p1Value = percentage(stat.p1Actual, stat.p1Max)
                stat.p2Value = percentage(stat.p2Actual, stat.p2Max)
            }
        })
        stats.value = [
            { category: 'Service Stats', stats: serviceStats, id: 'service-stats' },
            { category: 'Return Stats', stats: returnStats, id: 'return-stats' },
            { category: 'Point Stats', stats: pointStats, id: 'points-stats' }
        ]
        if (match.value.p1.max_speed_kph) {
            anchorItems.value.push(
                {
                    key: 4,
                    href: '#service-speed',
                    title: 'Service Speed'
                })
            serviceSpeed.value = [
                { name: 'Max Speed', p1: match.value.p1.max_speed_kph, p2: match.value.p2.max_speed_kph },
                { name: '1st serve average speed', p1: match.value.p1.avg_sv1_kph, p2: match.value.p2.avg_sv1_kph },
                { name: '2nd serve average speed', p1: match.value.p1.avg_sv2_kph, p2: match.value.p2.avg_sv2_kph }
            ]
        }
    }
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
    <Title v-if="match">
        <template #title>{{ unencodeName(name) }} {{ year }}</template>
        <template #subtitle>{{ match.round.round }}</template>
    </Title>
    <a-row v-if="match">
        <a-col :span="4">
            <a-anchor :items="anchorItems" :offset-top="75" />
        </a-col>
        <a-col :span="20">
            <MatchDetails :match />
            <a-row class="flex items-center mb-5">
                <a-col :span="6">
                    <a-card class="h-full flex flex-col justify-between pt-5 items-center">
                        <template #cover>
                            <a-image :alt="match.p1.player.player.full_name" :src="headshot(match.p1.player.player.id)"
                                class="!rounded-full !border-zinc-300 border-[1.5px] !w-28" :preview="false" />
                        </template>
                        <a-card-meta class="text-center">
                            <template #title>
                                <a-row class="flex items-center">
                                    <a-col :span="4">
                                        <a-image :alt="match.p1.player.player.country.name"
                                            :src="flag(match.p1.player.player.country.id)" :preview="false"
                                            class="rounded" />
                                    </a-col>
                                    <a-col :span="20">
                                        <router-link class="hover-link text-lg"
                                            :to="{ name: 'player', params: playerParams(match.p1) }">{{
                                                match.p1.player.player.full_name }}</router-link>
                                    </a-col>
                                </a-row>
                            </template>
                        </a-card-meta>
                    </a-card>
                </a-col>
                <a-col :span="12" class="px-3">
                    <ScoreBox :p1="match.p1" :p2="match.p2" :winner="match.winner.player.player.id" />
                </a-col>
                <a-col :span="6">
                    <a-config-provider :theme="{ components: { Card: { colorBgContainer: COLOURS.green800 } } }">
                        <a-card class="h-full flex flex-col justify-between pt-5 items-center">
                            <template #cover>
                                <a-image :alt="match.p2.player.player.full_name"
                                    :src="headshot(match.p2.player.player.id)"
                                    class="!rounded-full !border-zinc-300 border-[1.5px] !w-28" :preview="false" />
                            </template>
                            <a-card-meta class="text-center">
                                <template #title>
                                    <a-row class="flex items-center">
                                        <a-col :span="4">
                                            <a-image :alt="match.p2.player.player.country.name"
                                                :src="flag(match.p2.player.player.country.id)" :preview="false"
                                                class="rounded" />
                                        </a-col>
                                        <a-col :span="20">
                                            <router-link class="hover-link text-lg"
                                                :to="{ name: 'player', params: playerParams(match.p2) }">{{
                                                    match.p2.player.player.full_name }}</router-link>
                                        </a-col>
                                    </a-row>
                                </template>
                            </a-card-meta>
                        </a-card>
                    </a-config-provider>
                </a-col>
            </a-row>
            <div v-for="stat in stats" :key="stat.category">
                <div :id="stat.id" class="text-3xl text-zinc-400 uppercase">{{ stat.category }}</div>
                <StatsChart :stats="stat.stats" :p1="match.p1.player.player.full_name"
                    :p2="match.p2.player.player.full_name" />
            </div>
            <div v-if="match.p1.max_speed_kph" id="service-speed" class="text-3xl text-zinc-400">SERVICE SPEED
            </div>
            <ServiceSpeed v-if="match.p1.max_speed_kph" :stats="serviceSpeed" />
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No stats available</template>
    </Loading>
</template>