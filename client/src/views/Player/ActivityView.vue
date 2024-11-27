<script setup>
import { ref, watch } from 'vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { GET_ACTIVITY } from '@/services/PlayerService';
import { unencodeName, updateDocumentTitle } from '@/utils/functions';
import { COLOURS } from '@/utils/variables';

// [FUTURE: ADD FILTER BY TOURNAMENT TYPE]

const route = useRoute()

// Variables
const props = defineProps(['name', 'id'])
const selectedYear = ref(route.query.year ? parseInt(route.query.year) : DateTime.now().year)
const years = ref([])
const stats = ref(null)
const anchorItems = ref([])
const events = ref(null)

// Update document title
watch(() => props.name, () => updateDocumentTitle(`Activity | ${unencodeName(props.name)} | TennisHistory`), { immediate: true })

const handleSelection = () => router.push({ query: { year: selectedYear.value } })

// API call
const { query, variables } = GET_ACTIVITY(props.id, selectedYear.value)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        // Set years in dropdown
        const earliest = newResult.players[0].years.earliest
        const latest = newResult.players[0].years.latest
        years.value = Array.from({ length: latest - earliest + 1 }, (_, index) => ({ label: earliest + index, value: earliest + index }))
        selectedYear.value = latest

        // Set stats
        stats.value = [{ Wins: newResult.yearStats.wins, Losses: newResult.yearStats.losses, Titles: newResult.yearStats.titles }]

        // Sort events by date and scores by match number
        const sortedEntries = [...newResult.players[0].entries]
            .map(entry => ({
                ...entry, scores: [...entry.scores].sort((a, b) => b.match.match_no - a.match.match_no)
            }))
            .sort((a, b) => {
                const dateA = new Date(a.scores[0].match.round.event.start_date)
                const dateB = new Date(b.scores[0].match.round.event.start_date)
                return dateA - dateB
            })
        events.value = sortedEntries

        // Set anchor links
        anchorItems.value = events.value.map(entry => ({
            key: entry.scores[0].match.round.event.id,
            href: `#${entry.scores[0].match.round.event.tournament.name}`,
            title: entry.scores[0].match.round.event.tournament.name
        }))
    }
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
    <div class="flex justify-end">
        <a-select :options="years" v-model:value="selectedYear" size="large" @change="handleSelection" />
    </div>
    <a-row v-if="events">
        <a-col :span="4">
            <a-anchor :items="anchorItems" :offset-top="75" />
        </a-col>
        <a-col :span="20" class="p-5">
            <a-row class="flex justify-evenly mb-5">
                <a-col :span="7" v-for="(value, key) in stats[0]" :key="key">
                    <a-config-provider :theme="{ components: { Card: { colorBgContainer: COLOURS.green800 } } }">
                        <a-card class="text-center"><a-statistic :title="key" :value /></a-card>
                    </a-config-provider>
                </a-col>
            </a-row>
            <a-space direction="vertical" size="large">
                <ActivityCard v-for="event in events" :key="event.scores[0].match.round.event.id" :event :name :id />
            </a-space>
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No events played</template>
    </Loading>
</template>