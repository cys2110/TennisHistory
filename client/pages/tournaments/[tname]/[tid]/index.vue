<script setup>
import { useChangeCase } from '@vueuse/integrations';
definePageMeta({ name: 'tournament' })
const route = useRoute()
const tname = ref(route.params.tname)
const tid = ref(route.params.tid)
useHead({ title: `${useChangeCase(tname.value, 'capitalCase').value}` })

// Breadcrumbs
const links = [
    { label: 'Home', icon: 'i-ph-house-duotone', to: '/' },
    { label: useChangeCase(tname.value, 'capitalCase').value }
]

// API call
const { data: tournament, status, error } = await useFetch('/api/getTournamentDetails', {
    method: 'GET',
    params: { tid: computed(() => tid.value) }
})

const years = computed(() => {
    if (tournament.value.established && tournament.value.abolished) {
        if (tournament.value.established.low === tournament.value.abolished.low) {
            return tournament.value.established.low
        } else {
            return `${tournament.value.established.low} — ${tournament.value.abolished.low}`
        }
    } else if (tournament.value.established) {
        return `${tournament.value.established.low} - present`
    } else {
        return null
    }
})
</script>

<template>
    <div>
        <u-breadcrumb :links class="mb-5"
            :ui="{ active: 'text-emerald-400', inactive: 'text-emerald-600', base: 'text-emerald-600 text-lg', divider: { base: 'text-zinc-400' } }" />
        <page-title>
            <template #heading>
                <div class="flex gap-3 items-center">
                    <span>{{ useChangeCase(tname, 'capitalCase') }}</span>
                    <Button variant="link" target="_blank" :href="tournament.website">
                        <template #icon>
                            <Icon name="ion:arrow-up-right-box-outline" class="text-base text-emerald-600" />
                        </template>
                    </Button>
                </div>
            </template>
            <template #subtitle v-if="tournament">{{ years }}</template>
        </page-title>
        <div v-if="tournament && tournament.events.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-5">
            <tournament-card v-for="event in tournament.events" :key="event.eid" :event />
        </div>
        <div v-else>
            <Message size="large" :severity="status === 'pending' ? 'info' : 'warn'" variant="outlined" class="mt-5">
                <template #icon>
                    <Icon
                        :name="status === 'pending' ? 'line-md:loading-twotone-loop' : 'material-symbols:error-circle-rounded-outline-sharp'"
                        class="text-2xl" />
                </template>
                <span v-if="status === 'pending'" class="ml-2">The tournament details are currently being fetched</span>
                <span v-else class="ml-2">No tournament data available</span>
            </Message>
        </div>
    </div>
</template>