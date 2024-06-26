<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { headshot, flagSrc, encodeName, getTieBreak, round } from '../utils';
import type { ActivityMatch } from '../interfaces';

const props = defineProps<{
    match: ActivityMatch,
    playerId: string,
    playerName: string
}>()

const { lgAndUp } = useDisplay()
</script>

<template>
    <tr class="text-xs md:text-sm">
        <td class="text-center">{{ round(match.round) }}</td>
        <td class="text-nowrap">
            <div v-if="match.incomplete">BYE</div>
            <div
                v-else
                class="flex items-center"
            >
                <div class="mx-0.5">
                    <flag-img
                        v-if="match.opp_countryCode"
                        class="w-[2rem]"
                        :src="flagSrc(match.opp_countryCode)"
                        :alt="match.opp_countryName"
                    />
                </div>
                <div class="mx-0.5">
                    <v-avatar :size="lgAndUp ? 'default' : 'small'">
                        <v-img
                            v-if="match.opp_id"
                            :src="headshot(match.opp_id)"
                            :alt="`${match.opp_first_name} ${match.opp_last_name}`"
                        />
                    </v-avatar>
                </div>
                <div class="mx-0.5">
                    <router-link
                        v-if="match.opp_first_name"
                        class="hover-link"
                        :to="{name: 'Player', params: {id: match.opp_id, name: `${match.opp_first_name}_${match.opp_last_name}`}}"
                    >
                        {{ match.opp_first_name }} {{ match.opp_last_name }}
                    </router-link>
                </div>
            </div>
        </td>
        <td>
            <v-icon
                :class="match.winner_id === playerId ? 'text-green-600' : 'text-red-600'"
                :icon="match.winner_id === playerId ? 'fad fa-check' : 'fas fa-x'"
            />
        </td>
        <td class="flex items-center">
            <div v-if="match.p_scores.incomplete === 'WO' || match.opp_scores.incomplete === 'WO'">WO</div>
            <div
                v-else
                class="flex"
            >
                <div>
                    {{ match.p_scores.s1 }}{{ match.opp_scores.s1 }}
                    <sup v-if="match.p_scores.t1 && match.opp_scores.t1">{{ getTieBreak(match.p_scores.t1, match.opp_scores.t1) }}</sup>
                </div>&nbsp;
                <div>
                    {{ match.p_scores.s2 }}{{ match.opp_scores.s2 }}
                    <sup v-if="match.p_scores.t2 && match.opp_scores.t2">{{ getTieBreak(match.p_scores.t2, match.opp_scores.t2) }}</sup>
                </div>&nbsp;
                <div>
                    {{ match.p_scores.s3 }}{{ match.opp_scores.s3 }}
                    <sup v-if="match.p_scores.t3 && match.opp_scores.t3">{{ getTieBreak(match.p_scores.t3, match.opp_scores.t3) }}</sup>
                </div>&nbsp;
                <div>
                    {{ match.p_scores.s4 }}{{ match.opp_scores.s4 }}
                    <sup v-if="match.p_scores.t4 && match.opp_scores.t4">{{ getTieBreak(match.p_scores.t4, match.opp_scores.t4) }}</sup>
                </div>&nbsp;
                <div>
                    {{ match.p_scores.s5 }}{{ match.opp_scores.s5 }}
                    <sup v-if="match.p_scores.t5 && match.opp_scores.t5">{{ getTieBreak(match.p_scores.t5, match.opp_scores.t5) }}</sup>
                </div>&nbsp;
            </div>
            <div v-if="match.p_scores.incomplete || match.opp_scores.incomplete">{{ match.p_scores.incomplete ?? match.opp_scores.incomplete }}</div>
        </td>
        <td>
            <v-chip
                v-if="!match.incomplete"
                class="bg-zinc-300 text-indigo-800"
                :to="{name: 'H2H', params: {p1Name: encodeName(playerName), p1Id: playerId, p2Name: `${match.opp_first_name}_${match.opp_last_name}`, p2Id: match.opp_id}}"
                density="compact"
            >
                H2H
            </v-chip>
        </td>
    </tr>
</template>