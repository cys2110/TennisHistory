<script setup>
import { computed, ref } from 'vue';
import { formatDate, headshot, flagSrc, tiebreak } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheck } from '@fortawesome/pro-duotone-svg-icons';
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
    <div class="result-card">
        <div class="card-component">
            <div v-if="match.date" class="left">Date: {{ formatDate(match.date) }}</div>
            <div class="right" v-if="match.duration_mins">Duration: {{ duration }}</div>
        </div>
        <div class="card-component">
            <div class="component-column">
                <div class="component-row"><img v-if="winner.headshot" :src="headshot(winner.id)" class="headshot" @click="navigate(winner.id, winner.full_name)" /></div>
                <div class="component-row"><img v-if="loser && loser.headshot" :src="headshot(loser.id)" class="headshot" @click="navigate(loser.id, loser.full_name)" /></div>
            </div>
            <div class="component-column">
                <div class="component-row"><img :src="flagSrc(winner.country)" class="mini-flag" /></div>
                <div class="component-row"><img v-if="match.incomplete !== 'B'" :src="flagSrc(loser.country)" class="mini-flag" /></div>
            </div>
            <div class="component-column">
                <div class="component-row">
                    <RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: winner.id, name: winner.full_name}}">{{ winner.full_name }}</RouterLink>
                    <span v-if="winEntry.seed || winEntry.status" class="small">{{ winnerStatus }}</span>
                </div>
                <div class="component-row" v-if="match.incomplete !== 'B'">
                    <RouterLink class="hover-link" :to="{name: 'PlayerOverview', params: {id: loser.id, name: loser.full_name}}">{{ loser.full_name }}</RouterLink>
                    <span v-if="loseEntry.seed || loseEntry.status" class="small">{{ loserStatus }}</span>
                </div>
                <div class="component-row" v-else>Bye</div>
            </div>
            <div class="component-column">
                <div class="component-row"><FontAwesomeIcon :icon="faCheck" /></div>
                <div class="component-row"></div>
            </div>
            <div class="score">
                <div class="component-column" v-if="match.s1p1">
                    <div class="component-row">
                        {{ match['s1' + winPlayer] }}<sup v-if="match['t1' + winPlayer]">{{ tiebreak(match['s1' + winPlayer], match['t1' + winPlayer]) }}</sup>
                    </div>
                    <div class="component-row">
                        {{ match['s1' + losePlayer] }}<sup v-if="match['t1' + losePlayer]">{{ tiebreak(match['s1' + losePlayer], match['t1' + losePlayer]) }}</sup>
                    </div>
                </div>
                <div class="component-column" v-if="match.s2p1">
                    <div class="component-row">
                        {{ match['s2' + winPlayer] }}<sup v-if="match['t2' + winPlayer]">{{ tiebreak(match['s2' + winPlayer], match['t2' + winPlayer]) }}</sup>
                    </div>
                    <div class="component-row">
                        {{ match['s2' + losePlayer] }}<sup v-if="match['t2' + losePlayer]">{{ tiebreak(match['s2' + losePlayer], match['t2' + losePlayer]) }}</sup>
                    </div>
                </div>
                <div class="component-column" v-if="match.s3p1">
                    <div class="component-row">
                        {{ match['s3' + winPlayer] }}<sup v-if="match['t3' + winPlayer]">{{ tiebreak(match['s3' + winPlayer], match['t3' + winPlayer]) }}</sup>
                    </div>
                    <div class="component-row">
                        {{ match['s3' + losePlayer] }}<sup v-if="match['t3' + losePlayer]">{{ tiebreak(match['s3' + losePlayer], match['t3' + losePlayer]) }}</sup>
                    </div>
                </div>
                <div class="component-column" v-if="match.s4p1">
                    <div class="component-row">
                        {{ match['s4' + winPlayer] }}<sup v-if="match['t4' + winPlayer]">{{ tiebreak(match['s4' + winPlayer], match['t4' + winPlayer]) }}</sup>
                    </div>
                    <div class="component-row">
                        {{ match['s4' + losePlayer] }}<sup v-if="match['t4' + losePlayer]">{{ tiebreak(match['s4' + losePlayer], match['t4' + losePlayer]) }}</sup>
                    </div>
                </div>
                <div class="component-column" v-if="match.s5p1">
                    <div class="component-row">
                        {{ match['s5' + winPlayer] }}<sup v-if="match['t5' + winPlayer]">{{ tiebreak(match['s5' + winPlayer], match['t5' + winPlayer]) }}</sup>
                    </div>
                    <div class="component-row">
                        {{ match['s5' + losePlayer] }}<sup v-if="match['t5' + losePlayer]">{{ tiebreak(match['s5' + losePlayer], match['t5' + losePlayer]) }}</sup>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-component">
            <div class="incomplete" v-if="match.incomplete === 'R'" >Retired</div>
            <div class="incomplete" v-else-if="match.incomplete === 'WO'">Walkover</div>
            <div class="incomplete" v-else-if="match.incomplete === 'D'">Default</div>
            <div class="right" v-if="match.umpire">Umpire: {{ match.umpire }}</div>
        </div>
    </div>
</template>

<style scoped>
.result-card {
    display: flex;
    flex-direction: column;
    width: 45%;
    border: 2px solid var(--color-border);
    border-radius: 15px;
    margin: 15px;
    padding: 5px
}

.score {
    display: flex;
    flex-direction: row;
    height: 100%;
    margin-left: auto;
}

.right {
    padding: 1rem;
}

.incomplete, .left {
    padding-left: 1rem;
}
</style>