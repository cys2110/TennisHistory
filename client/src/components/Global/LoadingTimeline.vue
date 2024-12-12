<script setup lang="ts">
import { ref } from 'vue';

const skeletonArray = ref(new Array(5))
</script>

<template>
    <Timeline :value="skeletonArray" align="alternate">
        <template #content>
            <Skeleton />
        </template>
    </Timeline>
</template>