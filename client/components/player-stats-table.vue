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
            :ui="{ td: { size: 'text-base', color: 'text-zinc-300', padding: 'py-2' }, th: { padding: 'py-2', base: 'text-left' } }"
            class="mx-auto w-fit">
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
</style>