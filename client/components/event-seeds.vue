<script setup>
import { breakpointsTailwind } from '@vueuse/core';
import { useChangeCase } from '@vueuse/integrations';

const emits = defineEmits(['update:showMessage'])
const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)
const eid = ref(route.params.eid)
const visible = ref(false)
const mediumScreenUp = breakpoints.greaterOrEqual('md')

// API call
const { data: seeds, status, error } = await useFetch('/api/getEventSeeds', {
    method: 'GET',
    params: { eid: computed(() => eid.value) },
    onResponse({ response }) {
        if (response.status === 204) emits('update:showMessage', 'success')
    },
    onResponseError({ error }) {
        if (error) emits('update:showMessage', 'error')
    }
})

watch(status, (newStatus) => {
    if (newStatus === 'pending') {
        emits('update:showMessage', 'pending')
    } else if (newStatus === 'success') {
        emits('update:showMessage', false)
    } else {
        emits('update:showMessage', 'error')
    }
})

// Table columns
const columns = [
    { key: 'seed.low', label: 'Seed', sortable: true },
    { key: 'country' },
    { key: 'id' },
    { key: 'last', label: 'Player', sortable: true },
    { key: 'rank.low', label: 'Rank', sortable: true }
]
</script>

<template>
    <Fieldset v-if="seeds" id="seeds" legend="Seeds" class="my-10 px-10 w-fit">
        <div v-if="mediumScreenUp" class="w-full flex justify-end mb-3">
            <toggle-button v-model="visible" size="small">
                <template #icon>
                    <Icon :name="visible ? 'ph:table-duotone' : 'material-symbols:bar-chart-4-bars-rounded'"
                        class="text-2xl" />
                </template>
            </toggle-button>
            <Dialog v-model:visible="visible" modal header="Seeds" class="w-3/4">
                <event-seeds-chart :seeds />
            </Dialog>
        </div>
        <u-table v-if="!visible" :rows="seeds" :columns
            :ui="{ td: { size: 'text-base', base: 'text-center', padding: 'py-1' } }">
            <template #country-data="{ row }">
                <Icon v-if="getCountryCode(row.country)" :name="`flag:${getCountryCode(row.country).toLowerCase()}-4x3`"
                    class="text-base" />
                <component v-else :is="`Icons${row.country}`" />
            </template>
            <template #id-data="{ row }">
                <Avatar class="my-1" :image="`https://www.atptour.com/-/media/alias/player-headshot/${row.id}`"
                    shape="circle" />
            </template>
            <template #last-data="{ row }">
                <div class="flex justify-center">
                    <NuxtLink class="hover-link"
                        :to="{ name: 'player', params: { pid: row.id, pname: useChangeCase(row.name, 'snakeCase').value } }">
                        {{ row.name }}</NuxtLink>
                </div>
            </template>
        </u-table>
    </Fieldset>
</template>

<style scoped>
:deep(thead) {
    @apply bg-violet-800;
}

:deep(th > button > span) {
    @apply font-bold text-base text-zinc-400;
}
</style>