<script setup lang="ts">
import type { EntryInfo, Match } from '@/utils/interfaces';
import { headshot, flag, encodeName, getTieBreak, incomplete } from '@/utils/functions';

const props = defineProps<{
    name: string,
    id: string,
    round: {
        round: string;
        matches: Match[]
    },
    players: {
        edges: {
            node: {
                id: string;
            };
            properties: EntryInfo;
        }
    }[]
}>()

let entry: {
    node: {
        id: string;
    };
    properties: EntryInfo;
} | undefined

if (props.round.matches[0].incomplete !== 'B') {
    // @ts-ignore
    entry = props.players.find(obj => obj.node.id === props.round.matches[0].oppScore[0].player.id)
}
</script>

<template>
    <tr class="text-xs md:text-sm">
        <td class="text-center">
            {{ round.round }}
        </td>
        <td>
            <div v-if="round.matches[0].incomplete === 'B'">
                —
            </div>
            <v-row v-else-if="round.matches[0].oppScore.length > 0">
                <v-col cols="2">
                    <flag-img v-if="round.matches[0].oppScore[0].player?.country"
                        :src="flag(round.matches[0].oppScore[0].player.country.id)"
                        :alt="round.matches[0].oppScore[0].player.country.name" />
                </v-col>
                <v-col cols="2">
                    <v-avatar size="small">
                        <v-img v-if="round.matches[0].oppScore[0].player"
                            :src="headshot(round.matches[0].oppScore[0].player.id)"
                            :alt="round.matches[0].oppScore[0].player.full_name" />
                    </v-avatar>
                </v-col>
                <v-col class="flex items-center">
                    <router-link v-if="round.matches[0].oppScore[0].player" class="hover-link"
                        :to="{ name: 'Player', params: { id: round.matches[0].oppScore[0].player.id, name: encodeName(round.matches[0].oppScore[0].player.full_name) } }">
                        {{ round.matches[0].oppScore[0].player.full_name }}
                    </router-link>
                    <span v-if="entry?.properties.seed || entry?.properties.status" class="text-xs text-zinc-300">
                        &nbsp;({{ entry.properties.seed }}{{ entry.properties.seed && entry.properties.status ? ' ' : ''
                        }}{{ entry.properties.status }})
                    </span>
                </v-col>
            </v-row>
        </td>
        <td v-if="round.matches[0].incomplete === 'B'" class="text-center">
            —
        </td>
        <td v-else class="text-center">
            {{ entry?.properties.rank }}
        </td>
        <td class="text-center" v-if="round.matches[0].winner?.player">
            <v-icon :class="round.matches[0].winner?.player.id === id ? 'text-green-600' : 'text-red-600'"
                :icon="round.matches[0].winner?.player.id === id ? 'fad fa-check' : 'fas fa-x'" />
        </td>
        <td>
            <div v-if="!round.matches[0].incomplete" class="flex">
                <div class="mx-0.5" v-if="round.matches[0].pScore">{{ round.matches[0].pScore[0].s1 }}{{
                    round.matches[0].oppScore[0].s1 }}<sup
                        v-if="round.matches[0].pScore[0].t1 && round.matches[0].oppScore[0].t1">{{
                            getTieBreak(round.matches[0].pScore[0].t1, round.matches[0].oppScore[0].t1) }}</sup>
                </div>
                <div class="mx-0.5" v-if="round.matches[0].pScore">{{ round.matches[0].pScore[0].s2 }}{{
                    round.matches[0].oppScore[0].s2 }}<sup
                        v-if="round.matches[0].pScore[0].t2 && round.matches[0].oppScore[0].t2">{{
                            getTieBreak(round.matches[0].pScore[0].t2, round.matches[0].oppScore[0].t2) }}</sup>
                </div>
                <div class="mx-0.5" v-if="round.matches[0].pScore">{{ round.matches[0].pScore[0].s3 }}{{
                    round.matches[0].oppScore[0].s3 }}<sup
                        v-if="round.matches[0].pScore[0].t3 && round.matches[0].oppScore[0].t3">{{
                            getTieBreak(round.matches[0].pScore[0].t3, round.matches[0].oppScore[0].t3) }}</sup>
                </div>
                <div class="mx-0.5" v-if="round.matches[0].pScore">{{ round.matches[0].pScore[0].s4 }}{{
                    round.matches[0].oppScore[0].s4 }}<sup
                        v-if="round.matches[0].pScore[0].t4 && round.matches[0].oppScore[0].t4">{{
                            getTieBreak(round.matches[0].pScore[0].t4, round.matches[0].oppScore[0].t4) }}</sup>
                </div>
                <div class="mx-0.5" v-if="round.matches[0].pScore">{{ round.matches[0].pScore[0].s5 }}{{
                    round.matches[0].oppScore[0].s5 }}<sup
                        v-if="round.matches[0].pScore[0].t5 && round.matches[0].oppScore[0].t5">{{
                            getTieBreak(round.matches[0].pScore[0].t5, round.matches[0].oppScore[0].t5) }}</sup>
                </div>
            </div>
            <div v-if="round.matches[0].incomplete === 'B'">
                <v-chip class="bg-green-800 small" density="compact" rounded="sm">{{
                    incomplete(round.matches[0].incomplete) }}</v-chip>
            </div>
            <div v-else-if="round.matches[0].oppScore[0].incomplete">
                <v-chip class="bg-green-800 small" density="compact" rounded="sm">{{
                    incomplete(round.matches[0].oppScore[0].incomplete) }}</v-chip>
            </div>
            <div v-else-if="round.matches[0].pScore && round.matches[0].pScore[0].incomplete">
                <v-chip class="bg-red-800 small" density="compact" rounded="sm">{{
                    incomplete(round.matches[0].pScore[0].incomplete) }}</v-chip>
            </div>
        </td>
        <td>
            <v-chip v-if="round.matches[0].incomplete !== 'B' && round.matches[0].oppScore[0].player"
                class="bg-zinc-300 text-indigo-800" density="compact"
                :to="{ name: 'H2H', params: { p1Name: encodeName(name), p1Id: id, p2Name: encodeName(round.matches[0].oppScore[0].player.full_name), p2Id: round.matches[0].oppScore[0].player.id } }">
                H2H
            </v-chip>
        </td>

    </tr>
</template>