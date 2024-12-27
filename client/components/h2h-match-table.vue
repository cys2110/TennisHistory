<script setup>
import { useChangeCase } from '@vueuse/integrations';
const props = defineProps(['matches'])

const columns = [
    { key: 'year', label: 'Year', sortable: true },
    { key: 'winner', label: 'Winner', sortable: true },
    { key: 'tname', label: 'Event', sortable: true },
    { key: 'round', label: 'Round', sortable: true },
    { key: 'surface', label: 'Surface', sortable: true },
    { key: 's1', label: 'Score' }
]
</script>

<template>
    <u-table :rows="matches" :columns
        :ui="{ td: { base: 'text-center text-zinc-400', padding: 'py-1' }, th: { padding: 'py-1' } }"
        class="mx-auto w-fit">
        <template #year-data="{ row }">
            <NuxtLink class="hover-link text-zinc-300"
                :to="`/tournaments/${useChangeCase(row.tname, 'snakeCase').value}/${row.tid}/${row.year}/${row.eid}`">{{
                    row.year }}</NuxtLink>
        </template>
        <template #winner-data="{ row }">
            <Avatar :image="`https://www.atptour.com/-/media/alias/player-headshot/${row.winner}`" shape="circle" />
        </template>
        <template #tname-data="{ row }">
            <NuxtLink class="hover-link text-zinc-300"
                :to="`/tournaments/${useChangeCase(row.tname, 'snakeCase').value}/${row.tid}`">{{
                    row.tname }}</NuxtLink>
        </template>
        <template #s1-data="{ row }">
            <NuxtLink class="hover-link text-zinc-300 flex gap-1"
                :to="`/tournaments/${useChangeCase(row.tname, 'snakeCase').value}/${row.tid}/${row.year}/${row.eid}/${row.mid}`">
                <span v-if="row.s1">{{ row.s1 }}<sup v-if="row.t1">{{ row.t1 }}</sup></span>
                <span v-if="row.s2">{{ row.s2 }}<sup v-if="row.t2">{{ row.t2 }}</sup></span>
                <span v-if="row.s3">{{ row.s3 }}<sup v-if="row.t3">{{ row.t3 }}</sup></span>
                <span v-if="row.s4">{{ row.s4 }}<sup v-if="row.t4">{{ row.t4 }}</sup></span>
                <span v-if="row.s5">{{ row.s5 }}<sup v-if="row.t5">{{ row.t5 }}</sup></span>
            </NuxtLink>
        </template>
    </u-table>
</template>

<style scoped>
:deep(thead) {
    @apply bg-violet-800;
}

:deep(th > span) {
    @apply font-bold text-base text-zinc-400;
}

:deep(th > button > span) {
    @apply font-bold text-base text-zinc-400;
}
</style>