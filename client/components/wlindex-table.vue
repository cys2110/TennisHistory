<script setup>
const props = defineProps(['index'])

const columns = [
    { field: 'category', header: 'Category' },
    { field: 'stat', header: '' },
    { field: 'wins', header: 'Wins' },
    { field: 'losses', header: 'Losses' },
    { field: 'titles', header: 'Titles' },
    { field: 'value', header: 'Index' }
]
</script>

<template>
    <data-table :value="index" row-group-mode="subheader" group-rows-by="category" striped-rows size="small"
        class="w-1/2 mx-auto">
        <column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header"
            class="text-xs md:text-sm" :class="{ 'text-center': col.field !== 'stat' }" />
        <template #groupheader="{ data }">
            <div class="font-bold">{{ data.category }}</div>
        </template>
    </data-table>
</template>