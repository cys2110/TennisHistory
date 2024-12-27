<script setup>
import { useChangeCase } from '@vueuse/integrations';

definePageMeta({ name: 'match' })

const route = useRoute()
const tname = ref(route.params.tname)
const year = ref(route.params.year)
const mid = ref(route.params.mid)
const eid = ref(route.params.eid)
const pointStats = ref([])

const { data: match, status, error } = await useFetch('/api/getMatchDetails', {
    method: 'GET',
    params: { mid: computed(() => mid.value), eid: computed(() => eid.value) },
    onResponse({ response }) {
        useHead({ title: `${response._data.p1_name} v. ${response._data.p2_name} | ${useChangeCase(tname.value, 'capitalCase').value} ${year.value}` })
        pointStats.value = [response._data.service_stats, response._data.return, response._data.points_extra, response._data.points]
    }
})

const matchBreadcrumbs = computed(() => {
    if (match.value) {
        return [{ label: match.value.round }, { label: `${match.value.p1_name} v. ${match.value.p2_name}` }]
    }
    return []
})

// Breadcrumbs
const links = [
    { label: 'Home', icon: 'i-ph-house-duotone', to: '/' },
    { label: useChangeCase(tname.value, 'capitalCase').value, to: { name: 'tournament' } },
    { label: year.value, icon: 'i-ph-calendar-dots-duotone', to: { name: 'event' } }, ...matchBreadcrumbs.value
]
</script>

<template>
    <div>
        <div v-if="match">
            <u-breadcrumb :links class="mb-5"
                :ui="{ active: 'text-emerald-400', inactive: 'text-emerald-600', base: 'text-emerald-600 text-lg', divider: { base: 'text-zinc-400' } }" />
            <page-title>
                <template #heading v-if="match">{{ match.p1_name }} v. {{ match.p2_name }}</template>
                <template #subtitle>{{ useChangeCase(tname, 'capitalCase').value }} {{ year }}</template>
            </page-title>
            <Tabs value="0">
                <TabList>
                    <Tab value="0">Details</Tab>
                    <Tab value="1">Service Stats</Tab>
                    <Tab value="2">Return Stats</Tab>
                    <Tab value="3">Points Stats</Tab>
                    <Tab v-if="match.service_speed" value="4">Service Speed</Tab>
                </TabList>
                <TabPanels>
                    <match-details :match />
                    <match-stats-panel v-for="(stat, index) in pointStats" :key="index" :stats="stat"
                        :p1_name="match.p1_name" :p1_id="match.p1_id" :p2_name="match.p2_name" :p2_id="match.p2_id"
                        :tabValue="(index + 1).toString()" />
                    <service-speed v-if="match.service_speed" :stats="match.service_speed" :p1_name="match.p1_name"
                        :p1_id="match.p1_id" :p2_name="match.p2_name" :p2_id="match.p2_id" />
                </TabPanels>
            </Tabs>
            <div class="text-zinc-300">{{ match }}</div>
        </div>
        <div v-else>
            <Message size="large" :severity="status === 'pending' ? 'info' : 'warn'" variant="outlined" class="mt-5">
                <template #icon>
                    <Icon
                        :name="status === 'pending' ? 'line-md:loading-twotone-loop' : 'material-symbols:error-circle-rounded-outline-sharp'"
                        class="text-2xl" />
                </template>
                <span v-if="status === 'pending'" class="ml-2">Match stats are currently being fetched</span>
                <span v-else class="ml-2">No match stats available.</span>
            </Message>
        </div>
    </div>
</template>