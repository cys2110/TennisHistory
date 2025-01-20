<script setup lang="ts">
const props = defineProps<{ entries: EventEntryType[] }>();
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-10">
        <event-entry-card
            v-for="entry in entries"
            :key="entry.id"
            :entry
        />
    </div>
</template>
