<script setup lang="ts">
import type { Match } from '@/utils/interfaces';
import { encodeName, getTieBreak, headshot } from '@/utils/functions';

const props = defineProps<{
    matches: Match[]
}>()

console.log(props.matches)
</script>

<template>
    <v-table class="bg-transparent">
        <thead class="text-zinc-300">
            <tr>
                <th class="text-center !font-bold">Year</th>
                <th class="text-center !font-bold">Winner</th>
                <th class="text-center !font-bold">Event</th>
                <th class="text-center !font-bold">Round</th>
                <th class="text-center !font-bold">Surface</th>
                <th class="text-center !font-bold">Score</th>
            </tr>
        </thead>
        <tbody class="text-zinc-300">
            <tr v-if="matches.length === 0">
                <td colspan="6" class="text-center">No matches played</td>
            </tr>
            <tr v-else v-for="match in matches" :key="match.match_no">
                <td class="text-center">
                    <router-link v-if="match.round.event?.tournament" class="hover-link"
                        :to="{ name: 'Event', params: { id: match.round.event.tournament.id, name: encodeName(match.round.event.tournament.name), year: match.round.event.year.id, eventId: match.round.event.id } }">{{
                            match.round.event.year.id }}</router-link>
                </td>
                <td v-if="match.winner?.player">
                    <v-avatar class="mx-1" size="small">
                        <v-img :src="headshot(match.winner.player.id)" :alt="match.winner.player.full_name" />
                    </v-avatar>
                    <router-link class="hover-link mx-1"
                        :to="{ name: 'Player', params: { id: match.winner.player.id, name: encodeName(match.winner.player.full_name) } }">{{
                            match.winner.player.full_name }}</router-link>
                </td>
                <td class="text-center">
                    <router-link v-if="match.round.event?.tournament" class="hover-link"
                        :to="{ name: 'Tournament', params: { name: encodeName(match.round.event.tournament.name), id: match.round.event.tournament.id } }">{{
                            match.round.event.tournament.name }}</router-link>
                </td>
                <td class="text-center">{{ match.round.round }}</td>
                <td class="text-center">{{ match.round.event?.surface?.environment }} {{
                    match.round.event?.surface?.surface }}</td>
                <td class="text-center whitespace-nowrap">
                    {{ match.winner?.s1 }}{{ match.loser?.s1 }}<sup v-if="match.winner?.t1 && match.loser?.t1">
                        {{ getTieBreak(match.winner.t1, match.loser.t1) }}
                    </sup>
                    {{ match.winner?.s2 }}{{ match.loser?.s2 }}<sup v-if="match.winner?.t2 && match.loser?.t2">
                        {{ getTieBreak(match.winner.t2, match.loser.t2) }}
                    </sup>
                    {{ match.winner?.s3 }}{{ match.loser?.s3 }}<sup v-if="match.winner?.t3 && match.loser?.t3">
                        {{ getTieBreak(match.winner.t3, match.loser.t3) }}
                    </sup>
                    {{ match.winner?.s4 }}{{ match.loser?.s4 }}<sup v-if="match.winner?.t4 && match.loser?.t4">
                        {{ getTieBreak(match.winner.t4, match.loser.t4) }}
                    </sup>
                    {{ match.winner?.s5 }}{{ match.loser?.s5 }}<sup v-if="match.winner?.t5 && match.loser?.t5">
                        {{ getTieBreak(match.winner.t5, match.loser.t5) }}
                    </sup>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>