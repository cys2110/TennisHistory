<script setup>
import { ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { GET_MATCH } from '@/services/MatchService';
import { percentage, unencodeName } from '@/utils/functions';

// [TODO: UPDATE DOCUMENT TITLE]
// [TODO: SCOREBOX AND PLAYER IMAGES]

const props = defineProps(['name', 'id', 'eid', 'year', 'mid'])
const match = ref(null)
const serviceStats = ref(null)
const returnStats = ref(null)
const pointStats = ref(null)
const serviceSpeed = ref(null)
const anchorItems = ref([
    {
        key: 1,
        href: '#service-stats',
        title: "Service Stats"
    },
    {
        key: 2,
        href: '#return-stats',
        title: 'Return Stats'
    },
    {
        key: 3,
        href: '#points-stats',
        title: 'Points Stats'
    }
])

provideApolloClient(apolloClient)
const { query, variables } = GET_MATCH(parseInt(props.mid), parseInt(props.eid))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        match.value = newResult.matches[0]
        console.log(match.value)
        serviceStats.value = [
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
                p1Value: percentage(match.value.p1.serve1_pts, match.value.p1.serve1_pts + match.value.p1.serve2_pts).toFixed(0),
                p1Actual: match.value.p1.serve1_pts,
                p1Max: match.value.p1.serve1_pts + match.value.p1.serve2_pts,
                p2Value: percentage(match.value.p2.serve1_pts, match.value.p2.serve1_pts + match.value.p2.serve2_pts).toFixed(0),
                p2Actual: match.value.p2.serve1_pts,
                p2Max: match.value.p2.serve1_pts + match.value.p2.serve2_pts
            },
            {
                category: '1st serve points won',
                p1Value: percentage(match.value.p1.serve1_pts_w, match.value.p1.serve1_pts).toFixed(0),
                p1Actual: match.value.p1.serve1_pts_w,
                p1Max: match.value.p1.serve1_pts,
                p2Value: percentage(match.value.p2.serve1_pts_w, match.value.p2.serve1_pts).toFixed(0),
                p2Actual: match.value.p2.serve1_pts_w,
                p2Max: match.value.p2.serve1_pts
            },
            {
                category: '2nd serve points won',
                p1Value: percentage(match.value.p1.serve2_pts_w, match.value.p1.serve2_pts).toFixed(0),
                p1Actual: match.value.p1.serve2_pts_w,
                p1Max: match.value.p1.serve2_pts,
                p2Value: percentage(match.value.p2.serve2_pts_w, match.value.p2.serve1_pts).toFixed(0),
                p2Actual: match.value.p2.serve2_pts_w,
                p2Max: match.value.p2.serve1_pts
            },
            {
                category: 'Break points saved',
                p1Value: percentage(match.value.p1.bps_saved, match.value.p1.bps_faced).toFixed(0),
                p1Actual: match.value.p1.bps_saved,
                p1Max: match.value.p1.bps_faced,
                p2Value: percentage(match.value.p2.bps_saved, match.value.p2.bps_faced).toFixed(0),
                p2Actual: match.value.p2.bps_saved,
                p2Max: match.value.p2.bps_faced
            }
        ]
        returnStats.value = [
            {
                category: '1st serve return points won',
                p1Value: percentage(match.value.p1.ret1_w, match.value.p1.ret1).toFixed(0),
                p1Actual: match.value.p1.ret1_w,
                p1Max: match.value.p1.ret1,
                p2Value: percentage(match.value.p2.ret1_w, match.value.p2.ret1).toFixed(0),
                p2Actual: match.value.p2.ret1_w,
                p2Max: match.value.p2.ret1
            },
            {
                category: '2nd serve return points won',
                p1Value: percentage(match.value.p1.ret2_w, match.value.p1.ret2).toFixed(0),
                p1Actual: match.value.p1.ret2_w,
                p1Max: match.value.p1.ret2,
                p2Value: percentage(match.value.p2.ret2_w, match.value.p2.ret2).toFixed(0),
                p2Actual: match.value.p2.ret2_w,
                p2Max: match.value.p2.ret2
            },
            {
                category: 'Break points converted',
                p1Value: percentage(match.value.p1.bps_converted, match.value.p1.bp_opps).toFixed(0),
                p1Actual: match.value.p1.bps_converted,
                p1Max: match.value.p1.bp_opps,
                p2Value: percentage(match.value.p2.bps_converted, match.value.p2.bp_opps).toFixed(0),
                p2Actual: match.value.p2.bps_converted,
                p2Max: match.value.p2.bp_opps
            }
        ]

        pointStats.value = [
            {
                category: 'Service points won',
                p1Value: percentage(match.value.p1.serve1_pts_w + match.value.p1.serve2_pts_w, match.value.p1.serve1_pts + match.value.p1.serve2_pts).toFixed(0),
                p1Actual: match.value.p1.serve1_pts_w + match.value.p1.serve2_pts_w,
                p1Max: match.value.p1.serve1_pts + match.value.p1.serve2_pts,
                p2Value: percentage(match.value.p2.serve1_pts_w + match.value.p2.serve2_pts_w, match.value.p2.serve1_pts + match.value.p2.serve2_pts).toFixed(0),
                p2Actual: match.value.p2.serve1_pts_w + match.value.p2.serve2_pts_w,
                p2Max: match.value.p2.serve1_pts + match.value.p2.serve2_pts
            },
            {
                category: 'Return points won',
                p1Value: percentage(match.value.p1.ret1_w + match.value.p1.ret2_w, match.value.p1.ret1 + match.value.p1.ret2).toFixed(0),
                p1Actual: match.value.p1.ret1_w + match.value.p1.ret2_w,
                p1Max: match.value.p1.ret1 + match.value.p1.ret2,
                p2Value: percentage(match.value.p2.ret1_w + match.value.p2.ret2_w, match.value.p2.ret1 + match.value.p2.ret2).toFixed(0),
                p2Actual: match.value.p2.ret1_w + match.value.p2.ret2_w,
                p2Max: match.value.p2.ret1 + match.value.p2.ret2
            }
        ]
        if (match.value.p1.net) {
            const netPoints = {
                category: 'Net points won',
                p1Value: percentage(match.value.p1.net_w, match.value.p1.net).toFixed(0),
                p1Actual: match.value.p1.net_w,
                p1Max: match.value.p1.net,
                p2Value: percentage(match.value.p2.net_w, match.value.p2.net).toFixed(0),
                p2Actual: match.value.p2.net_w,
                p2Max: match.value.p2.net
            }
            pointStats.value = [netPoints, ...pointStats.value]
        }
        if (match.value.p1.winners) {
            const winnerPoints = {
                category: 'Winners',
                p1Value: match.value.p1.winners,
                p2Value: match.value.p2.winners
            }
            pointStats.value = [...pointStats.value, winnerPoints]
        }
        if (match.value.p1.ues) {
            const uePoints = {
                category: 'Unforced errors',
                p1Value: match.value.p1.ues,
                p2Value: match.value.p2.ues
            }
            pointStats.value = [...pointStats.value, uePoints]
        }
        pointStats.value = [...pointStats.value, {
            category: 'Total Points Won',
            p1Value: percentage(match.value.p1.serve1_pts_w +
                match.value.p1.serve2_pts_w +
                match.value.p1.ret1_w +
                match.value.p1.ret2_w, match.value.p1.serve1_pts + match.value.p1.serve2_pts + match.value.p1.ret1 + match.value.p1.ret2).toFixed(0),
            p1Actual: match.value.p1.serve1_pts_w +
                match.value.p1.serve2_pts_w +
                match.value.p1.ret1_w +
                match.value.p1.ret2_w,
            p1Max: match.value.p1.serve1_pts + match.value.p1.serve2_pts + match.value.p1.ret1 + match.value.p1.ret2,
            p2Value: percentage(match.value.p2.serve1_pts_w +
                match.value.p2.serve2_pts_w +
                match.value.p2.ret1_w +
                match.value.p2.ret2_w, match.value.p1.serve1_pts + match.value.p1.serve2_pts + match.value.p1.ret1 + match.value.p1.ret2).toFixed(0),
            p2Actual: match.value.p2.serve1_pts_w +
                match.value.p2.serve2_pts_w +
                match.value.p2.ret1_w +
                match.value.p2.ret2_w,
            p2Max: match.value.p1.serve1_pts + match.value.p1.serve2_pts + match.value.p1.ret1 + match.value.p1.ret2
        }]
        if (match.value.p1.max_speed_kph) {
            anchorItems.value.push(
                {
                    key: 4,
                    href: '#service-speed',
                    title: 'Service Speed'
                })
            serviceSpeed.value = [
                {
                    name: 'Max Speed',
                    p1: match.value.p1.max_speed_kph,
                    p2: match.value.p2.max_speed_kph
                },
                {
                    name: '1st serve average speed',
                    p1: match.value.p1.avg_sv1_kph,
                    p2: match.value.p2.avg_sv1_kph
                },
                {
                    name: '2nd serve average speed',
                    p1: match.value.p1.avg_sv2_kph,
                    p2: match.value.p2.avg_sv2_kph
                }
            ]
        }
    }
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
    <!--[TODO: ADD MATCH BREADCRUMBS]-->
    <Title>
        <template #title>{{ unencodeName(name) }} {{ year }}</template>
        <template v-if="match" #subtitle>{{ match.round.round }}</template>
    </Title>
    <a-row v-if="match">
        <a-col :span="4">
            <a-config-provider :theme="{ components: { Anchor: { colorPrimary: '#6d28d9' } } }">
                <a-anchor :items="anchorItems" :offset-top="75" />
            </a-config-provider>
        </a-col>
        <a-col :span="20">
            <MatchDetails :match />
            <!--[TODO: ITERATE]-->
            <div id="service-stats" class="text-3xl text-zinc-400">SERVICE STATS</div>
            <StatsChart :stats="serviceStats" :p1="match.p1.player.player.full_name"
                :p2="match.p2.player.player.full_name" />

            <div id="return-stats" class="text-3xl text-zinc-400">RETURN STATS</div>
            <StatsChart :stats="returnStats" :p1="match.p1.player.player.full_name"
                :p2="match.p2.player.player.full_name" />
            <div id="points-stats" class="text-3xl text-zinc-400">POINT STATS</div>
            <StatsChart :stats="pointStats" :p1="match.p1.player.player.full_name"
                :p2="match.p2.player.player.full_name" />
            <div id="service-speed" class="text-3xl text-zinc-400">SERVICE SPEED</div>
            <ServiceSpeed :stats="serviceSpeed" />
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No stats available</template>
    </Loading>
</template>