<script setup>
import { useChangeCase } from '@vueuse/integrations';
const props = defineProps(['entries'])

// Table columns
const columns = [
    { key: 'country', sortable: true },
    { key: 'id' },
    { key: 'last', label: 'Player', sortable: true },
    { key: 'seed.low', label: 'Seed', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'rank.low', label: 'Rank', sortable: true }
]
</script>

<template>
    <u-table :rows="entries" :columns
        :ui="{ td: { size: 'text-base', base: 'text-center', padding: 'py-1' }, th: { padding: 'py-1' } }"
        class="mx-auto w-fit">
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
        <template #status-data="{ row }">
            <div v-if="row.status">{{ STATUS_INFO[row.status] }}</div>
        </template>
    </u-table>
</template>

<style scoped>
:deep(thead) {
    @apply bg-violet-800;
}

:deep(th > button > span) {
    @apply font-bold text-base text-zinc-400;
}
</style>