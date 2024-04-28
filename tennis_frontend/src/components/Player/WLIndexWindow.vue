<script setup>
import IndexItem from '@/components/Player/IndexItem.vue';
import PlayerService from '@/services/PlayerService';
import { onMounted, ref } from 'vue';

const props = defineProps(['id'])
const index = ref(null)

onMounted(() => {
    PlayerService.getPlayerIndex(props.id)
    .then(response => {
        index.value = response.data[0]
    } )
    .catch(error => console.log(error))
})
</script>

<template>
    <v-container class="w-75" v-if="index">
        <v-row>
            <v-col class="bg-indigo-darken-4 rounded-t-xl">
                <div class="text-h6 text-center font-weight-bold">Match Record</div>
            </v-col>
        </v-row>
        <IndexItem :win="index.overallWins" :total="index.overallTotal">
            <template #metric>Overall</template>
            <template #titles> ({{ index.overallTitles }} <span>{{ index.overallTitles === 1 ? 'title' : 'titles' }}</span>)</template>
        </IndexItem>
        <IndexItem :win="index.gsWins" :total="index.gsTotal">
            <template #metric>Grand Slams</template>
            <template #titles> ({{ index.gsTitles }} <span>{{ index.gsTitles === 1 ? 'title' : 'titles' }}</span>)</template>
        </IndexItem>
        <IndexItem :win="index.mastersWins" :total="index.mastersTotal">
            <template #metric>ATP Masters 1000</template>
            <template #titles> ({{ index.mastersTitles }} <span>{{ index.mastersTitles === 1 ? 'title' : 'titles'}}</span>)</template>
        </IndexItem>
        <v-row>
            <v-col class="bg-indigo-darken-4">
                <div class="text-h6 text-center font-weight-bold">Pressure points</div>
            </v-col>
        </v-row>
        <IndexItem :win="parseInt(index.p1tb1Wins) + parseInt(index.p1tb2Wins) + parseInt(index.p1tb3Wins) + parseInt(index.p1tb4Wins) + parseInt(index.p1tb5Wins) + parseInt(index.p2tb1Wins) + parseInt(index.p2tb2Wins) + parseInt(index.p2tb3Wins) + parseInt(index.p2tb4Wins) + parseInt(index.p2tb5Wins)" :total="parseInt(index.total1Tbs) + parseInt(index.total2Tbs) + parseInt(index.total3Tbs) + parseInt(index.total4Tbs) + parseInt(index.total5Tbs)">
            <template #metric>Tiebreaks</template>
        </IndexItem>
        <IndexItem :win="parseInt(index.v10Wins1) + parseInt(index.v10Wins2)" :total="parseInt(index.v10Total1) + parseInt(index.v10Total2)">
            <template #metric>Versus Top 10</template>
        </IndexItem>
        <IndexItem :win="index.overallTitles" :total="index.finalsTotal">
            <template #metric>Finals</template>
        </IndexItem>
        <IndexItem :win="index.decidersWins" :total="index.decidersTotal">
            <template #metric>Deciding set</template>
        </IndexItem>
        <IndexItem :win="index.set5Wins" :total="index.set5Total">
            <template #metric>5th set record</template>
        </IndexItem>
        <v-row>
            <v-col class="bg-indigo-darken-4">
                <div class="text-h6 text-center font-weight-bold">Environment</div>
            </v-col>
        </v-row>
        <IndexItem :win="index.clayWins" :total="index.clayTotal">
            <template #metric>Clay</template>
            <template #titles> ({{ index.clayTitles }} <span>{{ index.clayTitles === 1 ? 'title' : 'titles' }}</span>)</template>
        </IndexItem>
        <IndexItem :win="index.grassWins" :total="index.grassTotal">
            <template #metric>Grass</template>
            <template #titles> ({{ index.grassTitles }} <span>{{ index.grassTitles === 1 ? 'title' : 'titles' }}</span>)</template>
        </IndexItem>
        <IndexItem :win="index.hardWins" :total="index.hardTotal">
            <template #metric>Hard</template>
            <template #titles> ({{ index.hardTitles }} <span>{{ index.hardTitles === 1 ? 'title' : 'titles' }}</span>)</template>
        </IndexItem>
        <IndexItem :win="index.carpetWins" :total="index.carpetTotal">
            <template #metric>Carpet**</template>
            <template #titles> ({{ index.carpetTitles }} <span>{{ index.carpetTitles === 1 ? 'title' : 'titles' }}</span>)</template>
        </IndexItem>
        <IndexItem :win="index.indoorWins" :total="index.indoorTotal">
            <template #metric>Indoor</template>
            <template #titles> ({{ index.indoorTitles }} <span>{{ index.indoorTitles === 1 ? 'title' : 'titles' }}</span>)</template>
        </IndexItem>
        <IndexItem :win="index.outdoorWins" :total="index.outdoorTotal">
            <template #metric>Outdoor</template>
            <template #titles> ({{ index.outdoorTitles }} <span>{{ index.outdoorTitles === 1 ? 'title' : 'titles' }}</span>)</template>
        </IndexItem>
        <v-row>
            <v-col class="bg-indigo-darken-4">
                <div class="text-h6 text-center font-weight-bold">Other</div>
            </v-col>
        </v-row>
        <IndexItem :win="index.win1Wins" :total="index.win1Total">
            <template #metric>After winning 1st set</template>
        </IndexItem>
        <IndexItem :win="index.lose1Wins" :total="index.lose1Total">
            <template #metric>After losing 1st set</template>
        </IndexItem>
        <IndexItem :win="parseInt(index.rhWins1) + parseInt(index.rhWins2)" :total="parseInt(index.rhTotal1) + parseInt(index.rhTotal2)">
            <template #metric>vs. right-handers</template>
        </IndexItem>
        <IndexItem :win="parseInt(index.lhWins1) + parseInt(index.lhWins2)" :total="parseInt(index.lhTotal1) + parseInt(index.lhTotal2)">
            <template #metric>vs. left-handers</template>
        </IndexItem>
    </v-container>
</template>