<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { headshot, flagSrc, encodeName, getMatchScore, getTieBreak } from '../utils';
import type { EntriesMatch } from '../interfaces';

const props = defineProps<{
    match: EntriesMatch,
    playerId: string
}>()

const { lgAndUp } = useDisplay()

const round = (roundNumber: string) => {
    return isNaN(parseInt(roundNumber)) ? roundNumber : `R${roundNumber}`
}

const opponentId = computed(() => {
    return props.match.player1.id === props.playerId && props.match.player2 ? props.match.player2.id : props.match.player1.id
})

const opponentCountry = computed(() => {
    return props.match.player1.id === props.playerId && props.match.player2 ? props.match.player2.country : props.match.player1.country
})

const opponentName = computed(() => {
    return props.match.player1.id === props.playerId && props.match.player2 ? props.match.player2.full_name : props.match.player1.full_name
})

const sets = computed(() => [
  { index: 1, s1: props.match.s1p1, s2: props.match.s1p2, t1: props.match.t1p1, t2: props.match.t1p2 },
  { index: 2, s1: props.match.s2p1, s2: props.match.s2p2, t1: props.match.t2p1, t2: props.match.t2p2 },
  { index: 3, s1: props.match.s3p1, s2: props.match.s3p2, t1: props.match.t3p1, t2: props.match.t3p2 },
  { index: 4, s1: props.match.s4p1, s2: props.match.s4p2, t1: props.match.t4p1, t2: props.match.t4p2 },
  { index: 5, s1: props.match.s5p1, s2: props.match.s5p2, t1: props.match.t5p1, t2: props.match.t5p2 }
])
</script>

<template>
    <tr class="text-xs md:text-sm">
        <td class="text-center">{{ round(match.round) }}</td>
        <td class="text-nowrap">
            <div v-if="match.incomplete === 'B'">BYE</div>
            <div
                v-else-if="match.player1 && match.player2"
                class="flex items-center"
            >
                <div class="mx-0.5">
                    <flag-img
                        class="w-[2rem]"
                        :src="flagSrc(opponentCountry)"
                        :alt="opponentCountry"
                    />
                </div>
                <div class="mx-0.5">
                    <v-avatar :size="lgAndUp ? 'default' : 'small'">
                        <v-img
                            :src="headshot(opponentId)"
                            :alt="opponentName"
                        />
                    </v-avatar>
                </div>
                <div class="mx-0.5">
                    <router-link
                        class="hover-link"
                        :to="{name: 'Player', params: {id: opponentId, name: opponentName}}"
                    >
                        {{ opponentName }}
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
            <div v-if="match.incomplete === 'WO'">WO</div>
            <div
                v-else
                v-for="set in sets"
                :key="set.index"
            >
                {{ set.s1 !== null && set.s2 !== null ? getMatchScore(props.match.player1.id, props.playerId, set.s1, set.s2) : ''}}<sup v-if="set.t1 !== null && set.t2 !== null">{{ getTieBreak(set.t1, set.t2) }}</sup>&nbsp;
            </div>
            <div v-if="match.incomplete === 'R'">Ret.</div>
            <div v-else-if="match.incomplete === 'D'">Def.</div>
        </td>
        <td>
            <v-chip
                v-if="match.incomplete !== 'B'"
                class="bg-zinc-300 text-indigo-800"
                :to="{name: 'H2H', params: {p1Name: encodeName(match.player1.full_name), p1Id: match.player1.id, p2Name: encodeName(match.player2.full_name), p2Id: match.player2.full_name}}"
                density="compact"
            >
                H2H
            </v-chip>
        </td>
    </tr>
</template>