<script setup lang="ts">
import type { ActivityEntry, ActivityMatch } from '@/utils/interfaces';
import { headshot, flag, encodeName, getTieBreak, incomplete } from '@/utils/functions';

const props = defineProps<{
    name: string,
    id: string,
    match: ActivityMatch,
    players: ActivityEntry[]
}>()

let entry: ActivityEntry | undefined

if (props.match.incomplete !== 'B') {
    entry = props.players.find(obj => obj.node.id === props.match.oppScore[0].player.id)
}
</script>

<template>
    <tr
        class="text-xs md:text-sm"
    >
        <td
            class="text-center"
        >
            {{ match.round }}
        </td>
        <td>
            <div
                v-if="match.incomplete === 'B'"
            >
                —
            </div>
            <v-row
                v-else-if="match.oppScore.length > 0"
            >
                <v-col
                    cols="2"
                >
                    <flag-img
                        v-if="match.oppScore[0].player.country"
                        :src="flag(match.oppScore[0].player.country.id)"
                        :alt="match.oppScore[0].player.country.name"
                    />
                </v-col>
                <v-col
                    cols="2"
                >
                    <v-avatar
                        size="small"
                    >
                        <v-img
                            :src="headshot(match.oppScore[0].player.id)"
                            :alt="match.oppScore[0].player.full_name"
                        />
                    </v-avatar>
                </v-col>
                <v-col
                    class="flex items-center"
                >
                    <router-link
                        class="hover-link"
                        :to="{name: 'Player', params: {id: match.oppScore[0].player.id, name: encodeName(match.oppScore[0].player.full_name)}}"
                    >
                        {{ match.oppScore[0].player.full_name }}
                    </router-link>
                    <span
                        v-if="entry?.properties.seed || entry?.properties.status"
                        class="text-xs text-zinc-300"
                    >
                        &nbsp;({{ entry.properties.seed }}{{ entry.properties.seed && entry.properties.status ? ' ' : '' }}{{ entry.properties.status }})
                    </span>
                </v-col>
            </v-row>
        </td>
        <td
            v-if="match.incomplete === 'B'"
            class="text-center"
        >
            —
        </td>
        <td
            v-else
            class="text-center"
        >
            {{ entry?.properties.rank }}
        </td>
        <td
            class="text-center"
        >
            <v-icon
                :class="match.winner.player.id === id ? 'text-green-600' : 'text-red-600'"
                :icon="match.winner.player.id === id ? 'fad fa-check' : 'fas fa-x'"
            />
        </td>
        <td
            class="flex items-center"
        >
            <div
                v-if="match.incomplete !== 'B' && match.incomplete !== 'WO'"
                class="flex"
            >
                <div
                    class="mx-0.5"
                >
                    {{ match.pScore[0].s1 }}{{ match.oppScore[0].s1 }}<sup v-if="match.pScore[0].t1 && match.oppScore[0].t1">{{ getTieBreak(match.pScore[0].t1, match.oppScore[0].t1) }}</sup>
                </div>
                <div
                    class="mx-0.5"
                >
                    {{ match.pScore[0].s2 }}{{ match.oppScore[0].s2 }}<sup v-if="match.pScore[0].t2 && match.oppScore[0].t2">{{ getTieBreak(match.pScore[0].t2, match.oppScore[0].t2) }}</sup>
                </div>
                <div
                    class="mx-0.5"
                >
                    {{ match.pScore[0].s3 }}{{ match.oppScore[0].s3 }}<sup v-if="match.pScore[0].t3 && match.oppScore[0].t3">{{ getTieBreak(match.pScore[0].t3, match.oppScore[0].t3) }}</sup>
                </div>
                <div
                    class="mx-0.5"
                >
                    {{ match.pScore[0].s4 }}{{ match.oppScore[0].s4 }}<sup v-if="match.pScore[0].t4 && match.oppScore[0].t4">{{ getTieBreak(match.pScore[0].t4, match.oppScore[0].t4) }}</sup>
                </div>
                <div
                    class="mx-0.5"
                >
                    {{ match.pScore[0].s5 }}{{ match.oppScore[0].s5 }}<sup v-if="match.pScore[0].t5 && match.oppScore[0].t5">{{ getTieBreak(match.pScore[0].t5, match.oppScore[0].t5) }}</sup>
                </div>
            </div>
            <div v-if="match.incomplete === 'B'">
                <v-chip
                    class="bg-green-800 small"
                    density="compact"
                    rounded="sm"
                >
                    {{ incomplete(match.incomplete) }}
                </v-chip>
            </div>
            <div v-else-if="match.oppScore[0].incomplete">
                <v-chip
                    class="bg-green-800 small"
                    density="compact"
                    rounded="sm"
                >
                    {{ incomplete(match.oppScore[0].incomplete) }}
                </v-chip>
            </div>
            <div v-else-if="match.pScore[0].incomplete">
                <v-chip
                    class="bg-red-800 small"
                    density="compact"
                    rounded="sm"
                >
                    {{ incomplete(match.pScore[0].incomplete) }}
                </v-chip>
            </div>
        </td>
        <td>
            <v-chip
                v-if="match.incomplete !== 'B'"
                class="bg-zinc-300 text-indigo-800"
                density="compact"
                :to="{name: 'H2H', params: {p1Name: encodeName(name), p1Id: id, p2Name: encodeName(match.oppScore[0].player.full_name), p2Id: match.oppScore[0].player.id}}"
            >
                H2H
            </v-chip>
        </td>
    </tr>
</template>