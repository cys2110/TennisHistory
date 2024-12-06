<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { Grid } from 'ant-design-vue';
import { GET_EVENT } from '@/services/EventService';
import { unencodeName, updateDocumentTitle } from '@/utils/functions';
import { ENTRY_INFO } from '@/utils/variables';

const route = useRoute()
const router = useRouter()
const { name, id, year, eid } = route.params
const { useBreakpoint } = Grid
const screens = useBreakpoint()
const event = ref(null)
const entryInfo = ref([])
const entries = ref(null)
const anchorItems = ref([{ key: 'details', href: '#details', title: 'Details' }])

// Update document title
watch(() => name, () => updateDocumentTitle(`${unencodeName(name)} ${year} | TennisHistory`), { immediate: true })

// Navigate to pages
const navigateTo = (page) => router.push({ name: page })

// API call
const { query, variables } = GET_EVENT(parseInt(eid), eid)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        entries.value = newResult.entries
        event.value = newResult.events[0]
        const sections = ['ldaConnection', 'wdConnection', 'wcConnection', 'qualifiersConnection', 'llsConnection', 'altConnection', 'retConnection', 'woConnection', 'defaultedConnection']
        entryInfo.value = sections.flatMap(section => {
            const data = event.value[section]?.edges;
            return data && data.length > 0 ? [{
                array: data,
                title: ENTRY_INFO[section]
            }] : [];
        })

        // Add additional anchor items
        const additionalAnchorItems = [
            event.value.rounds[0].pm && {
                key: 'pm',
                href: '#awards',
                title: 'Awards'
            },
            event.value.seeds.length > 0 && {
                key: 'seeds',
                href: '#seeds',
                title: 'Seeds'
            },
            entryInfo.value.length > 0 && {
                key: 'info',
                href: '#entry-info',
                title: 'Entry Information'
            },
            {
                key: 'entries',
                href: '#entries',
                title: 'Entries'
            }
        ]
        anchorItems.value = [...anchorItems.value, ...additionalAnchorItems.filter(Boolean)]
    }
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
    <a-row v-if="event" justify="space-evenly" :gutter="32">
        <a-col :span="4" v-if="screens.sm">
            <a-anchor :items="anchorItems" :offset-top=75 />
        </a-col>
        <a-col :xs="20" :span="24">
            <div v-if="screens.xs" class="flex justify-evenly my-5">
                <a-button @click="navigateTo('results')" class="!border-violet-700">Results</a-button>
                <a-button @click="navigateTo('draw')" class="!border-violet-700">Draw</a-button>
            </div>
            <EventOverview :event />
            <PrizeMoney :rounds="event.rounds" :currency="event.currency" />
            <Seeds :seeds="event.seeds" />
            <EntryInfo :entryInfo />
            <Entries :entries />
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No data available</template>
    </Loading>
</template>