<script setup>
import { ref } from 'vue';
import { headshot, flagSrc } from '../utils'
import { RouterLink } from 'vue-router';

const props = defineProps(['match', 'id'])
const opponent = ref(null)

function round (roundNumber) {
    if (isNaN(parseInt(roundNumber))) {
        return roundNumber
    } else {
        return `R${roundNumber}`
    }
}

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
            >
                <v-img :src="headshot(opponent.id)" :alt="opponent.full_name" />
            </v-avatar>
            <flag-img :src="flagSrc(opponent.country)" max-width="25" class="mx-2" :alt="opponent.country"/>
            <RouterLink class="hover-link" :to="{name: 'Player', params: {id: opponent.id, name: opponent.full_name}}">{{ opponent.full_name }}</RouterLink>
        </div>
    </td>
    <td>
        <v-icon v-if="match.winner_id === id" icon="fad fa-check" class="text-light-green-accent-3"/>

        <v-icon v-else icon="fas fa-x" class="text-red-darken-1"/>
    </td>
    <td>
        <div v-if="match.incomplete === 'WO'">WALKOVER</div>
        <div v-else>
            <span v-if="match.s1p1 !== null">
                {{ match.p1 === id ? `${match.s1p1}${match.s1p2}` : `${match.s1p2}${match.s1p1}` }}
                <sup v-if="match.t1p1 || match.t1p2">{{ match.t1p1 > match.t1p2 ? match.t1p2 : match.t1p1 }}</sup>&nbsp;
            </span>
            <span v-if="match.s2p1 !== null">
                {{ match.p1 === id ? `${match.s2p1}${match.s2p2}` : `${match.s2p2}${match.s2p1}` }}
                <sup v-if="match.t2p1 || match.t2p2">{{ match.t2p1 > match.t2p2 ? match.t2p2 : match.t2p1 }}</sup>&nbsp;
            </span>
            <span v-if="match.s3p1 !== null">
                {{ match.p1 === id ? `${match.s3p1}${match.s3p2}` : `${match.s3p2}${match.s3p1}` }}
                <sup v-if="match.t3p1 || match.t3p2">{{ match.t3p1 > match.t3p2 ? match.t3p2 : match.t3p1 }}</sup>&nbsp;
            </span>
            <span v-if="match.s4p1 !== null">
                {{ match.p1 === id ? `${match.s4p1}${match.s4p2}` : `${match.s4p2}${match.s4p1}` }}
                <sup v-if="match.t4p1 || match.t4p2">{{ match.t4p1 > match.t4p2 ? match.t4p2 : match.t4p1 }}</sup>&nbsp;
            </span>
            <span v-if="match.s5p1 !== null">
                {{ match.p1 === id ? `${match.s5p1}${match.s5p2}` : `${match.s5p2}${match.s5p1}` }}
                <sup v-if="match.t5p1 || match.t5p2">{{ match.t5p1 > match.t5p2 ? match.t5p2 : match.t5p1 }}</sup>&nbsp;
            </span>
        </div>
        <div v-if="match.incomplete === 'R'">Ret'd</div>
        <div v-else-if="match.incomplete === 'D'">Def.</div>
    </td>
    <td></td>
</template>