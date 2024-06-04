<script setup>
import { headshot, flagSrc, incomplete } from '../utils';
import { useRouter, RouterLink } from 'vue-router';

const props = defineProps(['match', 'edition'])
const router = useRouter()

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
    <short-card class="ma-3">
        <v-container>
            <v-row class="flex-nowrap">
                <v-col class="d-flex align-center">
                    <v-avatar v-if="match.player1">
                        <v-img :src="headshot(match.p1)" @click="navigate()"/>
                    </v-avatar>
                    <flag-img v-if="match.player1" :src="flagSrc(match.player1.country)" class="mx-2" max-width="50"/>
                    <div v-if="match.player1"><RouterLink class="hover-link" :to="{name: 'Player', params: {id: match.p1, name: match.player1.full_name}}" >{{ match.player1.full_name }}</RouterLink></div>
                    <div v-else-if="match.incomplete === 'B'">Bye</div>
                    <div v-else>Player 1</div>
                </v-col>
                <v-col cols="1" class="px-0">
                    <v-icon v-if="match.winner_id === match.p1" icon="fad fa-check" size="small"/>
                </v-col>
                <v-col cols="2" class="d-flex align-center justify-space-evenly">
                    <div v-for="num in Array.from({length: 5}, (_, index) => index + 1)">
                        {{ match[`s${num}p1`] }}<sup>{{ match[`t${num}p1`] }}</sup>&nbsp;
                    </div>
                </v-col>
            </v-row>
            <v-row class="flexnowrap">
                <v-col class="d-flex align-center">
                    <v-avatar v-if="match.player2">
                        <v-img :src="headshot(match.p2)" @click="navigate()"/>
                    </v-avatar>
                    <flag-img v-if="match.player2" :src="flagSrc(match.player2.country)" max-width="50" class="mx-2"/>
                    <div v-if="match.player2"><RouterLink class="hover-link" :to="{name: 'Player', params: {id: match.p2, name: match.player2.full_name}}" >{{ match.player2.full_name }}</RouterLink></div>
                    <div v-else-if="match.incomplete === 'B'">Bye</div>
                    <div v-else>Player 2</div>
                </v-col>
                <v-col class="px-0" cols="1">
                    <v-icon v-if="match.winner_id === match.p2" icon="fad fa-check" size="small"/>
                </v-col>
                <v-col cols="2" class="d-flex align-center justify-space-evenly">
                    <div v-for="num in Array.from({length: 5}, (_, index) => index + 1)">
                        {{ match[`s${num}p2`] }}<sup>{{ match[`t${num}p2`] }}</sup>&nbsp;
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div v-if="match.incomplete">{{ incomplete(match.incomplete) }}</div>
                </v-col>
                <v-col class="text-right">
                    <v-chip v-if="match.incomplete !== 'B'" @click="navigateH2H" class="mx-2">H2H</v-chip>
                    <v-chip @click="navigateStats" v-if="match.incomplete !== 'B' && match.incomplete !== 'WO'">Match Stats</v-chip>
                </v-col>
            </v-row>
        </v-container>
    </short-card>
</template>