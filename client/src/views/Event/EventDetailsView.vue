<script setup>
import { ref, watch } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { unencodeName } from '@/utils/functions';
import { GET_EVENT } from '@/services/EventService';
import { ENTRY_INFO } from '@/utils/variables';

const props = defineProps(['name', 'id', 'year', 'eid'])
const event = ref(null)
const entryInfo = ref([])
const entries = ref(null)
const anchorItems = ref([
    {
        key: 'details',
        href: '#details',
        title: 'Details'
    }
])

const updateDocumentTitle = () => document.title = `${unencodeName(props.name)} ${props.year} | TennisHistory`
watch(() => props.name, () => {
    updateDocumentTitle()
}, { immediate: true })

provideApolloClient(apolloClient)
const { query, variables } = GET_EVENT(parseInt(props.eid), props.eid)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        entries.value = newResult.entries
        event.value = newResult.events[0]
        const sections = ['ldaConnection', 'lls', 'alts', 'wdConnection', 'retConnection', 'woConnection', 'defaultedConnection']
        entryInfo.value = sections.flatMap(section => {
            const data = event.value[section]?.edges;
            return data && data.length > 0 ? [{
                array: data,
                title: ENTRY_INFO[section]
            }] : [];
        })
        if (event.value.rounds[0].pm) {
            anchorItems.value.push(
                {
                    key: 'pm',
                    href: '#awards',
                    title: 'Awards'
                })
        }
        if (event.value.seeds.length > 0) {
            anchorItems.value.push(
                {
                    key: 'seeds',
                    href: '#seeds',
                    title: 'Seeds'
                })
        }
        if (entryInfo.value.length > 0) {
            anchorItems.value.push({
                key: 'info',
                href: '#entry-info',
                title: 'Entry Information'
            },)
        }
        anchorItems.value.push({
            key: 'entries',
            href: '#entries',
            title: 'Entries'
        })
    }
    if (newResult) console.log(newResult.events[0])
}, { immediate: true })

watch(error, (newError) => {
    if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
    <!--[ADD EVENT BREADCRUMBS]-->
    <Title>
        <template #title>{{ unencodeName(name) }} {{ year }}</template>
        <template #subtitle>Event Details</template>
    </Title>
    <a-row v-if="event" justify="space-evenly" :gutter="32">
        <a-col :span=4>
            <a-config-provider :theme="{ components: { Anchor: { colorPrimary: '#6d28d9' } } }">
                <a-anchor :items="anchorItems" :offset-top=75 />
            </a-config-provider>
        </a-col>
        <a-col :span=20>
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