<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { DateTime } from 'luxon';
import EditionService from '@/services/EditionService';
import { formatCurrency } from '../utils';
import type { PlayerDetails, EntriesByPlayer } from '../interfaces';
import ActivityCard from './ActivityCard.vue';

const props = defineProps<{
    player: PlayerDetails
}>()

const selectedYear = ref(props.player.retired ?? DateTime.now().year)

const stats = ref({
    winCount: 0,
    lossCount: 0,
    titles: 0,
    pm: formatCurrency('USD', 0)
})
const results: Ref<EntriesByPlayer[]> = ref([])

const years = computed(() => {
    const retirementYear = props.player.retired ?? DateTime.now().year
    return Array.from({length: retirementYear - props.player.turned_pro + 1}, (_, index) => props.player.turned_pro + index)
})

const getActivity = () => {
    EditionService.getEntriesByPlayer(props.player.id, selectedYear.value)
    .then(response => {
        stats.value.winCount = response.data.wins
        stats.value.lossCount = response.data.losses
        stats.value.titles = response.data.titles
        stats.value.pm = formatCurrency('USD', response.data.pm)
        results.value = response.data.entries.toSorted((a: EntriesByPlayer, b: EntriesByPlayer) => {
            return DateTime.fromISO(a.Edition.end_date) - DateTime.fromISO(b. Edition.end_date)
        })
    })
    .catch(e => console.log(e))
}

onMounted(() => {
    getActivity()
})
</script>

<template>
    <v-sheet class="bg-transparent">
        <v-select
            class="md:w-1/3 lg:w-1/4 text-zinc-300"
            variant="outlined"
            density="compact"
            :items="years"
            v-model="selectedYear"
            @update:model-value="getActivity"
        />
        <div class="flex justify-evenly mx-auto my-5 bg-green-800 rounded-lg text-zinc-300 p-3 text-center">
            <div>
                <div class="font-bold md:text-xl">{{ stats.winCount }}-{{ stats.lossCount }}</div>
                <div class="text-xs md:text-base">WIN-LOSS</div>
            </div>
            <div>
                <div class="font-bold md:text-xl">{{ stats.titles }}</div>
                <div class="text-xs md:text-base">TITLES</div>
            </div>
            <div>
                <div class="font-bold md:text-xl">{{ stats.pm }}</div>
                <div class="text-xs md:text-base">PRIZE MONEY</div>
            </div>
        </div>
        <div v-if="results.length > 0">
            <ActivityCard
                v-for="entry in results"
                :key="entry.id"
                :entry
                :playerId="player.id"
            />
        </div>
        <div
            v-else
            class="text-zinc-400 text-center"
        >
            No data available
        </div>
    </v-sheet>
</template>