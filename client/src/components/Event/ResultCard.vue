<script setup lang="ts">
import { useDisplay } from 'vuetify';
import type { ActivityEntry, MatchDetail } from '@/utils/interfaces';
import * as func from '@/utils/functions'
import PlayerRow from '@/components/Event/PlayerRow.vue';

const { xl } = useDisplay()

const props = defineProps<{
    match: MatchDetail
    entryInfo: ActivityEntry[]
}>()

const winnerEntry = props.entryInfo.find(obj => obj.node.id === props.match.winner?.player.id)
const loserEntry = props.entryInfo.find(obj => obj.node.id === props.match.loser?.player.id)
</script>

<template>
    <v-card class="my-5 mx-2 p-1 text-zinc-300 text-xs sm:w-1/2 lg:w-2/5 bg-indigo-800" variant="text" rounded="xl">
        <v-card-text class="flex justify-between text-xs">
            <div class="flex">
                <div v-if="match.date">{{ func.formatDate(match.date) }}</div>
                <div v-if="match.date && match.court">&nbsp;—&nbsp;</div>
                <div>{{ match.court ?? '' }}</div>
            </div>
            <div v-if="match.duration_mins">{{ func.formatTime(match.duration_mins) }}</div>
        </v-card-text>
        <v-container>
            <v-row>
                <v-col class="flex items-center" cols="7">
                    <PlayerRow v-if="match.winner" :player="match.winner.player">
                        <template #status>
                            <small v-if="winnerEntry?.properties.seed || winnerEntry?.properties.status">
                                ({{ winnerEntry.properties.seed }}{{ winnerEntry.properties.status }})
                            </small>
                        </template>
                    </PlayerRow>
                </v-col>
                <v-col cols="2">
                    <v-icon class="text-green-500 text-xs mt-2" icon="fad fa-check" />
                </v-col>
                <v-col class="flex justify-evenly items-center" cols="2">
                    <div v-if="match.winner?.s1">{{ match.winner.s1 }}<sup>{{ match.winner?.t1 }}</sup></div>
                    <div v-if="match.winner?.s2">{{ match.winner.s2 }}<sup>{{ match.winner?.t2 }}</sup></div>
                    <div v-if="match.winner?.s3">{{ match.winner.s3 }}<sup>{{ match.winner?.t3 }}</sup></div>
                    <div v-if="match.winner?.s4">{{ match.winner.s4 }}<sup>{{ match.winner?.t4 }}</sup></div>
                    <div v-if="match.winner?.s5">{{ match.winner.s5 }}<sup>{{ match.winner?.t5 }}</sup></div>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-if="match.loser" class="flex items-center" cols="7">
                    <PlayerRow v-if="match.loser" :player="match.loser.player">
                        <template #status>
                            <small v-if="loserEntry?.properties.seed || loserEntry?.properties.status">
                                ({{ loserEntry.properties.seed }}{{ loserEntry.properties.status }})
                            </small>
                        </template>
                    </PlayerRow>
                </v-col>
                <v-col v-else class="flex items-center ml-16" cols="8">
                    BYE
                </v-col>
                <v-col cols="2">
                    <v-chip v-if="match.loser?.incomplete" class="!bg-red-800 !text-[10px]" density="compact"
                        rounded="sm">
                        {{ match.loser.incomplete }}.
                    </v-chip>
                </v-col>
                <v-col class="flex justify-evenly items-center" cols="2">
                    <div v-if="match.loser?.s1">{{ match.loser?.s1 }}<sup>{{ match.loser?.t1 }}</sup></div>
                    <div v-if="match.loser?.s2">{{ match.loser?.s2 }}<sup>{{ match.loser?.t2 }}</sup></div>
                    <div v-if="match.loser?.s3">{{ match.loser?.s3 }}<sup>{{ match.loser?.t3 }}</sup></div>
                    <div v-if="match.loser?.s4">{{ match.loser.s4 }}<sup>{{ match.loser?.t4 }}</sup></div>
                    <div v-if="match.loser?.s5">{{ match.loser.s5 }}<sup>{{ match.loser?.t5 }}</sup></div>
                </v-col>
            </v-row>
        </v-container>
        <v-card-actions v-if="match.winner && match.loser" class="flex justify-between">
            <div class="ml-2">{{ match.umpire?.id ?? '' }}</div>
            <div>
                <v-chip class="mx-1"
                    :to="{ name: 'H2H', params: { p1Name: func.encodeName(match.winner.player.full_name), p1Id: match.winner.player.id, p2Name: func.encodeName(match.loser.player.full_name), p2Id: match.loser.player.id } }"
                    :size="xl ? 'small' : 'x-small'">
                    H2H
                </v-chip>
                <v-chip v-if="match.loser.incomplete !== 'WO'" class="mx-1"
                    :to="{ name: 'MatchStats', params: { matchId: match.match_no } }" :size="xl ? 'small' : 'x-small'">
                    Stats
                </v-chip>
            </div>
        </v-card-actions>
    </v-card>
</template>