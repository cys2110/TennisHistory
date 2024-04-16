<script setup>
import ResultCard from '@/components/Edition/ResultCard.vue';
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
</script>

<template>
    <main>
        <div class="round-container">
            <h1>Final</h1>
            <div class="result-card-container">
                <ResultCard :match="final[0]" />
            </div>
        </div>
        <div class="round-container">
            <h1>Semifinals</h1>
            <div class="result-card-container">
                <ResultCard v-for="match in sfMatches" :key="match.id" :match="match" />
            </div>
        </div>
        <div class="round-container">
            <h1>Quarterfinals</h1>
            <div class="result-card-container">
                <ResultCard v-for="match in qfMatches" :key="match.id" :match="match" />
            </div>
        </div>
        <div class="round-container">
            <h1>Round of 16</h1>
            <div class="result-card-container">
                <ResultCard v-for="match in r16Matches" :key="match.id" :match="match" />
            </div>
        </div>
        <div class="round-container">
            <h1>Round of 32</h1>
            <div class="result-card-container">
                <ResultCard v-for="match in r32Matches" :key="match.id" :match="match" />
            </div>
        </div>
        <div class="round-container" v-if="r64Matches.length > 0">
            <h1>Round of 64</h1>
            <div class="result-card-container">
                <ResultCard v-for="match in r64Matches" :key="match.id" :match="match" />
            </div>
        </div>
        <div class="round-container" v-if="r128Matches.length > 0">
            <h1>Round of 128</h1>
            <div class="result-card-container">
                <ResultCard v-for="match in r128Matches" :key="match.id" :match="match" />
            </div>
        </div>
    </main>
</template>