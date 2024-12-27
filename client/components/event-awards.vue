<script setup>
import { breakpointsTailwind } from '@vueuse/core';

const emits = defineEmits(['update:showMessage'])
const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)
const eid = ref(route.params.eid)
const visible = ref(false)
const mediumScreenUp = breakpoints.greaterOrEqual('md')

// API call
const { data: rounds, status, error } = await useFetch('/api/getEventAwards', {
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
    { key: 'round', label: 'Round' },
    { key: 'pm', label: 'Prize Money' },
    { key: 'points.low', label: 'Points' },
]
</script>

<template>
    <Fieldset v-if="rounds" id="awards" legend="Awards" class="my-10 px-10 w-full">
        <div v-if="mediumScreenUp" class="w-full flex justify-end mb-3">
            <toggle-button v-model="visible" size="small">
                <template #icon>
                    <Icon :name="visible ? 'ph:table-duotone' : 'ph:chart-scatter-duotone'" class="text-2xl" />
                </template>
            </toggle-button>
            <Dialog v-model:visible="visible" modal header="Awards" class="w-3/4">
                <event-awards-chart :rounds />
            </Dialog>
        </div>
        <u-table v-if="!visible" :rows="rounds" :columns class="w-fit mx-auto"
            :ui="{ th: { size: 'text-base', color: 'text-zinc-400', padding: 'py-1' }, td: { size: 'text-base', base: 'text-center', padding: 'py-1' } }">
            <template #pm-data="{ row }">
                {{ CURRENCIES[row.currency] }}{{ row.pm.low.toLocaleString('en-GB') }}
            </template>
        </u-table>
    </Fieldset>
</template>

<style scoped>
:deep(thead) {
    @apply bg-violet-800;
}

:deep(th > span) {
    @apply font-bold;
}
</style>