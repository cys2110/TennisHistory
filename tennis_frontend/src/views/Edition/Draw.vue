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

const selectedRound = ref(null)
if (props.edition.entries.length > 64) {
    selectedRound.value = 128
} else if (props.edition.entries.length > 32) {
    selectedRound.value = 64
} else {
    selectedRound.value = 32
}

const selectRound = (round) => {
  selectedRound.value = round
}
</script>

<template>
    <main>
        <div class="navigator">
            <button v-if="edition.entries.length > 64">R128</button>
            <button v-if="edition.entries.length > 32">R64</button>
            <button>R32</button>
            <button>R16</button>
            <button>QF</button>
            <button>SF</button>
            <button>F</button>
        </div>
        <div class="draw-wrapper">
            <div class="round-wrapper" v-if="edition.entries.length > 64">
                <DrawCard v-for="match in r128Matches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper" v-if="edition.entries.length > 32">
                <DrawCard v-for="match in r64Matches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper">
                <DrawCard v-for="match in r32Matches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper">
                <DrawCard v-for="match in r16Matches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper">
                <DrawCard v-for="match in qfMatches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper">
                <DrawCard v-for="match in sfMatches" :key="match.id" :match="match" />
            </div>
            <div class="round-wrapper">
                <DrawCard :match="final[0]" />
            </div>
        </div>
    </main>
</template>