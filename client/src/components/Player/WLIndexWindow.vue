<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import type { WLIndex } from '../interfaces';
import PlayerService from '@/services/PlayerService';
import WLIndexItem from './WLIndexItem.vue';

const props = defineProps<{
    id: string
}>()
const index: Ref<WLIndex | null> = ref(null)

const tbWins = computed(() => {})

onMounted(() => {
    PlayerService.getPlayerIndex(props.id)
    .then(response => index.value = response.data[0])
    .catch(e => console.log(e))
})
</script>

<template>
    <v-container v-if="index">
        <v-row class="mb-2">
            <v-col>
                <div class="font-bold text-uppercase text-center">Match Record</div>
            </v-col>
            <v-divider thickness="3"/>
        </v-row>
        <WLIndexItem :win="index.overallWins" :total="index.overallTotal" :titles="index.overallTitles">
            <template #metric>Overall</template>
        </WLIndexItem>
        <WLIndexItem :win="index.gsWins" :total="index.gsTotal" :titles="index.gsTitles">
            <template #metric>Grand Slams</template>
        </WLIndexItem>
        <WLIndexItem :win="index.mastersWins" :total="index.mastersTotal" :titles="index.mastersTitles">
            <template #metric>ATP Masters 1000</template>
        </WLIndexItem>
        <v-row class="my-2">
            <v-col>
                <div class="font-bold text-uppercase text-center">Pressure Points</div>
            </v-col>
            <v-divider thickness="3"/>
        </v-row>
        <WLIndexItem :win="(+index.p1tb1Wins) + (+index.p1tb2Wins) + (+index.p1tb3Wins) + (+index.p1tb4Wins) + (+index.p1tb5Wins) + (+index.p2tb1Wins) + (+index.p2tb2Wins) + (+index.p2tb3Wins) + (+index.p2tb4Wins) + (+index.p2tb5Wins)" :total="(+index.total1Tbs) + (+index.total2Tbs) + (+index.total3Tbs) + (+index.total4Tbs) + (+index.total5Tbs)">
            <template #metric>Tiebreaks</template>
        </WLIndexItem>
        <WLIndexItem :win="(+index.v10Wins1) + (+index.v10Wins2)" :total="(+index.v10Total1) + (+index.v10Total2)">
            <template #metric>Tiebreaks</template>
        </WLIndexItem>
        <WLIndexItem :win="index.overallTitles" :total="index.finalsTotal">
            <template #metric>Finals</template>
        </WLIndexItem>
        <WLIndexItem :win="index.decidersWins" :total="index.decidersTotal">
            <template #metric>Deciding set</template>
        </WLIndexItem>
        <WLIndexItem :win="index.set5Wins" :total="index.set5Total">
            <template #metric>5th set record</template>
        </WLIndexItem>
        <v-row class="my-2">
            <v-col>
                <div class="font-bold text-uppercase text-center">Environment</div>
            </v-col>
            <v-divider thickness="3"/>
        </v-row>
        <WLIndexItem :win="index.clayWins" :total="index.clayTotal" :titles="index.clayTitles">
            <template #metric>Clay</template>
        </WLIndexItem>
        <WLIndexItem :win="index.grassWins" :total="index.grassTotal" :titles="index.grassTitles">
            <template #metric>Grass</template>
        </WLIndexItem>
        <WLIndexItem :win="index.hardWins" :total="index.hardTotal" :titles="index.hardTitles">
            <template #metric>Hard</template>
        </WLIndexItem>
        <WLIndexItem :win="index.carpetWins" :total="index.carpetTotal" :titles="index.carpetTitles">
            <template #metric>Carpet**</template>
        </WLIndexItem>
        <WLIndexItem :win="index.indoorWins" :total="index.indoorTotal" :titles="index.indoorTitles">
            <template #metric>Indoor</template>
        </WLIndexItem>
        <WLIndexItem :win="index.outdoorWins" :total="index.outdoorTotal" :titles="index.outdoorTitles">
            <template #metric>Outdoor</template>
        </WLIndexItem>
        <v-row class="my-2">
            <v-col>
                <div class="font-bold text-uppercase text-center">Other</div>
            </v-col>
            <v-divider thickness="3"/>
        </v-row>
        <WLIndexItem :win="index.win1Wins" :total="index.win1Total">
            <template #metric>After winning 1st set</template>
        </WLIndexItem>
        <WLIndexItem :win="index.lose1Wins" :total="index.lose1Total">
            <template #metric>After losing 1st set</template>
        </WLIndexItem>
        <WLIndexItem :win="(+index.rhWins1) + (+index.rhWins2)" :total="(+index.rhTotal1) + (+index.rhTotal2)">
            <template #metric>vs. right-handers</template>
        </WLIndexItem>
        <WLIndexItem :win="(+index.lhWins1) + (+index.lhWins2)" :total="(+index.lhTotal1) + (+index.lhTotal2)">
            <template #metric>vs. left-handers</template>
        </WLIndexItem>
    </v-container>
    <div v-else class="text-zinc-300">No data available</div>
</template>