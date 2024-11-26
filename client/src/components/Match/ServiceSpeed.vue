<script setup>
const props = defineProps(['stats'])
console.log(props.stats)
</script>

<template>
    <div class="flex">
        <!--[FIX TITLE SPACING]-->
        <SpeedGauge v-for="stat in stats" :key="stat.name" :stat />
    </div>
</template>