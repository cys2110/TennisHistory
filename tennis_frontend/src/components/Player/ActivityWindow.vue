<script setup>
import EditionService from '@/services/EditionService';
import { computed, onMounted, ref } from 'vue';
import ActivityCard from './ActivityCard.vue';
import { formatCurrency } from '../utils';

const props = defineProps(['player'])

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const results = ref([])
const winCount = ref(null)
const lossCount = ref(null)
const titles = ref(null)
const pm = ref(null)

const years = computed(() => {
    const retirementYear = props.player.retired || currentYear
    return Array.from({ length: retirementYear - props.player.turned_pro + 1}, (_, index) => props.player.turned_pro + index)
})

const getActivity = () => {
    EditionService.getEntriesByPlayer(props.player.id, selectedYear.value)
    .then(response => {
        results.value = response.data.entries
        winCount.value = response.data.wins
        lossCount.value = response.data.losses
        titles.value = response.data.titles
        pm.value = response.data.pm
    })
    .catch(error => console.log(error))
}

onMounted(() => {
    getActivity()
})

</script>

<template>
    <v-sheet class="bg-transparent">
        <v-select
            variant="outlined"
            density="compact"
            class="w-25"
            :items="years"
            v-model="selectedYear"
            @update:model-value="getActivity"
        />
        <div class="d-flex w-75 justify-space-evenly mx-auto my-3 rounded-lg pa-3" style="border: 2px solid #8C9EFF;">
            <div class="d-flex flex-column align-center">
                <div class="font-weight-bold text-h6">{{ winCount ? winCount : 0 }}-{{ lossCount ? lossCount : 0 }}</div>
                <div class="text-subtitle-1">WIN-LOSS</div>
            </div>
            <div class="d-flex flex-column align-center">
                <div class="font-weight-bold text-h6">{{ titles ? titles : 0 }}</div>
                <div class="text-subtitle-1">TITLES</div>
            </div>
            <div class="d-flex flex-column align-center">
                <div class="font-weight-bold text-h6">{{ pm ? formatCurrency('USD', pm) : '$0' }}</div>
                <div class="text-subtitle-1">PRIZE MONEY</div>
            </div>
        </div>

        <div v-if="results.length > 0">
            <ActivityCard v-for="entry in results" :key="entry.id" :entry />
        </div>
        <div v-else class="text-subtitle-1">No data available.</div>
    </v-sheet>
</template>