<script setup>
import { computed, ref } from 'vue';
import { formatDate, headshot, flagSrc, tiebreak } from '../utils';
import { RouterLink, useRouter } from 'vue-router';

const props = defineProps(['match'])
const router = useRouter()
const winner = ref(null)
const winPlayer = ref(null)
const loser = ref(null)
const losePlayer = ref(null)
const winEntry = ref(null)
const loseEntry = ref(null)

if (props.match.winner_id === props.match.p1) { 
    winner.value = props.match.player1
    winPlayer.value = 'p1'
    winEntry.value = props.match.entry1
    if (props.match.incomplete !== 'B') {
        loser.value = props.match.player2
        losePlayer.value = 'p2'
        loseEntry.value = props.match.entry2
    }
} else {
    winner.value = props.match.player2
    winPlayer.value = 'p2'
    winEntry.value = props.match.entry2
    if (props.match.incomplete !== 'B') {
        loser.value = props.match.player1
        losePlayer.value = 'p1'
        loseEntry.value = props.match.entry1
    }
}

const hour = Math.floor(props.match.duration_mins / 60)
const minutes = props.match.duration_mins % 60
const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
const duration = computed(() => `${hour}:${formattedMinutes}`)

const navigate = (id, name) => {
    router.push({name: 'PlayerOverview', params: {id: id, name: name}})
}

const winnerStatus = computed(() => {
    if (winEntry.value.seed && winEntry.value.status) {
        return `(${winEntry.value.seed} ${winEntry.value.status})`
    } else if (winEntry.value.seed) {
        return `(${winEntry.value.seed})`
    } else {
        return `(${winEntry.value.status})`
    }
})

const loserStatus = computed(() => {
    if (loseEntry.value.seed && loseEntry.value.status) {
        return `(${loseEntry.value.seed} ${loseEntry.value.status})`
    } else if (loseEntry.value.seed) {
        return `(${loseEntry.value.seed})`
    } else {
        return `(${loseEntry.value.status})`
    }
})
</script>

<template>
    <v-card variant="tonal" class="ma-3" style="width: 45%;">
        <v-container>
            <v-row>
                <v-col v-if="match.date">
                    Date: {{ formatDate(match.date) }}
                </v-col>
                <v-col v-if="match.duration_mins">
                    Duration: {{ duration }}
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="2">
                    <v-avatar v-if="winner.headshot">
                        <v-img :src="headshot(winner.id)" @click="navigate(winner.id, winner.full_name)"></v-img>
                    </v-avatar>
                </v-col>
                <v-col cols="2">
                    <v-img :src="flagSrc(winner.country)" class="mini-flag"></v-img>
                </v-col>
                <v-col>
                    <RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: winner.id, name: winner.full_name}}">{{ winner.full_name }}</RouterLink>
                    <span v-if="winEntry.seed || winEntry.status" class="small">{{ winnerStatus }}</span>
                </v-col>
                <v-col cols=1>
                    <v-icon icon="fad fa-check"></v-icon>
                </v-col>
                <v-col cols="1" v-if="match.s1p1">
                    {{ match['s1' + winPlayer] }}<sup v-if="match['t1' + winPlayer]">{{ tiebreak(match['s1' + winPlayer], match['t1' + winPlayer]) }}</sup>
                </v-col>
                <v-col cols="1" v-if="match.s2p1">
                    {{ match['s2' + winPlayer] }}<sup v-if="match['t2' + winPlayer]">{{ tiebreak(match['s2' + winPlayer], match['t2' + winPlayer]) }}</sup>
                </v-col>
                <v-col cols="1" v-if="match.s3p1">
                    {{ match['s3' + winPlayer] }}<sup v-if="match['t3' + winPlayer]">{{ tiebreak(match['s3' + winPlayer], match['t3' + winPlayer]) }}</sup>
                </v-col>
                <v-col cols="1" v-if="match.s4p1">
                    {{ match['s4' + winPlayer] }}<sup v-if="match['t4' + winPlayer]">{{ tiebreak(match['s4' + winPlayer], match['t4' + winPlayer]) }}</sup>
                </v-col>
                <v-col cols="1" v-if="match.s5p1">
                    {{ match['s5' + winPlayer] }}<sup v-if="match['t5' + winPlayer]">{{ tiebreak(match['s5' + winPlayer], match['t5' + winPlayer]) }}</sup>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols=2>
                    <v-avatar v-if="loser && loser.headshot">
                        <v-img :src="headshot(loser.id)" @click="navigate(loser.id, loser.full_name)"></v-img>
                    </v-avatar>
                </v-col>
                <v-col cols=2>
                    <v-img v-if="match.incomplete !== 'B'" :src="flagSrc(loser.country)" class="mini-flag"></v-img>
                </v-col>
                <v-col v-if="match.incomplete !== 'B'">
                    <RouterLink v-if="match.incomplete !== 'B'" class="hover-link" :to="{name: 'PlayerOverview', params: {id: loser.id, name: loser.full_name}}">{{ loser.full_name }}</RouterLink>
                    <span v-if="loseEntry.seed || loseEntry.status" class="small">{{ loserStatus }}</span>
                </v-col>
                <v-col v-else>Bye</v-col>
                <v-col cols="1"></v-col>
                <v-col cols="1" v-if="match.s1p1">
                    {{ match['s1' + losePlayer] }}<sup v-if="match['t1' + losePlayer]">{{ tiebreak(match['s1' + losePlayer], match['t1' + losePlayer]) }}</sup>
                </v-col>
                <v-col cols="1" v-if="match.s2p1">
                    {{ match['s2' + losePlayer] }}<sup v-if="match['t2' + losePlayer]">{{ tiebreak(match['s2' + losePlayer], match['t2' + losePlayer]) }}</sup>
                </v-col>
                <v-col cols="1" v-if="match.s3p1">
                    {{ match['s3' + losePlayer] }}<sup v-if="match['t3' + losePlayer]">{{ tiebreak(match['s3' + losePlayer], match['t3' + losePlayer]) }}</sup>
                </v-col>
                <v-col cols="1" v-if="match.s4p1">
                    {{ match['s4' + losePlayer] }}<sup v-if="match['t4' + losePlayer]">{{ tiebreak(match['s4' + losePlayer], match['t4' + losePlayer]) }}</sup>
                </v-col>
                <v-col cols="1" v-if="match.s5p1">
                    {{ match['s5' + losePlayer] }}<sup v-if="match['t5' + losePlayer]">{{ tiebreak(match['s5' + losePlayer], match['t5' + losePlayer]) }}</sup>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-if="match.incomplete === 'R'">Retired</v-col>
                <v-col v-else-if="match.incomplete === 'WO'">Walkover</v-col>
                <v-col v-else-if="match.incomplete === 'D'">Default</v-col>
                <v-col v-if="match.umpire">Umpire: {{ match.umpire }}</v-col>
            </v-row>
        </v-container>
    </v-card>
</template>