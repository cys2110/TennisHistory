<script setup>
import { useRoute } from 'vue-router';
import { unencodeName } from '@/utils/functions';

// Variables
const route = useRoute()
const pages = [{ name: 'player', title: 'Details' }, { name: 'activity', title: 'Activity' }, { name: 'titles', title: 'Titles and Finals' }, { name: 'index', title: 'Win-Loss Index' }, { name: 'stats', title: 'Stats' }]
</script>

<template>
    <a-breadcrumb>
        <a-breadcrumb-item>
            <router-link :to="{ name: 'home' }">Home</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
            {{ unencodeName(route.params.name) }}
            <template #overlay>
                <a-menu>
                    <template v-for="(page, index) in pages" :key="index">
                        <a-menu-item v-if="route.name !== page.name">
                            <router-link :to="{ name: page.name }">{{ page.title }}</router-link>
                        </a-menu-item>
                    </template>
                </a-menu>
            </template>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>