<script setup>
import { ref, watch, watchEffect } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { GET_ARCHIVE } from '@/services/EventService';

// Update document title
document.title = 'Results Archive | TennisHistory'

// Variables
const years = [{ label: 2018, value: 2018 }, { label: 2024, value: 2024 }]
const searchYear = ref(DateTime.now().year)
const events = ref([])
const load = ref(false)

// API call
const updateResults = () => {
    load.value = true
    const { query, variables } = GET_ARCHIVE(searchYear.value)
    const { result, loading, error } = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) {
            events.value = newResult.events
            load.value = false
        }
    }, { immediate: true })

    watch(loading, (newLoad) => load.value = newLoad, { immediate: true })

    watch(error, (newError) => {
        if (newError) console.error(newError)
    }, { immediate: true })
}

watchEffect(() => updateResults())
</script>

<template>
    <a-row align="middle" justify="space-between" class="mb-5">
        <a-col :xs=24 :sm=20 :xl=22>
            <Title>
                <template #title>Results Archive</template>
            </Title>
        </a-col>
        <a-col :xs=24 :sm=4 :xl=2>
            <a-select show-search :options="years" v-model:value="searchYear" size="large" class="w-full text-center" />
        </a-col>
    </a-row>
    <a-row v-if="events.length > 0" justify="space-evenly" align="stretch" :gutter="[0, 32]">
        <a-col v-for="event in events" :key="event.id" :xs="24" :sm="11" :md="7" :xl="5">
            <EventCard :event />
        </a-col>
    </a-row>
    <Loading v-else :loading="load">
        <template #none>No tournaments played</template>
    </Loading>
</template>