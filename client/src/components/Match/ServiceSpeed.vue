<script setup>
const props = defineProps(['stats'])
</script>

<template>
    <div class="flex">
        <SpeedGauge v-for="stat in stats" :key="stat.name" :stat />
    </div>
</template>