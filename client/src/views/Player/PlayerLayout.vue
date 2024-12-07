<script setup lang="ts">
import { useRoute } from 'vue-router';
import { unencodeName } from '@/utils/functions';

const props = defineProps<{
    name: string
    id: string
}>()
const route = useRoute()
const pageNames = {
    player: 'Overview',
    activity: 'Activity',
    titles: 'Titles and Finals',
    index: 'Win-Loss Index',
    stats: 'Stats'
}
</script>

<template>
    <Title>
        <template #title>{{ unencodeName(name) }}</template>
        <template #subtitle>{{ pageNames[route.name as keyof typeof pageNames] }}</template>
    </Title>
    <router-view />
</template>