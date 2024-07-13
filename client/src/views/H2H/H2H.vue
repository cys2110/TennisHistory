<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import apolloClient from '@/apollo';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';

provideApolloClient(apolloClient)

const props = defineProps<{
    p1Id: string,
    p2Id: string,
    p1Name: string,
    p2Name: string
}>()
</script>

<template></template>