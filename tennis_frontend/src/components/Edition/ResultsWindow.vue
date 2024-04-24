<script setup>
import ResultCard from '@/components/Edition/ResultCard.vue';
import { ref } from 'vue';

const props = defineProps(['edition', 'matches'])

const finalArray = props.matches.filter(match => match.round === 'F')
const sfArray = props.matches.filter(match => match.round === 'SF')
const qfArray = props.matches.filter(match => match.round === 'QF')
const r16Array = props.matches.filter(match => match.round === '16')
const r32Array = props.matches.filter(match => match.round === '32')
const r64Array = props.matches.filter(match => match.round === '64')
const r128Array = props.matches.filter(match => match.round === '128')
const round = finalArray.length > 0 ? 'final' :
    sfArray.length > 0 ? 'sfs' :
    qfArray.length > 0 ? 'qfs' :
    r16Array.length > 0 ? 'r16' :
    r32Array.length > 0 ? 'r32' :
    r64Array.length > 0 ? 'r64' : 'r128'
const tab = ref(round)
</script>

<template>
        <v-tabs v-model="tab">
            <v-tab v-if="finalArray.length > 0" value="final">Final</v-tab>
            <v-tab v-if="sfArray.length > 0" value="sfs">Semifinals</v-tab>
            <v-tab v-if="qfArray.length > 0" value="qfs">Quarterfinals</v-tab>
            <v-tab v-if="r16Array.length > 0" value="r16">Round of 16</v-tab>
            <v-tab v-if="r32Array.length > 0" value="r32">Round of 32</v-tab>
            <v-tab v-if="r64Array.length > 0" value="r64">Round of 64</v-tab>
            <v-tab v-if="r128Array.length > 0" value="r128">Round of 128</v-tab>
        </v-tabs>
        <v-window v-model="tab" class="mt-5" direction="vertical">
            <v-window-item v-if="finalArray.length > 0" value="final">
                <ResultCard :match="finalArray[0]" />
            </v-window-item>
            <v-window-item v-if="sfArray.length > 0" value="sfs">
                <div class="d-flex flex-row">
                    <ResultCard v-for="match in sfArray" :key="match.id" :match />
                </div>
            </v-window-item>
            <v-window-item v-if="qfArray.length > 0" value="qfs">
                <div class="d-flex flex-row flex-wrap">
                    <ResultCard v-for="match in qfArray" :key="match.id" :match />
                </div>
            </v-window-item>
            <v-window-item v-if="r16Array.length > 0" value="r16">
                <div class="d-flex flex-row flex-wrap">
                    <ResultCard v-for="match in r16Array" :key="match.id" :match />
                </div>
            </v-window-item>
            <v-window-item v-if="r32Array.length > 0" value="r32">
                <div class="d-flex flex-row flex-wrap">
                    <ResultCard v-for="match in r32Array" :key="match.id" :match />
                </div>
            </v-window-item>
            <v-window-item v-if="r64Array.length > 0" value="r64">
                <div class="d-flex flex-row flex-wrap">
                    <ResultCard v-for="match in r64Array" :key="match.id" :match />
                </div>
            </v-window-item>
            <v-window-item v-if="r128Array.length > 0" value="r128">
                <div class="d-flex flex-row flex-wrap">
                    <ResultCard v-for="match in r128Array" :key="match.id" :match />
                </div>
            </v-window-item>
        </v-window>
</template>