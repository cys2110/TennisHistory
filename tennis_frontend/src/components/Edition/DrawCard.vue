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
    <div class="draw-card-wrapper">
        <div class="card-component">
            <div class="component-column">
                <div class="component-row"><img v-if="match.player1 && match.player1.headshot" :src="headshot(match.p1)" class="headshot" @click="navigate(match.p1, match.player1.full_name)" /></div>
                <div class="component-row"><img v-if="match.player2 && match.player2.headshot" :src="headshot(match.p2)" class="headshot" @click="navigate(match.p2, match.player2.full_name)" /></div>
            </div>
            <div class="component-column">
                <div class="component-row"><img v-if="match.player1" :src="flagSrc(match.player1.country)" class="mini-flag" /></div>
                <div class="component-row"><img v-if="match.player2" :src="flagSrc(match.player2.country)" class="mini-flag" /></div>
            </div>
            <div class="component-column">
                <div class="component-row" v-if="match.player1"><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: match.p1, name: match.player1.full_name}}" >{{ match.player1.full_name }}</RouterLink></div>
                <div class="component-row" v-else-if="match.incomplete === 'B'">Bye</div>
                <div class="component-row" v-else>Player 1</div>
                <div class="component-row" v-if="match.player2"><RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: match.p2, name: match.player2.full_name}}" >{{ match.player2.full_name }}</RouterLink></div>
                <div class="component-row" v-else-if="match.incomplete === 'B'">Bye</div>
                <div class="component-row" v-else>Player 2</div>
            </div>
            <div class="component-column">
                <div class="component-row"><FontAwesomeIcon v-if="match.winner_id === match.p1" :icon="faCheck" /></div>
                <div class="component-row"><FontAwesomeIcon v-if="match.winner_id === match.p2" :icon="faCheck" /></div>
            </div>
            <div class="score">
                <div class="component-column" v-if="match.s1p1">
                    <div class="component-row">{{ match.s1p1 }}<sup v-if="match.t1p1">{{ tiebreak(match.s1p1, match.t1p1) }}</sup></div>
                    <div class="component-row">{{ match.s1p2 }}<sup v-if="match.t1p2">{{ tiebreak(match.s1p2, match.t1p2) }}</sup></div>
                </div>
                <div class="component-column" v-if="match.s2p1">
                    <div class="component-row">{{ match.s2p1 }}<sup v-if="match.t2p1">{{ tiebreak(match.s2p1, match.t2p1) }}</sup></div>
                    <div class="component-row">{{ match.s2p2 }}<sup v-if="match.t2p2">{{ tiebreak(match.s2p2, match.t2p2) }}</sup></div>
                </div>
                <div class="component-column" v-if="match.s3p1">
                    <div class="component-row">{{ match.s3p1 }}<sup v-if="match.t3p1">{{ tiebreak(match.s3p1, match.t3p1) }}</sup></div>
                    <div class="component-row">{{ match.s3p2 }}<sup v-if="match.t3p2">{{ tiebreak(match.s3p2, match.t3p2) }}</sup></div>
                </div>
                <div class="component-column" v-if="match.s4p1">
                    <div class="component-row">{{ match.s4p1 }}<sup v-if="match.t4p1">{{ tiebreak(match.s4p1, match.t4p1) }}</sup></div>
                    <div class="component-row">{{ match.s4p2 }}<sup v-if="match.t4p2">{{ tiebreak(match.s4p2, match.t4p2) }}</sup></div>
                </div>
                <div class="component-column" v-if="match.s5p1">
                    <div class="component-row">{{ match.s5p1 }}<sup v-if="match.t5p1">{{ tiebreak(match.s5p1, match.t5p1) }}</sup></div>
                    <div class="component-row">{{ match.s5p2 }}<sup v-if="match.t5p2">{{ tiebreak(match.s5p2, match.t5p2) }}</sup></div>
                </div>
            </div>
            <div class="card-component">
                <div class="right" v-if="match.incomplete === 'R'">Retired</div>
                <div class="right" v-else-if="match.incomplete === 'WO'">Walkover</div>
                <div class="right" v-else-if="match.incomplete === 'D'">Default</div>
            </div>
        </div>
    </div>
</template>