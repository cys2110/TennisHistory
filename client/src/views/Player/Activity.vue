<script setup lang="ts">
import { onMounted, ref, watch, watchEffect, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { getPlayerYears, getPlayerActivity } from '@/services/PlayerService';
import type { Activity } from '@/utils/interfaces';
import Loading from '@/components/Global/Loading.vue';
import ActivityCard from '@/components/Player/ActivityCard.vue';

provideApolloClient(apolloClient)

const props = defineProps<{
    id: string
    name: string
}>()
const load: Ref<boolean> = ref(false)

const selectedYear: Ref<number> = ref(DateTime.now().year)
const years: Ref<number[]> = ref([])
const tournaments: Ref<Activity[]> = ref([])
const stats = ref({
    win: 0,
    loss: 0,
    titles: 0
})

const updateYears = () => {
    const { query, variables } = getPlayerYears(props.id)
    const { result, loading, error } = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) {
            const earliest = newResult.players[0].years.earliest
            const latest = newResult.players[0].years.latest
            years.value = Array.from({ length: latest - earliest + 1 }, (_, index) => earliest + index)
            selectedYear.value = latest
        }
    })

    watch(loading, (newLoad) => load.value = newLoad)

    watch(error, (newError) => {
        if (newError) {
            console.error(newError)
        }
    })
}

onMounted(() => updateYears())

const updateActivity = () => {
    load.value = true
    const { query, variables } = getPlayerActivity(props.id, selectedYear.value)
    const { result, loading, error } = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) {
            load.value = false
            const results = newResult.players[0]
            stats.value.win = results.scoreWinsAggregate.count
            stats.value.loss = results.scoreLossesAggregate.count
            stats.value.titles = results.titleAggregate.count
            tournaments.value = results.eventsConnection.edges
        }
    }, { immediate: true })

    watch(loading, (newLoad) => load.value = newLoad)

    watch(error, (newError) => {
        if (newError) {
            load.value = false
            console.error(newError)
        }
    })
}

watchEffect(() => {
    updateActivity()
})
</script>

<template>
    <v-sheet class="bg-transparent w-[100%]">
        <v-select class="md:w-1/3 lg:w-1/4 text-zinc-300" variant="outlined" density="compact" :items="years"
            v-model="selectedYear" />
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
            <template v-for="event in tournaments" :key="event.node.id">
                <ActivityCard v-if="!event.properties.wd" :event :id="id" :name="name" />
            </template>
        </div>
        <Loading v-else :loading="load">
            <template #none>No tournaments played</template>
        </Loading>
    </v-sheet>
</template>