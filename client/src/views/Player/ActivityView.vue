<script setup>
import { ref, watch, watchEffect } from 'vue';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import apolloClient from '@/apollo';
import { DateTime } from 'luxon';
import { unencodeName } from '@/utils/functions';
import { GET_ACTIVITY } from '@/services/PlayerService';

// Variables
const props = defineProps(['name', 'id'])
const load = ref(false)
const selectedYear = ref(DateTime.now().year)
const years = ref([])
const anchorItems = ref([])
const events = ref(null)

// Update document title
const updateDocumentTitle = () => document.title = `Activity | ${unencodeName(props.name)} | TennisHistory`
watch(() => props.name, () => {
    updateDocumentTitle()
}, { immediate: true })

// API call
provideApolloClient(apolloClient)
const updateActivity = () => {
    // Fix order of events
    load.value = true
    const { query, variables } = GET_ACTIVITY(props.id, selectedYear.value)
    const { result, loading, error } = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) {
            const earliest = newResult.players[0].years.earliest
            const latest = newResult.players[0].years.latest
            years.value = Array.from({ length: latest - earliest + 1 }, (_, index) => ({ label: earliest + index, value: earliest + index }))
            selectedYear.value = latest
            events.value = newResult.players[0].entries
            anchorItems.value = newResult.players[0].entries.map(entry => ({
                key: entry.scores[0].match.round.event.id,
                href: `#${entry.scores[0].match.round.event.tournament.name}`,
                title: entry.scores[0].match.round.event.tournament.name
            }))
        }
    }, { immediate: true })

    watch(loading, (newLoad) => load.value = newLoad)

    watch(error, (newError) => {
        if (newError) console.error(newError)
    })
}

watchEffect(() => {
    updateActivity()
})
</script>

<template>
    <a-row align="middle">
        <a-col :span="21">
            <Title>
                <template #title>{{ unencodeName(name) }}</template>
                <template #subtitle>Activity</template>
            </Title>
        </a-col>
        <a-col :span="3">
            <a-select :options="years" v-model:value="selectedYear" class="w-full" size="large" />
        </a-col>
    </a-row>
    <a-row v-if="events">
        <a-col :span="4">
            <a-config-provider :theme="{ components: { Anchor: { colorPrimary: '#6d28d9' } } }">
                <a-anchor :items="anchorItems" :offset-top="75" />
            </a-config-provider>
        </a-col>
        <!--[TODO: INCLUDE YEAR STATS]-->
        <a-col :span="20">
            <ActivityCard v-for="event in events" :key="event.scores[0].match.round.event.id" :event :name :id />
        </a-col>
    </a-row>
    <Loading v-else :load>
        <template #none>No events played</template>
    </Loading>
</template>