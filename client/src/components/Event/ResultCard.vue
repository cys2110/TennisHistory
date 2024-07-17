<script setup lang="ts">
import { useDisplay } from 'vuetify';
import type { ActivityEntry, MatchByWinner } from '@/utils/interfaces';
import * as func from '@/utils/functions'

const { xl } = useDisplay()

const props = defineProps<{
    match: MatchByWinner
    entryInfo: ActivityEntry[]
}>()

const winnerEntry = props.entryInfo.find(obj => obj.node.id === props.match.winner.player.id)
const loserEntry = props.entryInfo.find(obj => obj.node.id === props.match.loser?.player.id)
</script>

<template>
    <v-card
        class="my-5 mx-2 p-1 text-zinc-300 text-xs sm:w-1/2 lg:w-2/5 bg-indigo-800"
        variant="text"
        rounded="xl"
    >
        <v-card-text
            class="flex justify-between text-xs"
        >
            <div
                class="flex"
            >
                <div
                    v-if="match.date"
                >
                    {{ func.formatDate(match.date) }}
                </div>
                <div
                    v-if="match.date && match.court"
                >
                    &nbsp;—&nbsp;
                </div>
                <div
                >
                    {{ match.court ?? '' }}
                </div>
            </div>
            <div
                v-if="match.duration_mins"
            >
                {{ func.formatTime(match.duration_mins) }}
            </div>
        </v-card-text>
        <v-container>
            <v-row>
                <v-col
                    class="flex items-center"
                    :cols="match.loser?.incomplete ? 5 : 8"
                >
                    <div
                        class="mx-0.5"
                    >
                        <flag-img
                            v-if="match.winner.player.country"
                            class="w-[1rem] lg:w-[2rem]"
                            :src="func.flag(match.winner.player.country.id)"
                            :alt="match.winner.player.country.name"
                        />
                    </div>
                    <div
                        class="mx-0.5"
                    >
                        <v-avatar
                            size="small"
                        >
                            <v-img
                                :src="func.headshot(match.winner.player.id)"
                                :alt="match.winner.player.full_name"
                            />
                        </v-avatar>
                    </div>
                    <div
                        class="mx-0.5"
                    >
                        <router-link
                            class="hover-link"
                            :to="{name: 'Player', params: {name: func.encodeName(match.winner.player.id), id: match.winner.player.id}}"
                        >
                            {{ match.winner.player.full_name }}
                        </router-link>
                        <small
                            v-if="winnerEntry?.properties.seed || winnerEntry?.properties.status"
                        >
                            ({{ winnerEntry.properties.seed }}{{ winnerEntry.properties.status }})
                        </small>
                    </div>
                </v-col>
                <v-col
                    cols="1"
                >
                    <v-icon
                        class="text-green-500 text-xs mt-2"
                        icon="fad fa-check"
                    />
                </v-col>
                <v-col
                    v-if="match.loser?.incomplete"
                    cols="2"
                />
                <v-col
                    class="flex justify-evenly items-center"
                    cols="3"
                >
                    <div>{{ match.winner.s1 }}<sup>{{ match.winner.t1 }}</sup></div>
                    <div>{{ match.winner.s2 }}<sup>{{ match.winner.t2 }}</sup></div>
                    <div>{{ match.winner.s3 }}<sup>{{ match.winner.t3 }}</sup></div>
                    <div>{{ match.winner.s4 }}<sup>{{ match.winner.t4 }}</sup></div>
                    <div>{{ match.winner.s5 }}<sup>{{ match.winner.t5 }}</sup></div>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    v-if="match.loser"
                    class="flex items-center"
                    :cols="match.loser?.incomplete ? 5 : 8"
                >
                    <div>
                        <flag-img
                            v-if="match.loser.player.country"
                            class="w-[1rem] lg:w-[2rem]"
                            :src="func.flag(match.loser.player.country.id)"
                            :alt="match.loser.player.country.name"
                        />
                    </div>
                    <div
                        class="mx-0.5"
                    >
                        <v-avatar
                            size="small"
                        >
                            <v-img
                                :src="func.headshot(match.loser.player.id)"
                                :alt="match.loser.player.full_name"
                            />
                        </v-avatar>
                    </div>
                    <div
                        class="mx-0.5"
                    >
                        <router-link
                            class="hover-link"
                            :to="{name: 'Player', params: {name: func.encodeName(match.loser.player.id), id: match.loser.player.id}}"
                        >
                            {{ match.loser.player.full_name }}
                        </router-link>
                        <small
                            v-if="loserEntry?.properties.seed || loserEntry?.properties.status"
                        >
                            ({{ loserEntry.properties.seed }}{{ loserEntry.properties.status }})
                        </small>
                    </div>
                </v-col>
                <v-col
                    v-else
                    class="flex items-center ml-16"
                    cols="8"
                >
                    BYE
                </v-col>
                <v-col
                    cols="1"
                />
                <v-col
                    v-if="match.loser?.incomplete"
                    cols="2"
                >
                    <v-chip
                        class="!bg-red-800 !text-[10px]"
                        density="compact"
                        rounded="sm"
                    >
                        {{ match.loser.incomplete }}.
                    </v-chip>
                </v-col>
                <v-col
                    class="flex justify-evenly items-center"
                    cols="3"
                >
                    <div>{{ match.loser?.s1 }}<sup>{{ match.loser?.t1 }}</sup></div>
                    <div>{{ match.loser?.s2 }}<sup>{{ match.loser?.t2 }}</sup></div>
                    <div>{{ match.loser?.s3 }}<sup>{{ match.loser?.t3 }}</sup></div>
                    <div>{{ match.loser?.s4 }}<sup>{{ match.loser?.t4 }}</sup></div>
                    <div>{{ match.loser?.s5 }}<sup>{{ match.loser?.t5 }}</sup></div>
                </v-col>
            </v-row>
        </v-container>
        <v-card-actions
            v-if="match.loser"
            class="flex justify-between"
        >
            <div
                class="ml-2"
            >
                {{ match.umpire?.id ?? '' }}
            </div>
            <div>
                <v-chip
                    class="mx-1"
                    :to="{name: 'H2H', params: {p1Name: func.encodeName(match.winner.player.full_name), p1Id: match.winner.player.id, p2Name: func.encodeName(match.loser.player.full_name), p2Id: match.loser.player.id}}"
                    :size="xl ? 'small' : 'x-small'"
                >
                    H2H
                </v-chip>
                <v-chip
                    v-if="match.loser.incomplete !== 'WO'"
                    class="mx-1"
                    :to="{name: 'MatchStats', params: {matchId: match.match_no}}"
                    :size="xl ? 'small' : 'x-small'"
                >
                    Stats
                </v-chip>
            </div>
        </v-card-actions>
    </v-card>
</template>