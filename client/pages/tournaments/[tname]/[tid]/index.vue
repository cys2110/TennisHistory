<script setup>
import { useChangeCase } from '@vueuse/integrations';

// Route/meta details
definePageMeta({ name: 'tournament' })
const route = useRoute()
const tname = ref(route.params.tname)
const tid = ref(route.params.tid)
useHead({ title: `${useChangeCase(tname.value, 'capitalCase').value}` })

// Breadcrumbs
const links = [
    { label: 'Home', icon: 'i-ph-house-duotone', to: '/' },
    { label: useChangeCase(tname.value, 'capitalCase').value, labelClass: 'font-bold' }
]

// API call
const { data: tournament, status, error } = await useFetch('/api/getTournamentDetails', {
    method: 'GET',
    params: { tid: computed(() => tid.value) }
})
</script>

<template>
    <div>
        <u-breadcrumb :links class="mb-5 hidden md:inline-flex"
            :ui="{ active: 'text-emerald-400', inactive: 'text-emerald-600', base: 'text-emerald-600 text-lg', icon: { base: 'pr-5' }, divider: { base: 'text-zinc-600 dark:text-zinc-400 mx-1 text-base' } }" />
        <page-title>
            <template #heading>
                <div class=" flex gap-3 items-center">
                    <span>{{ useChangeCase(tname, 'capitalCase') }}</span>
                    <Button variant="link" target="_blank" :href="tournament.website">
                        <template #icon>
                            <Icon name="ion:arrow-up-right-box-outline" class="text-base text-emerald-600" />
                        </template>
                    </Button>
                </div>
            </template>
            <template #subtitle v-if="tournament">{{ tournament.years }}</template>
        </page-title>
        <div v-if="tournament && tournament.events.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-5">
            <tournament-card v-for="event in tournament.events" :key="event.eid" :event />
        </div>
        <error-message v-else :status error-icon="material-symbols:error-circle-rounded-outline-sharp">
            <template #loading-message>The tournament details are currently being fetched</template>
            <template #error-message>No tournament details available</template>
        </error-message>
    </div>
</template>