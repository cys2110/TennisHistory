<script setup lang="ts">
const props = defineProps<{ index: (PlayerWLIndexType & { value: number })[] }>();

const columns = [
    { field: "category", header: "Category" },
    { field: "stat", header: "" },
    { field: "wins", header: "Wins" },
    { field: "losses", header: "Losses" },
    { field: "titles", header: "Titles" },
    { field: "value", header: "Index" }
];
</script>

<template>
    <prime-data-table
        :value="index"
        row-group-mode="subheader"
        group-rows-by="category"
        striped-rows
        size="small"
        class="w-full md:w-3/4 lg:w-1/2 mx-auto md:text-base"
    >
        <prime-column
            v-for="col in columns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            class="text-xs md:text-sm"
            :class="{ 'text-center': col.field !== 'stat' }"
        />
        <template #groupheader="{ data }">
            <div class="font-bold">{{ data.category }}</div>
        </template>
    </prime-data-table>
</template>

<style scoped>
:deep(.p-datatable-header-cell:first-of-type) {
    @apply rounded-tl;
}

:deep(.p-datatable-header-cell:last-of-type) {
    @apply rounded-tr;
}
</style>
