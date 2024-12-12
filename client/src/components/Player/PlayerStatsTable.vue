<script setup lang="ts">
const props = defineProps<{
    columns: { field: string, header: string }[]
    stats: { category: string, value: number, suffix?: boolean }[]
    checked: boolean
}>()
</script>

<template>
    <DataTable v-if="!checked" :value="stats" size="small" stripedRows class="w-1/2 mx-auto">
        <Column field="category" />
        <Column field="value" class="!text-center">
            <template #body="{ data }">
                <div>{{ data.value }}{{ data.suffix === false ? null : '%' }}</div>
            </template>
        </Column>
    </DataTable>
</template>