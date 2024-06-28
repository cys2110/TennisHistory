<script setup lang="ts">
// import DualStatItem from '@/components/MatchStats/DualStatItem.vue';
// import ServiceStatItem from '@/components/MatchStats/ServiceStatItem.vue';
// import StatItem from '@/components/MatchStats/StatItem.vue';
// import { formatDate, formattedDates, round, formatTime, flagSrc, headshot, status, incomplete } from '@/components/utils';
// import type { MatchStat } from '@/components/interfaces';
// import EditionService from '@/services/EditionService';
// import { ref, type Ref, watch, onMounted } from 'vue';
// import { useDisplay } from 'vuetify';

// const props = defineProps<{
//     matchId: string,
//     name: string,
//     id: string,
//     editionNo: string,
//     p1: string,
//     p2: string
// }>()
// const match: Ref<MatchStat | null> = ref(null)
// const p1Scores: Ref<{set: number | string, tie: number | string}[]> = ref([])
// const p2Scores: Ref<{set: number | string, tie: number | string}[]> = ref([])
// const { mdAndUp } = useDisplay()

// const updateDocumentTitle = () => {
//     const p1Name = props.p1.replace(/_/g, ' ')
//     const p2Name = props.p2.replace(/_/g, ' ')
//     const tournamentName = props.name.replace(/_/g, ' ')
//     document.title = `${p1Name} v. ${p2Name} | ${tournamentName} | TennisHistory`
// }

// onMounted(() => {
//     EditionService.getMatchStats(parseInt(props.matchId))
//     .then(response => {
//         match.value = response.data
//         console.log(match.value)
//         p1Scores.value = [
//             { set: match.value?.MatchScore.s5p1 ?? '', tie: match.value?.MatchScore.t5p1 ?? '' },
//             { set: match.value?.MatchScore.s4p1 ?? '', tie: match.value?.MatchScore.t4p1 ?? '' },
//             { set: match.value?.MatchScore.s3p1 ?? '', tie: match.value?.MatchScore.t3p1 ?? '' },
//             { set: match.value?.MatchScore.s2p1 ?? '', tie: match.value?.MatchScore.t2p1 ?? '' },
//             { set: match.value?.MatchScore.s1p1 ?? '', tie: match.value?.MatchScore.t1p1 ?? '' },
//         ]
//         p2Scores.value = [
//             { set: match.value?.MatchScore.s5p2 ?? '', tie: match.value?.MatchScore.t5p2 ?? '' },
//             { set: match.value?.MatchScore.s4p2 ?? '', tie: match.value?.MatchScore.t4p2 ?? '' },
//             { set: match.value?.MatchScore.s3p2 ?? '', tie: match.value?.MatchScore.t3p2 ?? '' },
//             { set: match.value?.MatchScore.s2p2 ?? '', tie: match.value?.MatchScore.t2p2 ?? '' },
//             { set: match.value?.MatchScore.s1p2 ?? '', tie: match.value?.MatchScore.t1p2 ?? '' },
//         ]
//     })
//     .catch(e => console.log(e))
// })

// watch(() => props.name, () => {
//     updateDocumentTitle()
// }, {immediate: true})
</script>

<template>
    <!-- <v-sheet v-if="match" class="w-5/6 md:w-8/12 lg:w-1/2 mx-auto my-10 bg-transparent">
        <div class="text-zinc-300 text-center">
            <div class="text-3xl">
                <span v-if="match.MatchScore.Edition.sponsor_name">{{ match.MatchScore.Edition.sponsor_name }} | </span>
                <span>
                    <router-link
                        class="hover-link"
                        :to="{name: 'Tournament'}"
                    >
                        {{ name.replace(/_/g, ' ') }}
                    </router-link>
                </span>
            </div>
            <div>
                <span>{{ match.MatchScore.Edition.environment }} {{ match.MatchScore.Edition.surface }}</span>
                <span v-if="match.MatchScore.Edition.hard_type"> ({{ match.MatchScore.Edition.hard_type }})</span>
                <span> | {{ round(match.MatchScore.round) }}</span>
            </div>
            <div>
                <span>{{ match.MatchScore.date ? formatDate(match.MatchScore.date) : formattedDates(match.MatchScore.Edition.start_date, match.MatchScore.Edition.end_date)}}</span>
                <span v-if="match.MatchScore.duration_mins"> | {{ formatTime(match.MatchScore.duration_mins) }} | </span>
                <span>{{ match.MatchScore.umpire ?? '' }}</span>
            </div>
        </div>
        <short-card class="my-10 sm:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto">
            <v-container>
                <v-row>
                    <v-col class="flex items-center">
                        <div>
                            <flag-img
                                :src="flagSrc(match.MatchScore.entry1.Player.country)"
                                :alt="match.MatchScore.entry1.Player.country"
                                class="w-[2rem] mx-0.5"
                            />
                        </div>
                        <div>
                            <v-avatar class="mx-0.5">
                                <v-img
                                    :src="headshot(match.MatchScore.entry1.Player.id)"
                                    :alt="match.MatchScore.entry1.Player.full_name"
                                />
                            </v-avatar>
                        </div>
                        <div class="mx-0.5">
                            <router-link
                                class="hover-link text-sm"
                                :to="{name: 'Player', params: {id: match.MatchScore.entry1.Player.id, name: p1}}"
                            >
                                {{ match.MatchScore.entry1.Player.full_name }}
                            </router-link>
                            <small v-if="match.MatchScore.entry1.seed || match.MatchScore.entry1.status" class="mx-1 text-zinc-300">{{ status(match.MatchScore.entry1.seed, match.MatchScore.entry1.status) }}</small>
                        </div>
                    </v-col>
                    <v-col cols="1" class="flex items-center">
                        <v-icon v-if="match.MatchScore.winner_id === match.MatchScore.entry1.Player.id" icon="fad fa-check" class="text-green-600 text-sm" />
                    </v-col>
                    <v-col cols="3" class="flex flex-row-reverse text-sm items-center text-zinc-300">
                        <div
                            v-for="score in p1Scores"
                            :key="score.set"
                        >
                            {{ score.set }}<sup>{{ score.tie }}</sup>&nbsp;
                        </div>
                    </v-col>
                    <v-col cols="1" v-if="match.MatchScore.incomplete" class="flex text-sm items-center text-zinc-300">
                        <div v-if="match.MatchScore.winner_id === match.MatchScore.entry2.Player.id" class="mx-0.5">{{ incomplete(match.MatchScore.incomplete) }}</div>
                    </v-col>
                </v-row>
                <v-row >
                    <v-col class="flex items-center">
                        <div>
                            <flag-img
                                :src="flagSrc(match.MatchScore.entry2.Player.country)"
                                :alt="match.MatchScore.entry2.Player.country"
                                class="w-[2rem] mx-0.5"
                            />
                        </div>
                        <div>
                            <v-avatar class="mx-0.5">
                                <v-img
                                    :src="headshot(match.MatchScore.entry2.Player.id)"
                                    :alt="match.MatchScore.entry2.Player.full_name"
                                />
                            </v-avatar>
                        </div>
                        <div class="mx-0.5">
                            <router-link
                                class="hover-link text-sm"
                                :to="{name: 'Player', params: {id: match.MatchScore.entry2.Player.id, name: p2}}"
                            >
                                {{ match.MatchScore.entry2.Player.full_name }}
                            </router-link>
                            <small v-if="match.MatchScore.entry2.seed || match.MatchScore.entry2.status" class="mx-1 text-zinc-300">{{ status(match.MatchScore.entry2.seed, match.MatchScore.entry2.status) }}</small>
                        </div>
                    </v-col>
                    <v-col cols="1" class="flex items-center">
                        <v-icon v-if="match.MatchScore.winner_id === match.MatchScore.entry2.Player.id" icon="fad fa-check" class="text-green-600 text-sm" />
                    </v-col>
                    <v-col cols="3" class="flex flex-row-reverse text-sm items-center text-zinc-300">
                        <div
                            v-for="score in p2Scores"
                            :key="score.set"
                        >
                            {{ score.set }}<sup>{{ score.tie }}</sup>&nbsp;
                        </div>
                    </v-col>
                    <v-col cols="1" v-if="match.MatchScore.incomplete" class="flex text-sm items-center text-zinc-300">
                        <div v-if="match.MatchScore.winner_id === match.MatchScore.entry1.Player.id" class="mx-0.5">{{ incomplete(match.MatchScore.incomplete) }}</div>
                    </v-col>
                </v-row>
            </v-container>
        </short-card>
        <v-container>
            <v-row class="text-zinc-300">
                <v-col>
                    <v-avatar :size="mdAndUp ? 'x-large' : 'default'">
                        <v-img
                            :src="headshot(match.MatchScore.entry1.Player.id)"
                            :alt="match.MatchScore.entry1.Player.full_name"
                        />
                    </v-avatar>
                    <div class="font-bold text-uppercase mt-1">{{ match.MatchScore.entry1.Player.full_name }}</div>
                </v-col>
                <v-col class="flex items-end justify-center">
                    <div v-if="match.p1_serve1_pts" class="font-bold text-center">SERVICE STATS</div>
                </v-col>
                <v-col class="text-right">
                    <v-avatar :size="mdAndUp ? 'x-large' : 'default'">
                        <v-img
                            :src="headshot(match.MatchScore.entry2.Player.id)"
                            :alt="match.MatchScore.entry2.Player.full_name"
                        />
                    </v-avatar>
                    <div class="mt-1 font-bold text-uppercase">{{ match.MatchScore.entry2.Player.full_name }}</div>
                </v-col>
                <v-divider thickness="3" />
            </v-row>
            <StatItem :p1="match.p1_aces" :p2="match.p2_aces">
                <template #metric>Aces</template>
            </StatItem>
            <StatItem :p1="match.p1_dfs" :p2="match.p2_dfs" low>
                <template #metric>Double faults</template>
            </StatItem>
            <DualStatItem :p1Value="match.p1_serve1" :p1Total="match.p1_sv_pts_total"  :p2Value="match.p2_serve1" :p2Total="match.p2_sv_pts_total">
                <template #metric>First serve</template>
            </DualStatItem>
            <DualStatItem :p1Value="match.p1_serve1_pts_w" :p1Total="match.p1_serve1_pts" :p2Value="match.p2_serve1_pts_w" :p2Total="match.p2_serve1_pts">
                <template #metric>1st serve points won</template>
            </DualStatItem>
            <DualStatItem :p1Value="match.p1_serve2_pts_w" :p1Total="match.p1_serve2_pts" :p2Value="match.p2_serve2_pts_w" :p2Total="match.p2_serve2_pts">
                <template #metric>2nd serve points won</template>
            </DualStatItem>
            <DualStatItem :p1Value="match.p1_bps_saved" :p1Total="match.p1_bps_faced" :p2Value="match.p2_bps_saved" :p2Total="match.p2_bps_faced">
                <template #metric>Break points saved</template>
            </DualStatItem>
            <StatItem v-if="match.p1_sv_gms && match.p2_sv_gms" :p1="match.p1_sv_gms" :p2="match.p2_sv_gms" low>
                <template #metric>Service games played</template>
            </StatItem>
            <v-row v-if="match.p1_ret1_w">
                <v-col class="text-center font-bold text-zinc-300">RETURN STATS</v-col>
                <v-divider thickness="3" />
            </v-row>
            <DualStatItem :p2Value="match.p2_ret1_w" :p2Total="match.p2_ret1" :p1Value="match.p1_ret1_w" :p1Total="match.p1_ret1">
                <template #metric>1st serve return points won</template>
            </DualStatItem>
            <DualStatItem :p1Value="match.p1_ret2_w" :p1Total="match.p1_ret2" :p2Value="match.p2_ret2_w" :p2Total="match.p2_ret2">
                <template #metric>2nd serve return points won</template>
            </DualStatItem>
            <DualStatItem :p1Value="match.p1_bps_converted" :p1Total="match.p1_bp_opps" :p2Value="match.p2_bps_converted" :p2Total="match.p2_bp_opps">
                <template #metric>Break points converted</template>
            </DualStatItem>
            <StatItem v-if="match.p1_ret_gms && match.p2_ret_gms" :p1="match.p1_ret_gms" :p2="match.p2_ret_gms" low>
                <template #metric>Return games played</template>
            </StatItem>
            <v-row v-if="match.p1_sv_pts">
                <v-col class="text-center font-bold text-zinc-300">POINT STATS</v-col>
                <v-divider thickness="3" />
            </v-row>
            <DualStatItem v-if="match.p1_net_w && match.p1_net && match.p2_net_w && match.p2_net" :p1Value="match.p1_net_w" :p1Total="match.p1_net" :p2Value="match.p2_net_w" :p2Total="match.p2_net">
                    <template #metric>Net points won</template>
                </DualStatItem>
            <StatItem v-if="match.p1_winners && match.p2_winners" :p1="match.p1_winners" :p2="match.p2_winners">
                <template #metric>Winners</template>
            </StatItem>
            <StatItem v-if="match.p1_ues && match.p2_ues" :p1="match.p1_ues" :p2="match.p2_ues" low>
                <template #metric>Unforced errors</template>
            </StatItem>
            <DualStatItem :p1Value="match.p1_sv_pts" :p1Total="match.p1_sv_pts_total" :p2Value="match.p2_sv_pts" :p2Total="match.p2_sv_pts_total">
                    <template #metric>Service points won</template>
                </DualStatItem>
            <DualStatItem :p1Value="match.p1_ret_pts" :p1Total="match.p1_ret_pts_total" :p2Value="match.p2_ret_pts" :p2Total="match.p2_ret_pts_total">
                <template #metric>Return points won</template>
            </DualStatItem>
            <StatItem :p1="match.p1_pts" :p2="match.p2_pts" percent>
                <template #metric>Total points won</template>
            </StatItem>
            <v-row v-if="match.p1_avg_sv1_kph">
                <v-col class="text-center font-bold text-zinc-300">SERVICE SPEED</v-col>
                <v-divider thickness="3" />
            </v-row>
            <ServiceStatItem v-if="match.p1_max_speed_kph && match.p1_max_speed_mph && match.p2_max_speed_kph && match.p2_max_speed_mph" :p1kph="match.p1_max_speed_kph" :p1mph="match.p1_max_speed_mph" :p2kph="match.p2_max_speed_kph" :p2mph="match.p2_max_speed_mph">
                <template #metric>Max Speed</template>
            </ServiceStatItem>
            <ServiceStatItem v-if="match.p1_avg_sv1_kph && match.p1_avg_sv1_mph && match.p2_avg_sv1_kph && match.p2_avg_sv1_mph" :p1kph="match.p1_avg_sv1_kph" :p1mph="match.p1_avg_sv1_mph" :p2kph="match.p2_avg_sv1_kph" :p2mph="match.p2_avg_sv1_mph">
                <template #metric>1st serve average speed</template>
            </ServiceStatItem>
            <ServiceStatItem v-if="match.p1_avg_sv2_kph && match.p1_avg_sv2_mph && match.p2_avg_sv2_kph && match.p2_avg_sv2_mph" :p1kph="match.p1_avg_sv2_kph" :p1mph="match.p1_avg_sv2_mph" :p2kph="match.p2_avg_sv2_kph" :p2mph="match.p2_avg_sv2_mph">
                <template #metric>2nd serve average speed</template>
            </ServiceStatItem>
        </v-container>
    </v-sheet>
    <view-sheet v-else>
        <div class="text-3xl text-zinc-300">{{ name.replace(/_/g, ' ') }}</div>
        <div class="text-xl text-zinc-300">{{ p1.replace(/_/g, ' ') }} v. {{ p2.replace(/_/g, ' ') }}</div>
        <div class="text-zinc-400 my-4">No data available</div>
    </view-sheet> -->
</template>