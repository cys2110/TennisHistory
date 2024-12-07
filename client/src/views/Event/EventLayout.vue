<script setup lang="ts">
import { useRoute } from 'vue-router';
import { unencodeName } from '@/utils/functions';

const route = useRoute()
const pageNames = {
    event: 'Event Details',
    results: 'Results',
    draw: 'Draw'
}
</script>

<template>
    <Title v-if="route.name !== 'match'">
        <template #title>{{ unencodeName(route.params.name as string) }} {{ route.params.year }}</template>
        <template #subtitle>{{ pageNames[route.name as keyof typeof pageNames] }}</template>
    </Title>
    <router-view />
</template>