<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    columns: { field: string; header: string }[]
}>()

const rows = ref(new Array(4))
</script>

<template>
    <DataTable :value="rows">
        <Column v-for="col in columns" :key="col.field" :header="col.header">
            <template #body>
                <Skeleton />
            </template>
        </Column>
    </DataTable>
</template>

<style scoped>
:deep(.p-datatable-column-header-content) {
    display: flex;
    justify-content: center;
}
</style>