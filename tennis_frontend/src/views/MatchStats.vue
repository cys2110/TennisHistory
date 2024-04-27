<script setup>
import EditionService from '@/services/EditionService';
import StatItem from '@/components/Edition/StatItem.vue';
import DualStatItem from '@/components/Edition/DualStatItem.vue';
import StatItemPercent from '@/components/Edition/StatItemPercent.vue';
import StatServiceItem from '@/components/Edition/StatServiceItem.vue';
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { flagSrc, headshot, formattedDates, formatDate, round } from '@/components/utils';

const props = defineProps(['matchId'])
const match = ref(null)
const duration = ref(null)

const incomplete = computed(() => {
    switch (match.value.MatchScore.incomplete) {
        case 'R':
            return 'Retirement'
        case 'D':
            return 'Default'
        case 'WO':
            return 'Walkover'
    }
})

const p1Status = computed(() => {
    if (match.value.MatchScore.entry1.seed && match.value.MatchScore.entry1.status) {
        return `(${match.value.MatchScore.entry1.seed} ${match.value.MatchScore.entry1.status})`
    } else if (match.value.MatchScore.entry1.seed) {
        return `(${match.value.MatchScore.entry1.seed})`
    } else {
        return `(${match.value.MatchScore.entry1.status})`
    }
})

const p2Status = computed(() => {
    if (match.value.MatchScore.entry2.seed && match.value.MatchScore.entry2.status) {
        return `(${match.value.MatchScore.entry2.seed} ${match.value.MatchScore.entry2.status})`
    } else if (match.value.MatchScore.entry2.seed) {
        return `(${match.value.MatchScore.entry2.seed})`
    } else {
        return `(${match.value.MatchScore.entry2.status})`
    }
})

onMounted(() => {
    EditionService.getMatchStats(props.matchId)
    .then (response => {
        match.value = response.data
        const hour = Math.floor(match.value.MatchScore.duration_mins / 60)
        const minutes = match.value.MatchScore.duration_mins % 60
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
        duration.value = `${hour}:${formattedMinutes}`
        console.log(match.value)
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <v-sheet v-if="match && match.MatchScore.incomplete !== 'B'" class="bg-transparent my-10 pa-3 w-75 mx-auto">
        <div class="d-flex flex-column align-center">
            <div class="text-h5">
                <span v-if="match.MatchScore.Edition.sponsor_name">{{ match.MatchScore.Edition.sponsor_name }} | </span>
                <span><RouterLink class="hover-link" :to="{name: 'Tournament', params: {id: match.MatchScore.Edition.Tournament.id, name: match.MatchScore.Edition.Tournament.name}}">{{ match.MatchScore.Edition.Tournament.name }}</RouterLink></span>
            </div>
            <div class="text-subtitle-1">
                <span>{{ match.MatchScore.Edition.environment }} {{ match.MatchScore.Edition.surface }} 
                    <span v-if="match.MatchScore.Edition.hard_type">({{ match.MatchScore.Edition.hard_type }})</span></span> | 
                <span v-if="match.MatchScore.date">{{ formatDate(match.MatchScore.date) }}</span>
                <span v-else>{{ formattedDates(match.MatchScore.Edition.start_date, match.MatchScore.Edition.end_date) }}</span>
            </div>
            <div class="text-subtitle-1"><span>{{ round(match.MatchScore.round) }}</span></div>
        </div>
        <v-card class="w-50 mx-auto my-5 pa-2" rounded="xl" variant="elevated" color="indigo-darken-4">
            <v-container>
                <v-row>
                    <v-col class="d-flex justify-end">
                        <div v-if="match.MatchScore.duration_mins" class="text-body-2">Duration: {{ duration }}</div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="d-flex align-center">
                        <div>
                            <v-avatar
                                v-if="match.MatchScore.player1.headshot"
                                variant="outlined"
                            >
                                <v-img :src="headshot(match.MatchScore.p1)" :alt="match.MatchScore.player1.full_name"></v-img>
                            </v-avatar>
                        </div>
                        <div class="mx-2">
                            <v-img :src="flagSrc(match.MatchScore.player1.country)" :alt="match.MatchScore.player1.country" rounded="lg" width="50"></v-img>
                        </div>
                        <div>
                            <RouterLink class="hover-link" :to="{name: 'Player', params: {id: match.MatchScore.p1, name: match.MatchScore.player1.full_name}}">{{ match.MatchScore.player1.full_name }}</RouterLink>
                            <span v-if="match.MatchScore.entry1.seed || match.MatchScore.entry1.status">&nbsp;<small>{{ p1Status }}</small></span>
                        </div>
                    </v-col>
                    <v-col cols="1">
                        <v-icon v-if="match.MatchScore.winner_id === match.MatchScore.p1" icon="fad fa-check"></v-icon>
                    </v-col>
                    <v-col cols="3" class="d-flex justify-space-evenly">
                        <div v-if="match.MatchScore.s1p1 || match.MatchScore.s1p1 === 0">
                            {{ match.MatchScore.s1p1 }}
                            <sup v-if="match.MatchScore.t1p1 || match.MatchScore.t1p1 === 0">{{ match.MatchScore.t1p1 }}</sup>
                        </div>
                        <div v-if="match.MatchScore.s2p1 || match.MatchScore.s2p1 === 0">
                            {{ match.MatchScore.s2p1 }}
                            <sup v-if="match.MatchScore.t2p1 || match.MatchScore.t2p1 === 0">{{ match.MatchScore.t2p1 }}</sup>
                        </div>
                        <div v-if="match.MatchScore.s3p1 || match.MatchScore.s3p1 === 0">
                            {{ match.MatchScore.s3p1 }}
                            <sup v-if="match.MatchScore.t3p1 || match.MatchScore.t3p1 === 0">{{ match.MatchScore.t3p1 }}</sup>
                        </div>
                        <div v-if="match.MatchScore.s4p1 || match.MatchScore.s4p1 === 0">
                            {{ match.MatchScore.s4p1 }}
                            <sup v-if="match.MatchScore.t4p1 || match.MatchScore.t4p1 === 0">{{ match.MatchScore.t4p1 }}</sup>
                        </div>
                        <div v-if="match.MatchScore.s5p1 || match.MatchScore.s5p1 === 0">
                            {{ match.MatchScore.s5p1 }}
                            <sup v-if="match.MatchScore.t5p1 || match.MatchScore.t5p1 === 0">{{ match.MatchScore.t5p1 }}</sup>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="d-flex align-center">
                        <div>
                            <v-avatar
                                variant="outlined"
                            >
                                <v-img :src="headshot(match.MatchScore.p2)" :alt="match.MatchScore.player2.full_name"></v-img>
                            </v-avatar>
                        </div>
                        <div class="mx-2">
                            <v-img :src="flagSrc(match.MatchScore.player2.country)" width="50" :alt="match.MatchScore.player2.country" rounded="lg"></v-img>
                        </div>
                        <div>
                            <RouterLink class="hover-link" :to="{name: 'Player', params: {id: match.MatchScore.p2, name: match.MatchScore.player2.full_name}}">{{ match.MatchScore.player2.full_name }}</RouterLink>
                            <span v-if="match.MatchScore.entry2.seed || match.MatchScore.entry2.status">&nbsp;<small>{{ p2Status }}</small></span>
                        </div>
                    </v-col>
                    <v-col cols="1">
                        <v-icon v-if="match.MatchScore.winner_id === match.MatchScore.p2" icon="fad fa-check"></v-icon>
                    </v-col>
                    <v-col cols="3" class="d-flex justify-space-evenly">
                        <div v-if="match.MatchScore.s1p2 || match.MatchScore.s1p2 === 0">
                            {{ match.MatchScore.s1p2 }}
                            <sup v-if="match.MatchScore.t1p1 || match.MatchScore.t1p1 === 0">{{ match.MatchScore.t1p2 }}</sup>
                        </div>
                        <div v-if="match.MatchScore.s2p2 || match.MatchScore.s2p2 === 0">
                            {{ match.MatchScore.s2p2 }}
                            <sup v-if="match.MatchScore.t2p1 || match.MatchScore.t2p1 === 0">{{ match.MatchScore.t2p2 }}</sup>
                        </div>
                        <div v-if="match.MatchScore.s3p2 || match.MatchScore.s3p2 === 0">
                            {{ match.MatchScore.s3p2 }}
                            <sup v-if="match.MatchScore.t3p1 || match.MatchScore.t3p1 === 0">{{ match.MatchScore.t3p2 }}</sup>
                        </div>
                        <div v-if="match.MatchScore.s4p2 || match.MatchScore.s4p2 === 0">
                            {{ match.MatchScore.s4p2 }}
                            <sup v-if="match.MatchScore.t4p1 || match.MatchScore.t4p1 === 0">{{ match.MatchScore.t4p2 }}</sup>
                        </div>
                        <div v-if="match.MatchScore.s5p2 || match.MatchScore.s5p2 === 0">
                            {{ match.MatchScore.s5p2 }}
                            <sup v-if="match.MatchScore.t5p1 || match.MatchScore.t5p1 === 0">{{ match.MatchScore.t5p2 }}</sup>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="match.MatchScore.incomplete">{{ incomplete }}</v-col>
                    <v-col v-if="match.MatchScore.umpire" class="text-right text-body-2">Umpire: {{ match.MatchScore.umpire }}</v-col>
                </v-row>
            </v-container>
        </v-card>
        <v-container class="w-75">
            <v-row v-if="match.p1_serve1 || match.p1_sv_pts">
                <v-col>
                    <v-avatar
                        v-if="match.MatchScore.player1.headshot"
                        variant="outlined"
                        size="x-large"
                    >
                        <v-img :src="headshot(match.MatchScore.p1)"></v-img>
                    </v-avatar>
                    <div class="text-uppercase font-weight-bold mt-1">{{ match.MatchScore.player1.full_name }}</div>
                </v-col>
                <v-col v-if="match.p1_serve1" class="font-weight-bold text-center text-h6 d-flex align-end justify-center">SERVICE STATS</v-col>
                <v-col class="text-right">
                    <v-avatar
                        v-if="match.MatchScore.player2.headshot"
                        variant="outlined"
                        size="x-large"
                    >
                        <v-img :src="headshot(match.MatchScore.p2)"></v-img>
                    </v-avatar>
                    <div class="text-uppercase font-weight-bold mt-1">{{ match.MatchScore.player2.full_name }}</div>
                </v-col>
                <v-divider thickness="3"></v-divider>
            </v-row>
            <div v-if="match.p1_serve1">
                <StatItem :p1="match.p1_aces" :p2="match.p2_aces">
                    <template #metric>Aces</template>
                </StatItem>
                <StatItem :p1="match.p1_dfs" :p2="match.p2_dfs">
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
                <StatItem :p1="match.p1_sv_gms" :p2="match.p2_sv_gms">
                    <template #metric>Service games played</template>
                </StatItem>
            </div>
            <div v-if="match.p1_serve1_pts">
                <v-row>
                    <v-col class="font-weight-bold text-center text-h6">RETURN STATS</v-col>
                    <v-divider thickness="3"></v-divider>
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
                <StatItem :p1="match.p1_ret_gms" :p2="match.p2_ret_gms">
                    <template #metric>Return games played</template>
                </StatItem>
            </div>
            <div v-if="match.p1_sv_pts">
                <v-row>
                    <v-col class="font-weight-bold text-center text-h6">POINT STATS</v-col>
                    <v-divider thickness="3"></v-divider>
                </v-row>
                <DualStatItem v-if="match.p1_net_w" :p1Value="match.p1_net_w" :p1Total="match.p1_net" :p2Value="match.p2_net_w" :p2Total="match.p2_net">
                    <template #metric>Net points won</template>
                </DualStatItem>
                <StatItem v-if="match.p1_winners" :p1="match.p1_winners" :p2="match.p2_winners">
                    <template #metric>Winners</template>
                </StatItem>
                <StatItem v-if="match.p1_ues" :p1="match.p1_ues" :p2="match.p2_ues">
                    <template #metric>Unforced errors</template>
                </StatItem>
                <DualStatItem :p1Value="match.p1_sv_pts" :p1Total="match.p1_sv_pts_total" :p2Value="match.p2_sv_pts" :p2Total="match.p2_sv_pts_total">
                    <template #metric>Service points won</template>
                </DualStatItem>
                <DualStatItem :p1Value="match.p1_ret_pts" :p1Total="match.p1_ret_pts_total" :p2Value="match.p2_ret_pts" :p2Total="match.p2_ret_pts_total">
                    <template #metric>Return points won</template>
                </DualStatItem>
                <StatItemPercent :p1Value="match.p1_pts" :total="match.total_pts">
                    <template #metric>Total points won</template>
                </StatItemPercent>
            </div>
            <div v-if="match.p1_max_speed_kph">
                <v-row>
                    <v-col class="font-weight-bold text-center text-h6">SERVICE SPEED</v-col>
                    <v-divider thickness="3"></v-divider>
                </v-row>
                <StatServiceItem :p1Kmh="match.p1_max_speed_kph" :p1Mph="match.p1_max_speed_mph" :p2Kmh="match.p2_max_speed_kph" :p2Mph="match.p2_max_speed_mph">
                    <template #metric>Max Speed</template>
                </StatServiceItem>
                <StatServiceItem :p1-kmh="match.p1_avg_sv1_kph" :p1-mph="match.p1_avg_sv1_mph" :p2-kmh="match.p2_avg_sv1_kph" :p2-mph="match.p2_avg_sv1_mph">
                    <template #metric>1st serve average speed</template>
                </StatServiceItem>
                <StatServiceItem :p1-kmh="match.p1_avg_sv2_kph" :p1-mph="match.p1_avg_sv2_mph" :p2-kmh="match.p2_avg_sv2_kph" :p2-mph="match.p2_avg_sv2_mph">
                    <template #metric>2nd serve average speed</template>
                </StatServiceItem>
            </div>
        </v-container>
    </v-sheet>
    <div v-else class="text-subtitle-1">No data available</div>
</template>