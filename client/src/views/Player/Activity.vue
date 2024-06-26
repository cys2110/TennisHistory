<script setup lang="ts">
import { computed, ref, watch, watchEffect, type Ref } from 'vue';
import { DateTime } from 'luxon';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { getPlayerActivity } from '@/services/APICalls';
import type { PlayerActivity, PlayerDetails } from '@/components/interfaces';
import ActivityCard from '@/components/Player/ActivityCard.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    player: PlayerDetails
}>()

const selectedYear = ref(props.player.retired ?? DateTime.now().year)

const stats = ref({
    win: 0,
    loss: 0,
    titles: 0
})
const results: Ref<PlayerActivity[]> = ref([])

const years = computed(() => {
    const retirementYear = props.player.retired ?? DateTime.now().year
    return Array.from({length: retirementYear - props.player.turned_pro.id + 1}, (_, index) => props.player.turned_pro.id + index)
})

const updateActivity = () => {
    const { query, variables } = getPlayerActivity(props.player.id, selectedYear.value)
    const { result, loading, error } = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) {
            stats.value = newResult.players[0].yearStats
            results.value = newResult.players[0].tournaments
        }
    }, {immediate: true})

    watch(error, (newError) => {
        if (newError) {
            console.error(newError)
        }
    })
}

watchEffect(() => {
    updateActivity()
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
        />
        <div class="flex justify-evenly mx-auto my-5 bg-green-800 rounded-lg text-zinc-300 p-3 text-center">
            <div>
                <div class="font-bold md:text-xl">{{ stats.win }}-{{ stats.loss }}</div>
                <div class="text-xs md:text-base">WIN-LOSS</div>
            </div>
            <div>
                <div class="font-bold md:text-xl">{{ stats.titles }}</div>
                <div class="text-xs md:text-base">TITLES</div>
            </div>
        </div>
        <div v-if="results.length > 0">
            <ActivityCard
                v-for="event in results"
                :key="event.id"
                :event
                :playerId="player.id"
                :playerName="player.full_name"
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