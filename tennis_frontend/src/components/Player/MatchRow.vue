<script setup>
import { ref } from 'vue';
import { tiebreak, headshot, flagSrc, round } from '../utils'
import { RouterLink } from 'vue-router';

const props = defineProps(['match', 'id'])
const opponent = ref(null)

if (props.match.p1 === props.id && props.match.p2) {
    opponent.value = props.match.player2
} else if (props.match.p1) {
    opponent.value = props.match.player1
}
</script>

<template>
    <td class="text-center">{{ round(match.round) }}</td>
    <td>
        <div v-if="match.incomplete === 'B'">BYE</div>
        <div class="d-flex align-center" v-else-if="opponent">
            <v-avatar
            v-if="opponent.headshot"
            variant="outlined"
            >
                <v-img :src="headshot(opponent.id)" :alt="opponent.full_name"></v-img>
            </v-avatar>
            <v-img :src="flagSrc(opponent.country)" max-width="25" rounded="lg" class="mx-2" :alt="opponent.country"></v-img>
            <RouterLink class="hover-link" :to="{name: 'Player', params: {id: opponent.id, name: opponent.full_name}}">{{ opponent.full_name }}</RouterLink>
        </div>
    </td>
    <td>
        <v-icon v-if="match.winner_id === id" icon="fad fa-check" class="text-light-green-accent-3">
        </v-icon>
        <v-icon v-else icon="fas fa-x" class="text-red-darken-1"></v-icon>
    </td>
    <td>
        <div v-if="match.incomplete === 'WO'">WALKOVER</div>
        <div v-else-if="match.p1 === id">
            <span v-if="match.s1p1">{{ match.s1p1 }}{{ match.s1p2 }}
                <sup v-if="match.t1p1 || match.t1p2">{{ tiebreak(match.s1p1, match.t1p1) }}{{ tiebreak(match.s1p2, match.t1p2) }}</sup>
            </span>
            <span v-if="match.s2p1">{{ match.s2p1 }}{{ match.s2p2 }}
                <sup v-if="match.t2p1 || match.t2p2">{{ tiebreak(match.s2p1, match.t2p1) }}{{ tiebreak(match.s2p2, match.t2p2) }}</sup>
            </span>
            <span v-if="match.s3p1">{{ match.s3p1 }}{{ match.s3p2 }}
                <sup v-if="match.t3p1 || match.t3p2">{{ tiebreak(match.s3p1, match.t3p1) }}{{ tiebreak(match.s3p2, match.t3p2) }}</sup>
            </span>
            <span v-if="match.s4p1">{{ match.s4p1 }}{{ match.s4p2 }}
                <sup v-if="match.t4p1 || match.t4p2">{{ tiebreak(match.s4p1, match.t4p1) }}{{ tiebreak(match.s4p2, match.t4p2) }}</sup>
            </span>
            <span v-if="match.s5p1">{{ match.s5p1 }}{{ match.s5p2 }}
                <sup v-if="match.t5p1 || match.t5p2">{{ tiebreak(match.s5p1, match.t5p1) }}{{ tiebreak(match.s5p2, match.t5p2) }}</sup>
            </span>
        </div>
        <div v-else>
            <span v-if="match.s1p1">{{ match.s1p2 }}{{ match.s1p1 }}
                <sup v-if="match.t1p1 || match.t1p2">{{ tiebreak(match.s1p1, match.t1p1) }}{{ tiebreak(match.s1p2, match.t1p2) }}</sup>
            </span>
            <span v-if="match.s2p1">{{ match.s2p2 }}{{ match.s2p1 }}
                <sup v-if="match.t2p1 || match.t2p2">{{ tiebreak(match.s2p1, match.t2p1) }}{{ tiebreak(match.s2p2, match.t2p2) }}</sup>
            </span>
            <span v-if="match.s3p1">{{ match.s3p2 }}{{ match.s3p1 }}
                <sup v-if="match.t3p1 || match.t3p2">{{ tiebreak(match.s3p1, match.t3p1) }}{{ tiebreak(match.s3p2, match.t3p2) }}</sup>
            </span>
            <span v-if="match.s4p1">{{ match.s4p2 }}{{ match.s4p1 }}
                <sup v-if="match.t4p1 || match.t4p2">{{ tiebreak(match.s4p1, match.t4p1) }}{{ tiebreak(match.s4p2, match.t4p2) }}</sup>
            </span>
            <span v-if="match.s5p1">{{ match.s5p2 }}{{ match.s5p1 }}
                <sup v-if="match.t5p1 || match.t5p2">{{ tiebreak(match.s5p1, match.t5p1) }}{{ tiebreak(match.s5p2, match.t5p2) }}</sup>
            </span>
        </div>
        <div v-if="match.incomplete === 'R'">Ret'd</div>
        <div v-else-if="match.incomplete === 'Def'">Def.</div>
    </td>
    <td></td>
</template>