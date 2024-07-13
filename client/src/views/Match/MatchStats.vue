<script setup lang="ts">
import { ref, type Ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { getMatchStats } from '@/services/MatchService';
import type { MatchStats, ActivityEntry } from '@/utils/interfaces';
import { unencodeName, formatDate, formattedDates, formatTime, incomplete, encodeName, flag, headshot } from '@/utils/functions';
import DualStatItem from '@/components/MatchStats/DualStatItem.vue';
import ServiceStatItem from '@/components/MatchStats/ServiceStatItem.vue';
import StatItem from '@/components/MatchStats/StatItem.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    name: string,
    id: string,
    year: string,
    eventId: string,
    matchId: string
}>()

const { query, variables } = getMatchStats(parseInt(props.matchId), parseInt(props.eventId))
const { result, loading, error} = useQuery(query, variables)

const match: Ref<MatchStats | null> = ref(null)
const entry1: Ref<ActivityEntry | undefined> = ref()
const entry2: Ref<ActivityEntry | undefined> = ref()

    watch(result, (newResult) => {
    if (newResult) {
        match.value = newResult.matches[0]
        entry1.value = match.value?.event.playersConnection.edges.find(obj => obj.node.id === match.value?.p1.player.id)
        entry2.value = match.value?.event.playersConnection.edges.find(obj => obj.node.id === match.value?.p2.player.id)
    }
}, {immediate: true})

watch(error, (newError) => {
    if (newError) {
        console.error(newError)
    }
})

const updateDocumentTitle = () => {
    document.title = `${unencodeName(props.name)} ${props.year} ${props.matchId} | TennisHistory`
}

watch(() => props.name, () => {
    updateDocumentTitle()
}, {immediate: true})
</script>

<template>
    <v-sheet
        v-if="match"
        class="w-5/6 md:w-8/12 lg:w-1/2 mx-auto my-10 bg-transparent"
    >
        <div
            class="text-zinc-300 text-center"
        >
            <div
                class="text-3xl"
            >
                <router-link
                    class="hover-link"
                    :to="{name: 'Tournament'}"
                >
                    {{ match.event.tournament.name }}
                </router-link>
            </div>
            <div
                class="text-xl"
            >
                {{ match.event.sponsor_name ?? '' }}
            </div>
            <div>
                {{ match.event.surface.environment }} {{ match.event.surface.surface }}
                <span
                    v-if="match.event.surface.hard_type"
                >
                    ({{ match.event.surface.hard_type }})
                </span>
                | {{ match.date ? formatDate(match.date) : formattedDates(match.event.start_date, match.event.end_date) }}
            </div>
        </div>
        <v-card
            class="text-zinc-300 my-10 p-1 bg-indigo-800"
            variant="text"
            rounded="xl"
        >
            <v-card-text
                class="flex justify-between"
            >
                <div>
                    <span>{{ match.round }}</span>
                    <span
                        v-if="match.court"
                    >
                         — {{ match.court }}
                    </span>
                </div>
                <div
                    v-if="match.duration_mins"
                >
                    {{ formatTime(match.duration_mins) }}
                </div>
            </v-card-text>
            <v-container>
                <v-row>
                    <v-col
                        class="flex items-center"
                    >
                        <div>
                            <flag-img
                                v-if="match.p1.player.country"
                                class="w-[2rem] mx-0.5"
                                :src="flag(match.p1.player.country.id)"
                                :alt="match.p1.player.country.name"
                            />
                        </div>
                        <div>
                            <v-avatar
                                class="mx-0.5"
                            >
                                <v-img
                                    :src="headshot(match.p1.player.id)"
                                    :alt="match.p1.player.full_name"
                                />
                            </v-avatar>
                        </div>
                        <div
                            class="mx-0.5"
                        >
                            <router-link
                                class="hover-link text-sm"
                                :to="{name: 'Player', params: {id: match.p1.player.id, name: encodeName(match.p1.player.full_name)}}"
                            >
                                {{ match.p1.player.full_name }}
                            </router-link>
                            <small
                                v-if="entry1?.properties.seed || entry1?.properties.status"
                            >
                                ({{ entry1?.properties.seed }}<span v-if="entry1?.properties.seed && entry1.properties.status"> </span>{{ entry1?.properties.status }})
                            </small>
                        </div>
                    </v-col>
                    <v-col
                        cols="1"
                    >
                        <v-icon
                            v-if="match.winner.player.id === match.p1.player.id"
                            class="text-green-600 text-sm"
                            icon="fad fa-check"
                        />
                    </v-col>
                    <v-col
                        v-if="match.p1.incomplete || match.p2.incomplete"
                        cols="2"
                    >
                        <v-chip
                            v-if="match.p1.incomplete"
                            class="bg-red-800 text-zinc-300 small"
                            density="compact"
                            rounded="sm"
                        >
                            {{ incomplete(match.p1.incomplete) }}
                        </v-chip>
                    </v-col>
                    <v-col
                        class="flex justify-evenly"
                        cols="2"
                    >
                        <div>{{ match.p1.s1 }}<sup>{{ match.p1.t1 }}</sup></div>
                        <div>{{ match.p1.s2 }}<sup>{{ match.p1.t2 }}</sup></div>
                        <div>{{ match.p1.s3 }}<sup>{{ match.p1.t3 }}</sup></div>
                        <div>{{ match.p1.s4 }}<sup>{{ match.p1.t4 }}</sup></div>
                        <div>{{ match.p1.s5 }}<sup>{{ match.p1.t5 }}</sup></div>
                    </v-col>
                </v-row>
                <v-row
                >
                    <v-col
                        class="flex items-center"
                    >
                        <div>
                            <flag-img
                                v-if="match.p2.player.country"
                                class="w-[2rem] mx-0.5"
                                :src="flag(match.p2.player.country.id)"
                                :alt="match.p2.player.country.name"
                            />
                        </div>
                        <div>
                            <v-avatar
                                class="mx-0.5"
                            >
                                <v-img
                                    :src="headshot(match.p2.player.id)"
                                    :alt="match.p2.player.full_name"
                                />
                            </v-avatar>
                        </div>
                        <div
                            class="mx-0.5"
                        >
                            <router-link
                                class="hover-link text-sm"
                                :to="{name: 'Player', params: {id: match.p2.player.id, name: encodeName(match.p2.player.full_name)}}"
                            >
                                {{ match.p2.player.full_name }}
                            </router-link>
                            <small
                                v-if="entry2?.properties.seed || entry2?.properties.status"
                            >
                                ({{ entry2?.properties.seed }}<span v-if="entry2?.properties.seed && entry2.properties.status"> </span>{{ entry2?.properties.status }})
                            </small>
                        </div>
                    </v-col>
                    <v-col
                        cols="1"
                    >
                        <v-icon
                            v-if="match.winner.player.id === match.p2.player.id"
                            class="text-green-600 text-sm"
                            icon="fad fa-check"
                        />
                    </v-col>
                    <v-col
                        v-if="match.p1.incomplete || match.p2.incomplete"
                        cols="2"
                    >
                        <v-chip
                            v-if="match.p2.incomplete"
                            class="bg-red-800 text-zinc-300 small"
                            density="compact"
                            rounded="sm"
                        >
                            {{ incomplete(match.p2.incomplete) }}
                        </v-chip>
                    </v-col>
                    <v-col
                        class="flex justify-evenly"
                        cols="2"
                    >
                        <div>{{ match.p2.s1 }}<sup>{{ match.p2.t1 }}</sup></div>
                        <div>{{ match.p2.s2 }}<sup>{{ match.p2.t2 }}</sup></div>
                        <div>{{ match.p2.s3 }}<sup>{{ match.p2.t3 }}</sup></div>
                        <div>{{ match.p2.s4 }}<sup>{{ match.p2.t4 }}</sup></div>
                        <div>{{ match.p2.s5 }}<sup>{{ match.p2.t5 }}</sup></div>
                    </v-col>
                </v-row>
            </v-container>
            <v-card-text>
                {{ match.umpire?.id }}
            </v-card-text>
        </v-card>
        <v-container
            class="text-zinc-300"
        >
            <v-row>
                <v-col
                    class="text-center"
                >
                    <v-avatar>
                        <v-img
                            :src="headshot(match.p1.player.id)"
                            :alt="match.p1.player.full_name"
                        />
                    </v-avatar>
                    <div
                        class="small mt-1 font-bold"
                    >
                        {{ match.p1.player.full_name }}
                    </div>
                </v-col>
                <v-col
                    class="font-bold flex items-center justify-center"
                >
                    SERVICE STATS
                </v-col>
                <v-col
                    class="text-center"
                >
                    <v-avatar>
                        <v-img
                            :src="headshot(match.p2.player.id)"
                            :alt="match.p2.player.full_name"
                        />
                    </v-avatar>
                    <div
                        class="small mt-1 font-bold"
                    >
                        {{ match.p2.player.full_name }}
                    </div>
                </v-col>
                <v-divider thickness="3" />
            </v-row>
            <StatItem
                v-if="match.p1.aces && match.p2.aces"
                :p1="match.p1.aces"
                :p2="match.p2.aces"
            >
                <template #metric>Aces</template>
            </StatItem>
            <StatItem
                v-if="match.p1.dfs && match.p2.dfs"
                :p1="match.p1.dfs"
                :p2="match.p2.dfs"
                low
            >
                <template #metric>Double faults</template>
            </StatItem>
            <DualStatItem
                v-if="match.p1.serve1_pts && match.p1.serve2_pts && match.p2.serve1_pts && match.p2.serve2_pts"
                :p1Value="match.p1.serve1_pts"
                :p1Total="match.p1.serve1_pts + match.p1.serve2_pts"
                :p2Value="match.p2.serve1_pts"
                :p2Total="match.p2.serve1_pts + match.p2.serve2_pts"
            >
                <template #metric>First serve</template>
            </DualStatItem>
            <DualStatItem
                v-if="match.p1.serve1_pts_w && match.p1.serve1_pts && match.p2.serve1_pts_w && match.p2.serve1_pts"
                :p1Value="match.p1.serve1_pts_w"
                :p1Total="match.p1.serve1_pts"
                :p2Value="match.p2.serve1_pts_w"
                :p2Total="match.p2.serve1_pts"
            >
                <template #metric>1st serve points won</template>
            </DualStatItem>
            <DualStatItem
                v-if="match.p1.serve2_pts_w && match.p1.serve2_pts && match.p2.serve2_pts_w && match.p2.serve2_pts"
                :p1Value="match.p1.serve2_pts_w"
                :p1Total="match.p1.serve2_pts"
                :p2Value="match.p2.serve2_pts_w"
                :p2Total="match.p2.serve2_pts"
            >
                <template #metric>2nd serve points won</template>
            </DualStatItem>
            <DualStatItem
                v-if="match.p1.bps_saved && match.p1.bps_faced && match.p2.bps_saved && match.p2.bps_faced"
                :p1Value="match.p1.bps_saved"
                :p1Total="match.p1.bps_faced"
                :p2Value="match.p2.bps_saved"
                :p2Total="match.p2.bps_faced"
            >
                <template #metric>Break points saved</template>
            </DualStatItem>
            <v-row>
                <v-col
                    class="text-center font-bold"
                >
                    RETURN STATS
                </v-col>
                <v-divider thickness="3" />
            </v-row>
            <DualStatItem
                v-if="match.p1.ret1_w && match.p1.ret1 && match.p2.ret1_w && match.p2.ret1"
                :p2Value="match.p2.ret1_w"
                :p2Total="match.p2.ret1"
                :p1Value="match.p1.ret1_w"
                :p1Total="match.p1.ret1"
            >
                <template #metric>1st serve return points won</template>
            </DualStatItem>
            <DualStatItem
                v-if="match.p1.ret2_w && match.p1.ret2 && match.p2.ret2_w && match.p2.ret2"
                :p1Value="match.p1.ret2_w"
                :p1Total="match.p1.ret2"
                :p2Value="match.p2.ret2_w"
                :p2Total="match.p2.ret2"
            >
                <template #metric>2nd serve return points won</template>
            </DualStatItem>
            <DualStatItem
                v-if="match.p1.bps_converted && match.p1.bp_opps && match.p2.bps_converted && match.p2.bp_opps"
                :p1Value="match.p1.bps_converted"
                :p1Total="match.p1.bp_opps"
                :p2Value="match.p2.bps_converted"
                :p2Total="match.p2.bp_opps"
            >
                <template #metric>Break points converted</template>
            </DualStatItem>
            <v-row>
                <v-col
                    class="text-center font-bold"
                >
                    POINT STATS
                </v-col>
                <v-divider thickness="3" />
            </v-row>
            <DualStatItem
                v-if="match.p1.net_w && match.p1.net && match.p2.net_w && match.p2.net"
                :p1Value="match.p1.net_w"
                :p1Total="match.p1.net"
                :p2Value="match.p2.net_w"
                :p2Total="match.p2.net"
            >
                <template #metric>Net points won</template>
            </DualStatItem>
            <StatItem
                v-if="match.p1.winners && match.p2.winners"
                :p1="match.p1.winners"
                :p2="match.p2.winners"
            >
                <template #metric>Winners</template>
            </StatItem>
            <StatItem
                v-if="match.p1.ues && match.p2.ues"
                :p1="match.p1.ues"
                :p2="match.p2.ues"
                low
            >
                <template #metric>Unforced errors</template>
            </StatItem>
            <DualStatItem
                v-if="match.p1.serve1_pts_w && match.p1.serve1_pts && match.p1.serve2_pts_w && match.p1.serve2_pts && match.p2.serve1_pts_w && match.p2.serve1_pts && match.p2.serve2_pts_w && match.p2.serve2_pts"
                :p1Value="match.p1.serve1_pts_w + match.p1.serve2_pts_w"
                :p1Total="match.p1.serve1_pts + match.p1.serve2_pts"
                :p2Value="match.p2.serve1_pts_w + match.p2.serve2_pts_w"
                :p2Total="match.p2.serve1_pts + match.p2.serve2_pts"
            >
                    <template #metric>Service points won</template>
                </DualStatItem>
            <DualStatItem
                v-if="match.p1.ret1_w && match.p1.ret1 && match.p1.ret2_w && match.p1.ret2 && match.p2.ret1_w && match.p2.ret1 && match.p2.ret2_w && match.p2.ret2"
                :p1Value="match.p1.ret1_w + match.p1.ret2_w"
                :p1Total="match.p1.ret1 + match.p1.ret2"
                :p2Value="match.p2.ret1_w + match.p2.ret2_w"
                :p2Total="match.p2.ret1 + match.p2.ret2"
            >
                <template #metric>Return points won</template>
            </DualStatItem>
            <StatItem
                v-if="match.p1.serve1_pts_w && match.p1.serve2_pts_w && match.p2.serve1_pts_w && match.p2.serve2_pts_w && match.p1.ret1_w && match.p1.ret2_w && match.p2.ret1_w && match.p2.ret2_w"
                :p1="match.p1.serve1_pts_w + match.p1.serve2_pts_w + match.p1.ret1_w + match.p1.ret2_w"
                :p2="match.p2.serve1_pts_w + match.p2.serve2_pts_w + match.p2.ret1_w + match.p2.ret2_w"
                percent
            >
                <template #metric>Total points won</template>
            </StatItem>
            <v-row>
                <v-col
                    v-if="match.p1.max_speed_kph"
                    class="text-center font-bold"
                >
                    SERVICE SPEED
                </v-col>
                <v-divider thickness="3" />
            </v-row>
            <ServiceStatItem
                v-if="match.p1.max_speed_kph && match.p2.max_speed_kph"
                :p1kph="match.p1.max_speed_kph"
                :p2kph="match.p2.max_speed_kph"
            >
                <template #metric>Max Speed</template>
            </ServiceStatItem>
            <ServiceStatItem
                v-if="match.p1.avg_sv1_kph && match.p2.avg_sv1_kph"
                :p1kph="match.p1.avg_sv1_kph"
                :p2kph="match.p2.avg_sv1_kph"
            >
                <template #metric>1st serve average speed</template>
            </ServiceStatItem>
            <ServiceStatItem
                v-if="match.p1.avg_sv2_kph && match.p2.avg_sv2_kph"
                :p1kph="match.p1.avg_sv2_kph"
                :p2kph="match.p2.avg_sv2_kph"
            >
                <template #metric>2nd serve average speed</template>
            </ServiceStatItem>
        </v-container>
    </v-sheet>
    <v-sheet
        v-else
        class="w-5/6 md:w-8/12 lg:w-1/2 mx-auto my-10 bg-transparent"
    >
        <div
            class="text-3xl text-zinc-300"
        >
            {{ unencodeName(name) }} {{ year }} {{ matchId }}
        </div>
        <div
            class="text-zinc-400 my-4"
        >
            No data available
        </div>
    </v-sheet>
</template>