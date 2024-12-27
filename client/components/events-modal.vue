<script setup>
import { useChangeCase } from '@vueuse/integrations';

const props = defineProps(['item', 'type'])

const apiRoute = computed(() => {
    switch (props.type) {
        case 'Venues':
            return '/api/getVenueResults'
        default:
            return '/api/getEventsResults'
    }
})

const apiParams = computed(() => {
    switch (props.type) {
        case 'Venues':
            return { name: computed(() => props.item.name), city: computed(() => props.item.city) }
        case 'Surfaces':
            return { id: computed(() => props.item), label: 'Surface', relationship: 'ON_SURFACE' }
        case 'Supervisors':
            return { id: computed(() => props.item), label: 'Supervisor', relationship: 'SUPERVISED' }
        default:
            return {}
    }
})

const { data: events, status, error } = await useFetch(apiRoute.value, {
    method: 'GET',
    params: apiParams.value
})
</script>

<template>
    <div v-if="events" class="grid grid-cols-3 gap-5">
        <div v-for="event in events" :key="event.eid"
            class="p-5 flex items-center justify-center border border-solid border-emerald-600 rounded-xl">
            <NuxtLink class="hover-link text-zinc-300"
                :to="{ name: 'event', params: { tname: useChangeCase(event.name, 'snakeCase').value, tid: event.tid, year: event.year, eid: event.eid } }">
                {{ event.name }} {{ event.year }}
            </NuxtLink>
        </div>
    </div>
</template>