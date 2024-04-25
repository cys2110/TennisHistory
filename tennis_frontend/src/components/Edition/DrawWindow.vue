<script setup>
import DrawCard from '@/components/Edition/DrawCard.vue';
import { ref } from 'vue';

const props = defineProps(['edition', 'matches'])

const sortedMatches = props.matches.toSorted((a, b) => {
  return a.id - b.id
})
const finalArray = sortedMatches.filter(match => match.round === 'F')
const sfArray = sortedMatches.filter(match => match.round === 'SF')
const qfArray = sortedMatches.filter(match => match.round === 'QF')
const r16Array = sortedMatches.filter(match => match.round === '16')
const r32Array = sortedMatches.filter(match => match.round === '32')
const r64Array = sortedMatches.filter(match => match.round === '64')
const r128Array = sortedMatches.filter(match => match.round === '128')
const selectedRound = ref(parseInt(props.edition.type_of_draw))
</script>

<template>
  <v-container>
    <v-row>
      <v-col class="d-flex align-center justify-center">
        <v-btn-toggle v-model="selectedRound" color="indigo-accent-3" variant="elevated">
        <v-btn v-if="edition.type_of_draw === '128'" value="128" rounded="circle">R128</v-btn>
        <v-btn v-if="edition.type_of_draw === '64' || edition.type_of_draw === '128'" value="64" rounded="circle">R64</v-btn>
        <v-btn value="32" rounded="circle">R32</v-btn>
        <v-btn value="16" rounded="circle">R16</v-btn>
        <v-btn value="8" rounded="circle">QF</v-btn>
        <v-btn value="4" rounded="circle">SF</v-btn>
        <v-btn value="2" rounded="circle">F</v-btn>
      </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row class="overflow-x-auto">
      <v-col cols="4" class="d-flex flex-column justify-space-around" v-if="edition.type_of_draw === '128' && selectedRound >= 128">
        <DrawCard v-for="match in r128Array" :key="match.id" :match="match" />
      </v-col>
      <v-col cols="4" class="d-flex flex-column justify-space-around" v-if="(edition.type_of_draw === '128' || edition.type_of_draw === '64') && selectedRound >= 64">
        <DrawCard v-for="match in r64Array" :key="match.id" :match="match" />
      </v-col>
      <v-col cols="4" class="d-flex flex-column justify-space-around" v-if="selectedRound >= 32">
        <DrawCard v-for="match in r32Array" :key="match.id" :match="match" />
      </v-col>
      <v-col cols="4" class="d-flex flex-column justify-space-around" v-if="selectedRound >= 16">
        <DrawCard v-for="match in r16Array" :key="match.id" :match="match" />
      </v-col>
      <v-col cols="4" class="d-flex flex-column justify-space-around" v-if="selectedRound >=8">
        <DrawCard v-for="match in qfArray" :key="match.id" :match="match" />
      </v-col>
      <v-col cols="4" class="d-flex flex-column justify-space-around" v-if="selectedRound >= 4">
        <DrawCard v-for="match in sfArray" :key="match.id" :match="match" />
      </v-col>
      <v-col cols="4" class="d-flex flex-column justify-space-around" v-if="selectedRound >=2">
        <DrawCard v-for="match in finalArray" :key="match.id" :match="match" />
      </v-col>
    </v-row>
  </v-container>
</template>