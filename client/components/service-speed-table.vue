<script setup>
const props = defineProps(['stats', 'p1_name', 'p1_id', 'p2_name', 'p2_id'])

const columns = [
    { key: 'p1.low', label: props.p1_name },
    { key: 'name', label: 'Category' },
    { key: 'p2.low', label: props.p2_name },
]
</script>

<template>
    <u-table :rows="stats" :columns class="w-fit mx-auto"
        :ui="{ th: { size: 'text-base', color: 'text-zinc-400', padding: 'py-1' }, td: { size: 'text-base', base: 'text-center', padding: 'py-1' } }">
        <template #p1.low-header>
            <div class="flex items-center">
                <Avatar shape="circle" :image="`https://www.atptour.com/-/media/alias/player-headshot/${p1_id}`" />
                <div class="font-bold">{{ p1_name }}</div>
            </div>
        </template>
        <template #p2.low-header>
            <div class="flex items-center">
                <Avatar shape="circle" :image="`https://www.atptour.com/-/media/alias/player-headshot/${p2_id}`" />
                <div class="font-bold">{{ p2_name }}</div>
            </div>
        </template>
        <template #p1.low-data="{ row }">
            <div class="flex flex-col">
                <div :class="{ 'font-bold': row.p1.low > row.p2.low }">{{ row.p1.low }} km/h</div>
                <div :class="{ 'font-bold': row.p1.low > row.p2.low }">{{ (row.p1.low / 1.609344).toFixed(0) }} mph
                </div>
            </div>
        </template>
        <template #p2.low-data="{ row }">
            <div class="flex flex-col">
                <div :class="{ 'font-bold': row.p2.low > row.p1.low }">{{ row.p2.low }} km/h</div>
                <div :class="{ 'font-bold': row.p2.low > row.p1.low }">{{ (row.p2.low / 1.609344).toFixed(0) }} mph
                </div>
            </div>
        </template>
    </u-table>
</template>