<script setup lang="ts">
import * as func from '@/utils/functions'
import type { EntryInfo, Match } from '@/utils/interfaces';

const props = defineProps<{
    entryInfo: { node: { id: string }; properties: EntryInfo; }[]
    match: Match
    name: string
    tournamentId: number
    year: number
    eventId: number
}>()

const p1Entry = props.entryInfo.find(obj => obj.node.id === props.match.p1?.player?.id)
const p2Entry = props.entryInfo.find(obj => obj.node.id === props.match.p2?.player?.id)
</script>

<template>
    <v-card class="bg-indigo-800 my-3 text-zinc-300 text-sm" variant="text" rounded="xl">
        <v-container>
            <v-row>
                <v-col v-if="match.p1?.player" class="flex items-center"
                    :cols="match.p1?.incomplete || match.p2?.incomplete ? 6 : 8">
                    <div class="mx-0.5">
                        <flag-img v-if="match.p1.player.country" class="w-[2rem]"
                            :src="func.flag(match.p1.player.country.id)" :alt="match.p1.player.country.name" />
                    </div>
                    <div class="mx-0.5">
                        <v-avatar size="small">
                            <v-img :src="func.headshot(match.p1.player.id)" :alt="match.p1.player.full_name" />
                        </v-avatar>
                    </div>
                    <div class="mx-0.5">
                        <router-link class="hover-link"
                            :to="{ name: 'Player', params: { id: match.p1.player.id, name: func.encodeName(match.p1.player.full_name) } }">
                            {{ match.p1.player.full_name }}
                        </router-link>
                        <small v-if="p1Entry?.properties.seed || p1Entry?.properties.status">
                            ({{ p1Entry.properties.seed }}{{ p1Entry.properties.status }})
                        </small>
                    </div>
                </v-col>
                <v-col v-else-if="match.p2" class="ml-10 flex items-center">
                    <div>
                        <v-avatar size="small">
                            <v-img :src="func.headshot('aaa')" alt="Bye" />
                        </v-avatar>
                    </div>
                    <div class="mx-1">
                        BYE
                    </div>
                </v-col>
                <v-col v-else class="ml-10">
                    Player 1
                </v-col>
                <v-col class="flex items-center" cols="1">
                    <v-icon v-if="match.winner?.player?.id === match.p1?.player?.id" class="text-green-500 text-[12px]"
                        icon="fad fa-check" />
                </v-col>
                <v-col v-if="match.p1?.incomplete || match.p2?.incomplete" cols="2">
                    <v-chip v-if="match.p1?.incomplete" class="!bg-red-800 !text-[10px]" density="compact" rounded="sm">
                        {{ match.p1.incomplete }}.
                    </v-chip>
                </v-col>
                <v-col class="flex justify-evenly items-center" cols="3">
                    <div>{{ match.p1?.s1 }}<sup>{{ match.p1?.t1 }}</sup></div>
                    <div>{{ match.p1?.s2 }}<sup>{{ match.p1?.t2 }}</sup></div>
                    <div>{{ match.p1?.s3 }}<sup>{{ match.p1?.t3 }}</sup></div>
                    <div>{{ match.p1?.s4 }}<sup>{{ match.p1?.t4 }}</sup></div>
                    <div>{{ match.p1?.s5 }}<sup>{{ match.p1?.t5 }}</sup></div>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-if="match.p2?.player" class="flex items-center"
                    :cols="match.p1?.incomplete || match.p2?.incomplete ? 6 : 8">
                    <div class="mx-0.5">
                        <flag-img v-if="match.p2.player.country" class="w-[2rem]"
                            :src="func.flag(match.p2.player.country.id)" :alt="match.p2.player.country.name" />
                    </div>
                    <div class="mx-0.5">
                        <v-avatar size="small">
                            <v-img :src="func.headshot(match.p2.player.id)" :alt="match.p2.player.full_name" />
                        </v-avatar>
                    </div>
                    <div class="mx-0.5">
                        <router-link class="hover-link"
                            :to="{ name: 'Player', params: { id: match.p2.player.id, name: func.encodeName(match.p2.player.full_name) } }">
                            {{ match.p2.player.full_name }}
                        </router-link>
                        <small v-if="p2Entry?.properties.seed || p2Entry?.properties.status">
                            ({{ p2Entry.properties.seed }}{{ p2Entry.properties.status }})
                        </small>
                    </div>
                </v-col>
                <v-col v-else-if="match.p1" class="ml-10 flex items-center">
                    <div>
                        <v-avatar size="small">
                            <v-img :src="func.headshot('aaa')" alt="Bye" />
                        </v-avatar>
                    </div>
                    <div class="mx-1">
                        BYE
                    </div>
                </v-col>
                <v-col v-else class="ml-10">
                    Player 2
                </v-col>
                <v-col class="flex items-center" cols="1">
                    <v-icon v-if="match.winner?.player?.id === match.p2?.player?.id" class="text-green-500 text-[12px]"
                        icon="fad fa-check" />
                </v-col>
                <v-col v-if="match.p1?.incomplete || match.p2?.incomplete" cols="2">
                    <v-chip v-if="match.p2?.incomplete" class="!bg-red-800 !text-[10px]" density="compact" rounded="sm">
                        {{ match.p2.incomplete }}.
                    </v-chip>
                </v-col>
                <v-col class="flex justify-evenly items-center" cols="3">
                    <div>{{ match.p2?.s1 }}<sup>{{ match.p2?.t1 }}</sup></div>
                    <div>{{ match.p2?.s2 }}<sup>{{ match.p2?.t2 }}</sup></div>
                    <div>{{ match.p2?.s3 }}<sup>{{ match.p2?.t3 }}</sup></div>
                    <div>{{ match.p2?.s4 }}<sup>{{ match.p2?.t4 }}</sup></div>
                    <div>{{ match.p2?.s5 }}<sup>{{ match.p2?.t5 }}</sup></div>
                </v-col>
            </v-row>
        </v-container>
        <v-card-actions class="flex justify-end">
            <v-chip v-if="match.p1?.player && match.p2?.player" class="mx-1" size="small"
                :to="{ name: 'H2H', params: { p1Id: match.p1.player.id, p1Name: func.encodeName(match.p1.player.full_name), p2Id: match.p2.player.id, p2Name: func.encodeName(match.p2.player.full_name) } }">
                H2H
            </v-chip>
            <v-chip v-if="!match.incomplete"
                :to="{ name: 'MatchStats', params: { name: name, id: tournamentId, year: year, eventId: eventId, matchId: match.match_no } }"
                size="small">
                Stats
            </v-chip>
        </v-card-actions>
    </v-card>
</template>