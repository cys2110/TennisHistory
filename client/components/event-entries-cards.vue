<script setup>
const props = defineProps(['entries'])
</script>

<template>
    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-10">
        <event-entry-card v-for="entry in entries" :key="entry.id" :entry />
    </div>
</template>