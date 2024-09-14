<script setup lang="ts">
import type { Match, EntryInfo } from '@/utils/interfaces';
import { formatTime, incomplete, encodeName, flag, headshot } from '@/utils/functions';

const props = defineProps<{
    match: Match
    entry1: EntryInfo
    entry2: EntryInfo
}>()
</script>

<template>
    <v-card class="text-zinc-300 my-10 p-1 bg-indigo-800" variant="text" rounded="xl">
        <v-card-text class="flex justify-between">
            <div>
                <span>{{ match.round.round }}</span>
                <span v-if="match.court"> — {{ match.court }}</span>
            </div>
            <div v-if="match.duration_mins">{{ formatTime(match.duration_mins) }}</div>
        </v-card-text>
        <v-container>
            <v-row>
                <v-col v-if="match.p1?.player" class="flex items-center">
                    <div>
                        <flag-img v-if="match.p1.player.country" class="w-[2rem] mx-0.5"
                            :src="flag(match.p1.player.country.id)" :alt="match.p1.player.country.name" />
                    </div>
                    <div>
                        <v-avatar class="mx-0.5">
                            <v-img :src="headshot(match.p1.player.id)" :alt="match.p1.player.full_name" />
                        </v-avatar>
                    </div>
                    <div class="mx-0.5">
                        <router-link class="hover-link text-sm"
                            :to="{ name: 'Player', params: { id: match.p1.player.id, name: encodeName(match.p1.player.full_name) } }">
                            {{ match.p1.player.full_name }}
                        </router-link>
                        <small v-if="entry1.seed || entry1.status">
                            ({{ entry1.seed }}<span v-if="entry1.seed && entry1.status"> </span>{{ entry1.status }})
                        </small>
                    </div>
                </v-col>
                <v-col cols="1">
                    <v-icon v-if="match.winner?.player?.id === match.p1?.player?.id" class="text-green-600 text-sm"
                        icon="fad fa-check" />
                </v-col>
                <v-col v-if="match.p1?.incomplete || match.p2?.incomplete" cols="2">
                    <v-chip v-if="match.p1?.incomplete" class="bg-red-800 text-zinc-300 small" density="compact"
                        rounded="sm">
                        {{ incomplete(match.p1.incomplete) }}
                    </v-chip>
                </v-col>
                <v-col class="flex justify-evenly" cols="2">
                    <div>{{ match.p1?.s1 }}<sup>{{ match.p1?.t1 }}</sup></div>
                    <div>{{ match.p1?.s2 }}<sup>{{ match.p1?.t2 }}</sup></div>
                    <div>{{ match.p1?.s3 }}<sup>{{ match.p1?.t3 }}</sup></div>
                    <div>{{ match.p1?.s4 }}<sup>{{ match.p1?.t4 }}</sup></div>
                    <div>{{ match.p1?.s5 }}<sup>{{ match.p1?.t5 }}</sup></div>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-if=match.p2?.player class="flex items-center">
                    <div>
                        <flag-img v-if="match.p2.player.country" class="w-[2rem] mx-0.5"
                            :src="flag(match.p2.player.country.id)" :alt="match.p2.player.country.name" />
                    </div>
                    <div>
                        <v-avatar class="mx-0.5">
                            <v-img :src="headshot(match.p2.player.id)" :alt="match.p2.player.full_name" />
                        </v-avatar>
                    </div>
                    <div class="mx-0.5">
                        <router-link class="hover-link text-sm"
                            :to="{ name: 'Player', params: { id: match.p2.player.id, name: encodeName(match.p2.player.full_name) } }">
                            {{ match.p2.player.full_name }}
                        </router-link>
                        <small v-if="entry2.seed || entry2.status">
                            ({{ entry2.seed }}<span v-if="entry2.seed && entry2.status"> </span>{{ entry2.status }})
                        </small>
                    </div>
                </v-col>
                <v-col cols="1">
                    <v-icon v-if="match.winner?.player?.id === match.p2?.player?.id" class="text-green-600 text-sm"
                        icon="fad fa-check" />
                </v-col>
                <v-col v-if="match.p1?.incomplete || match.p2?.incomplete" cols="2">
                    <v-chip v-if="match.p2?.incomplete" class="bg-red-800 text-zinc-300 small" density="compact"
                        rounded="sm">
                        {{ incomplete(match.p2.incomplete) }}
                    </v-chip>
                </v-col>
                <v-col class="flex justify-evenly" cols="2">
                    <div>{{ match.p2?.s1 }}<sup>{{ match.p2?.t1 }}</sup></div>
                    <div>{{ match.p2?.s2 }}<sup>{{ match.p2?.t2 }}</sup></div>
                    <div>{{ match.p2?.s3 }}<sup>{{ match.p2?.t3 }}</sup></div>
                    <div>{{ match.p2?.s4 }}<sup>{{ match.p2?.t4 }}</sup></div>
                    <div>{{ match.p2?.s5 }}<sup>{{ match.p2?.t5 }}</sup></div>
                </v-col>
            </v-row>
        </v-container>
        <v-card-text class="flex justify-between">
            <div>{{ match.umpire?.id }}</div>
            <div>
                <v-chip v-if="match.p1?.player && match.p2?.player" class="bg-zinc-300 text-indigo-800"
                    density="compact"
                    :to="{ name: 'H2H', params: { p1Name: encodeName(match.p1?.player?.full_name), p1Id: match.p1?.player?.id, p2Name: encodeName(match.p2.player.full_name), p2Id: match.p2.player.id } }">H2H</v-chip>
            </div>
        </v-card-text>
    </v-card>
</template>