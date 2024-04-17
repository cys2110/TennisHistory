<script setup>
import { computed, ref } from 'vue';
import { formatDate, headshot, flagSrc, tiebreak } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheck } from '@fortawesome/pro-duotone-svg-icons';

const props = defineProps(['match'])
const winner = ref(null)
const loser = ref(null)

console.log(props.match)

if (props.match.winner_id_id === props.match.p1_id) { 
    winner.value = 'p1'
    loser.value = 'p2'
} else {
    winner.value = 'p2'
    loser.value = 'p1'
}

const hour = Math.floor(props.match.duration_mins / 60)
const minutes = props.match.duration_mins % 60
const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
const duration = computed(() => `${hour}:${formattedMinutes}`)

const winnerStatus = computed(() => {
    if (props.match[winner.value + '_seed'] && props.match[winner.value + '_status']) {
        return `(${props.match[winner.value + '_seed']} ${props.match[winner.value + '_status']})`
    } else if (props.match[winner.value + '_seed']) {
        return `(${props.match[winner.value + '_seed']})`
    } else {
        return `(${props.match[winner.value + '_status']})`
    }
})

const loserStatus = computed(() => {
    if (props.match[loser.value + '_seed'] && props.match[loser.value + '_status']) {
        return `(${props.match[loser.value + '_seed']} ${props.match[loser.value + '_status']})`
    } else if (props.match[loser.value + '_seed']) {
        return `(${props.match[loser.value + '_seed']})`
    } else {
        return `(${props.match[loser.value + '_status']})`
    }
})

</script>

<template>
    <div class="result-card">
        <div class="card-component">
            <div v-if="match.date">Date: {{ formatDate(match.date) }}</div>
            <div class="right-side" v-if="match.duration_mins">Duration: {{ duration }}</div>
        </div>
        <div class="card-component">
            <div class="component-column">
                <div class="component-row"><img v-if="match[winner + '_headshot'] === 'True'" :src="headshot(match[winner + '_id'])" class="headshot" /></div>
                <div class="component-row"><img v-if="match[loser + '_headshot'] === 'True'" :src="headshot(match[loser + '_id'])" class="headshot" /></div>
            </div>
            <div class="component-column">
                <div class="component-row"><img :src="flagSrc(match[winner + '_country'])" class="mini-flag" /></div>
                <div class="component-row"><img v-if="match.incomplete !== 'B'" :src="flagSrc(match[loser + '_country'])" class="mini-flag" /></div>
            </div>
            <div class="component-column">
                <div class="component-row">
                    {{ match[winner + '_name'] }}
                    <span v-if="match[winner + '_seed'] || match[winner + '_status']" class="small">{{ winnerStatus }}</span>
                </div>
                <div class="component-row">
                    {{ match[loser+ '_name'] }}
                    <span v-if="match[loser + '_seed'] || match[loser + '_status']" class="small">{{ loserStatus }}</span>
                </div>
            </div>
            <div class="component-column">
                <div class="component-row"><FontAwesomeIcon :icon="faCheck" /></div>
                <div class="component-row"></div>
            </div>
        </div>
        <div class="score">
            <div class="component-column" v-if="match.s1p1">
                <div class="component-row">
                    {{ match['s1' + winner] }}<sup v-if="match['t1' + winner]">{{ tiebreak(match['s1' + winner], match['t1' + winner]) }}</sup>
                </div>
                <div class="component-row">
                    {{ match['s1' + loser] }}<sup v-if="match['t1' + loser]">{{ tiebreak(match['s1' + loser], match['t1' + loser]) }}</sup>
                </div>
            </div>
            <div class="component-column" v-if="match.s2p1">
                <div class="component-row">
                    {{ match['s2' + winner] }}<sup v-if="match['t2' + winner]">{{ tiebreak(match['s2' + winner], match['t2' + winner]) }}</sup>
                </div>
                <div class="component-row">
                    {{ match['s2' + loser] }}<sup v-if="match['t2' + loser]">{{ tiebreak(match['s2' + loser], match['t2' + loser]) }}</sup>
                </div>
            </div>
            <div class="component-column" v-if="match.s3p1">
                <div class="component-row">
                    {{ match['s3' + winner] }}<sup v-if="match['t3' + winner]">{{ tiebreak(match['s3' + winner], match['t3' + winner]) }}</sup>
                </div>
                <div class="component-row">
                    {{ match['s3' + loser] }}<sup v-if="match['t3' + loser]">{{ tiebreak(match['s3' + loser], match['t3' + loser]) }}</sup>
                </div>
            </div>
            <div class="component-column" v-if="match.s4p1">
                <div class="component-row">
                    {{ match['s4' + winner] }}<sup v-if="match['t4' + winner]">{{ tiebreak(match['s4' + winner], match['t4' + winner]) }}</sup>
                </div>
                <div class="component-row">
                    {{ match['s4' + loser] }}<sup v-if="match['t4' + loser]">{{ tiebreak(match['s4' + loser], match['t4' + loser]) }}</sup>
                </div>
            </div>
            <div class="component-column" v-if="match.s5p1">
                <div class="component-row">
                    {{ match['s5' + winner] }}<sup v-if="match['t5' + winner]">{{ tiebreak(match['s5' + winner], match['t5' + winner]) }}</sup>
                </div>
                <div class="component-row">
                    {{ match['s5' + loser] }}<sup v-if="match['t5' + loser]">{{ tiebreak(match['s5' + loser], match['t5' + loser]) }}</sup>
                </div>
            </div>
        </div>
        <div class="card-component">
            <div class="incomplete" v-if="match.incomplete === 'R'">Retired</div>
            <div class="incomplete" v-else-if="match.incomplete === 'WO'">Walkover</div>
            <div class="incomplete" v-else-if="match.incomplete === 'D'">Default</div>
            <div class="right-side" v-if="match.umpire">Umpire: {{ match.umpire }}</div>
        </div>
    </div>
</template>