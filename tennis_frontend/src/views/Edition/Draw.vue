<script setup>
import DrawCard from '@/components/Edition/DrawCard.vue';
import { ref } from 'vue';

const props = defineProps(['edition', 'matches'])

const final = ref([])
const sfMatches = ref([])
const qfMatches = ref([])
const r16Matches = ref([])
const r32Matches = ref([])
const r64Matches = ref([])
const r128Matches = ref([])

const finalArray = props.matches.filter(match => match.round === 'F')
final.value = finalArray
const sfArray = props.matches.filter(match => match.round === 'SF')
sfMatches.value = sfArray
const qfArray = props.matches.filter(match => match.round === 'QF')
qfMatches.value = qfArray
const r16Array = props.matches.filter(match => match.round === '16')
r16Matches.value = r16Array
const r32Array = props.matches.filter(match => match.round === '32')
r32Matches.value = r32Array
const r64Array = props.matches.filter(match => match.round === '64')
r64Matches.value = r64Array
const r128Array = props.matches.filter(match => match.round === '128')
r128Matches.value = r128Array

const selectedRound = ref(parseInt(props.edition.type_of_draw))

const selectRound = (round) => {
  selectedRound.value = round
}
</script>

<template>
    <main>
        <div class="navigator">
            <button v-if="edition.type_of_draw === '128'" :class="{'active-button': selectedRound === 128}" @click="selectRound(128)">R128</button>
            <button v-if="edition.type_of_draw === '128' || edition.type_of_draw === '64'" :class="{'active-button': selectedRound === 64}" @click="selectRound(64)">R64</button>
            <button :class="{'active-button': selectedRound === 32}" @click="selectRound(32)">R32</button>
            <button :class="{'active-button': selectedRound === 16}" @click="selectRound(16)">R16</button>
            <button :class="{'active-button': selectedRound === 8}" @click="selectRound(8)">QF</button>
            <button :class="{'active-button': selectedRound === 4}" @click="selectRound(4)">SF</button>
            <button :class="{'active-button': selectedRound === 2}" @click="selectRound(2)">F</button>
        </div>
        <div class="draw-wrapper">
            <div class="round-wrapper" v-if="edition.type_of_draw === '128'" v-show="selectedRound >= 128">
                <DrawCard v-for="match in r128Matches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper" v-if="edition.type_of_draw === '128' || edition.type_of_draw === '64'" v-show="selectedRound >= 64">
                <DrawCard v-for="match in r64Matches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper" v-show="selectedRound >= 32">
                <DrawCard v-for="match in r32Matches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper" v-show="selectedRound >= 16">
                <DrawCard v-for="match in r16Matches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper" v-show="selectedRound >= 8">
                <DrawCard v-for="match in qfMatches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper" v-show="selectedRound >= 4">
                <DrawCard v-for="match in sfMatches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper" v-show="selectedRound >= 2">
                <DrawCard :match="final[0]" />
            </div>
        </div>
    </main>
</template>

<style scoped>
button {
    border-radius: 50%;
    height: 3rem;
    width: 3rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    cursor: pointer;
    border: 2px solid var(--color-border);
    background-color: var(--color-background-mute);
    color: var(--color-text)
}

.active-button {
    border: 2px solid var(--blue-border);
    color: var(--color-heading)
}
</style>