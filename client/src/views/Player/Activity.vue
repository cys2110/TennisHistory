<script setup lang="ts">
import { onMounted, ref, watch, watchEffect, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { getPlayer, getPlayerActivity } from '@/services/PlayerService';
import type { Activity } from '@/utils/interfaces';
import ActivityCard from '@/components/Player/ActivityCard.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string
    name: string
}>()

const selectedYear = ref(DateTime.now().year)
const years = ref([DateTime.now().year])
const tournaments: Ref<Activity[]> = ref([])
const stats = ref({
    win: 0,
    loss: 0,
    titles: 0
})

const updateYears = () => {
    const { query, variables } = getPlayer(props.id)
    const { result, loading, error } = useQuery(query,variables)

    watch(result, (newResult) => {
        if (newResult) {
            selectedYear.value = newResult.players[0].retired?.id || DateTime.now().year
            const retirementYear = newResult.players[0].retired?.id || DateTime.now().year
            years.value = Array.from({length: retirementYear - newResult.players[0].turned_pro.id + 1}, (_, index) => newResult.players[0].turned_pro.id + index)
        }
    })
}

onMounted(() => {
    updateYears()
})

const updateActivity = () => {
    const { query, variables } = getPlayerActivity(props.id, selectedYear.value)
    const { result, loading, error } = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) {
            const results = newResult.players[0]
            stats.value.win = results.scoreWinsAggregate.count
            stats.value.loss = results.scoreLossesAggregate.count
            stats.value.titles = results.titleAggregate.count
            tournaments.value = results.eventsConnection.edges
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
        <div v-if="tournaments.length > 0">
            <ActivityCard
                v-for="event in tournaments"
                :key="event.node.id"
                :event
                :id="id"
                :name="name"
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