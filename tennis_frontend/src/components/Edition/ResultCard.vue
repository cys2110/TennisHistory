<script setup>
import { ref } from 'vue';
import { formatDate, headshot, flagSrc, status, formatTime, incomplete } from '../utils';
import { RouterLink, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const props = defineProps(['match', 'edition'])
const router = useRouter()
const { xs } = useDisplay()
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

const navigate = (id, name) => {
    router.push({name: 'Player', params: {id: id, name: name}})
}

const navigateStats = () => {
    router.push({name: 'MatchStats', params: {name: props.edition.Tournament.name, id: props.edition.Tournament.id, year: props.edition.year, editionId: props.edition.edition_no, matchId: props.match.id}})
}

const navigateH2H = () => {
    router.push({name: 'H2H', params: {p1Name: props.match.player1.full_name, p1Id: props.match.p1, p2Name: props.match.player2.full_name, p2Id: props.match.p2}})
}
</script>

<template>
    <short-card class="ma-3 mx-auto" :style="xs ? 'width: 100%' : 'width: 40%'">
        <v-container>
            <v-row class="flex-nowrap">
                <v-col v-if="match.date">
                    Date: {{ formatDate(match.date) }}
                </v-col>
                <v-col v-if="match.duration_mins" class="text-right">
                    Duration: {{ formatTime(match.duration_mins) }}
                </v-col>
            </v-row>
            <v-row>
                <v-col class="d-flex align-center">
                    <v-avatar v-if="winner.headshot">
                        <v-img :src="headshot(winner.id)" @click="navigate(winner.id, winner.full_name)"/>
                    </v-avatar>
                    <flag-img :src="flagSrc(winner.country)" max-width="50" class="mx-2"/>
                    <RouterLink class="hover-link" :to="{name: 'Player', params: {id: winner.id, name: winner.full_name}}">{{ winner.full_name }}</RouterLink>
                    <small v-if="winEntry.seed || winEntry.status" class="text-grey-lighten-1">&nbsp;{{ status(winEntry.seed, winEntry.status) }}</small>
                </v-col>
                <v-col cols='1'>
                    <v-icon icon="fad fa-check" size="small"/>
                </v-col>
                <v-col cols="3" class="d-flex align-center justify-space-evenly">
                    <div v-for="num in Array.from({length: 5}, (_, index) => index + 1)">
                        {{ match[`s${num}${winPlayer}`] }}<sup>{{ match[`t${num}${winPlayer}`] > match[`t${num}${losePlayer}`] ? null : match[`t${num}${winPlayer}`] }}</sup>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-if="match.incomplete !== 'B'" class="d-flex align-center">
                    <v-avatar v-if="loser && loser.headshot">
                        <v-img :src="headshot(loser.id)" @click="navigate()"/>
                    </v-avatar>
                    <flag-img :src="flagSrc(loser.country)" max-width="50" class="mx-2"/>
                    <RouterLink class="hover-link" :to="{name: 'Player', params: {id: loser.id, name: loser.full_name}}">{{ loser.full_name }}</RouterLink>
                    <small v-if="loseEntry.seed || loseEntry.status" class="text-grey-lighten-1">&nbsp;{{ status(loseEntry.seed, loseEntry.status) }}</small>
                </v-col>
                <v-col v-else class="text-center">Bye</v-col>
                <v-col cols="1"></v-col>
                <v-col cols="3" class="d-flex align-center justify-space-evenly">
                    <div v-for="num in Array.from({length: 5}, (_, index) => index + 1)">
                        {{ match[`s${num}${losePlayer}`] }}<sup>{{ match[`t${num}${winPlayer}`] > match[`t${num}${losePlayer}`] ? match[`t${num}${losePlayer}`] : null }}</sup>
                    </div>
                </v-col>
            </v-row>
            <v-row class="flex-nowrap">
                <v-col v-if="match.incomplete && match.incomplete !== 'B'">{{ incomplete(match.incomplete) }}</v-col>
                <v-col v-if="match.umpire" class="text-right">Umpire: {{ match.umpire }}</v-col>
            </v-row>
            <v-row>
                <v-col class="text-right">
                    <v-chip v-if="match.incomplete !== 'B'" @click="navigateH2H" class="mx-2">H2H</v-chip>
                    <v-chip v-if="match.incomplete !== 'B'" @click="navigateStats">Match Stats</v-chip>
                </v-col>
            </v-row>
        </v-container>
    </short-card>
</template>