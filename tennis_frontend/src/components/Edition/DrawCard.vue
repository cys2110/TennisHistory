<script setup>
import { headshot, flagSrc, tiebreak } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheck } from '@fortawesome/pro-duotone-svg-icons';
import { useRouter, RouterLink } from 'vue-router';

const props = defineProps(['match'])
const router = useRouter()

const navigate = (id, name) => {
    router.push({name: 'PlayerOverview', params: {id: id, name: name}})
}

</script>

<template>
    <v-card class="ma-3" variant="outlined" rounded="xl">
        <v-container>
            <v-row class="flex-nowrap">
                <v-col cols="2">
                    <v-avatar v-if="match.player1 && match.player1.headshot">
                        <v-img :src="headshot(match.p1)" @click="navigate(match.p1, match.player1.full_name)"></v-img>
                    </v-avatar>
                </v-col>
                <v-col cols="2">
                    <v-img v-if="match.player1" :src="flagSrc(match.player1.country)" class="mini-flag"></v-img>
                </v-col>
                <v-col class="px-0">
                    <div v-if="match.player1"><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: match.p1, name: match.player1.full_name}}" >{{ match.player1.full_name }}</RouterLink></div>
                    <div v-else-if="match.incomplete === 'B'">Bye</div>
                    <div v-else>Player 1</div>
                </v-col>
                <v-col cols="1" class="px-0">
                    <v-icon v-if="match.winner_id === match.p1" icon="fad fa-check"></v-icon>
                </v-col>
                <v-col cols="1" class="px-0" v-if="match.s1p1">{{ match.s1p1 }}<sup v-if="match.t1p1">{{ tiebreak(match.s1p1, match.t1p1) }}</sup></v-col>
                <v-col cols="1" class="px-0" v-if="match.s2p1">{{ match.s2p1 }}<sup v-if="match.t2p1">{{ tiebreak(match.s2p1, match.t2p1) }}</sup></v-col>
                <v-col cols="1" class="px-0" v-if="match.s3p1">{{ match.s3p1 }}<sup v-if="match.t3p1">{{ tiebreak(match.s3p1, match.t3p1) }}</sup></v-col>
                <v-col cols="1" class="px-0" v-if="match.s4p1">{{ match.s4p1 }}<sup v-if="match.t4p1">{{ tiebreak(match.s4p1, match.t4p1) }}</sup></v-col>
                <v-col cols="1" class="px-0" v-if="match.s5p1">{{ match.s5p1 }}<sup v-if="match.t5p1">{{ tiebreak(match.s5p1, match.t5p1) }}</sup></v-col>
            </v-row>
            <v-row class="flexnowrap">
                <v-col cols="2">
                    <v-avatar v-if="match.player2 && match.player2.headshot">
                        <v-img :src="headshot(match.p2)" @click="navigate(match.p2, match.player2.full_name)"></v-img>
                    </v-avatar>
                </v-col>
                <v-col cols="2">
                    <v-img v-if="match.player2" :src="flagSrc(match.player2.country)" class="mini-flag"></v-img>
                </v-col>
                <v-col class="px-0">
                    <div v-if="match.player2"><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: match.p2, name: match.player2.full_name}}" >{{ match.player2.full_name }}</RouterLink></div>
                    <div v-else-if="match.incomplete === 'B'">Bye</div>
                    <div v-else>Player 2</div>
                </v-col>
                <v-col class="px-0" cols="1">
                    <v-icon v-if="match.winner_id === match.p2" icon="fad fa-check"></v-icon>
                </v-col>
                <v-col class="px-0" cols="1" v-if="match.s1p2">{{ match.s1p2 }}<sup v-if="match.t1p2">{{ tiebreak(match.s1p2, match.t1p2) }}</sup></v-col>
                <v-col class="px-0" cols="1" v-if="match.s2p2">{{ match.s2p2 }}<sup v-if="match.t2p2">{{ tiebreak(match.s2p2, match.t2p2) }}</sup></v-col>
                <v-col class="px-0" cols=1 v-if="match.s3p2">{{ match.s3p2 }}<sup v-if="match.t3p2">{{ tiebreak(match.s3p2, match.t3p2) }}</sup></v-col>
                <v-col class="px-0" cols="1" v-if="match.s4p2">{{ match.s4p2 }}<sup v-if="match.t4p2">{{ tiebreak(match.s4p2, match.t4p2) }}</sup></v-col>
                <v-col class="px-0" cols="1" v-if="match.s5p2">{{ match.s5p2 }}<sup v-if="match.t5p2">{{ tiebreak(match.s5p2, match.t5p2) }}</sup></v-col>
            </v-row>
            <v-row>
                <v-col v-if="match.incomplete === 'R'">Retired</v-col>
                <v-col v-else-if="match.incomplete === 'WO'">Walkover</v-col>
                <v-col v-else-if="match.incomplete === 'D'">Default</v-col>
            </v-row>
        </v-container>
    </v-card>
</template>