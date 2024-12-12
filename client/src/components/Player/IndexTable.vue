<script setup lang="ts">
import type { Index } from '@/utils/types';

const props = defineProps<{
    index: Index[]
    columns: { field: string, header: string }[]
}>()

</script>

<template>
    <DataTable :value="index" rowGroupMode="subheader" groupRowsBy="category" stripedRows size="small">
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header"
            class="!text-xs md:!text-sm" :class="{ '!text-center': col.field !== 'stat' }" />
        <template #groupheader="{ data }">
            <div class="font-bold">{{ data.category }}</div>
        </template>
    </DataTable>
</template>

<style scoped>
:deep(.p-datatable-row-group-header) {
    background-color: var(--p-violet-800);
}

:deep(.p-datatable-column-header-content) {
    display: flex;
    justify-content: center;
}
</style>