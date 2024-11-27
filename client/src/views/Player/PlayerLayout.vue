<script setup>
import { unencodeName } from '@/utils/functions';
import { useRoute } from 'vue-router';

const props = defineProps(['name', 'id'])
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
    <PlayerBreadcrumbs :name :id />
    <Title>
        <template #title>{{ unencodeName(name) }}</template>
        <template #subtitle>{{ pageNames[route.name] }}</template>
    </Title>
    <router-view />
</template>