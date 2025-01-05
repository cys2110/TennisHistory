<script setup lang="ts">
const props = defineProps<{ sortOrder: number }>();
</script>

<template>
    <div>
        <Icon
            v-if="sortOrder === 0"
            name="pepicons-print:down-up"
        />
        <Icon
            v-else-if="sortOrder === 1"
            name="material-symbols:arrow-cool-down-rounded"
        />
        <Icon
            v-else
            name="material-symbols:arrow-warm-up-rounded"
        />
    </div>
</template>
