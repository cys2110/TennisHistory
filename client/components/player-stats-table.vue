<script setup>
const props = defineProps(['stats'])

const columns = [
    { key: 'category', label: 'Category' },
    { key: 'value.low', }
]
</script>

<template>
    <div>
        <u-table :rows="stats" :columns
            :empty-state="{ icon: 'i-material-symbols-bar-chart-off-rounded', label: 'No stats available' }"
            :ui="{ td: { size: 'text-base', color: 'text-zinc-500 dark:text-zinc-300', padding: 'py-2' }, th: { padding: 'py-2', base: 'text-left first:!rounded-tl-lg' }, emptyState: { label: 'text-zinc-400', icon: 'text-zinc-400', wrapper: 'py-2' }, base: 'w-fit mx-auto' }">
            <template #value.low-data="{ row }">
                <div class="text-center">{{ row.value.low }}{{ row.suffix === false ? null : '%' }}</div>
            </template>
        </u-table>
    </div>
</template>

<style scoped>
:deep(thead) {
    @apply bg-violet-800;
}


:deep(th > span) {
    @apply font-bold text-base text-zinc-400;
}

:deep(th:last-of-type) {
    @apply !rounded-tr-lg;
}

:deep(th:last-of-type > span) {
    @apply !rounded-tr-lg;
}
</style>