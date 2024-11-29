<script setup>
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
        <template #title>{{ unencodeName(route.params.name) }} {{ route.params.year }}</template>
        <template #subtitle>{{ pageNames[route.name] }}</template>
    </Title>
    <router-view />
</template>