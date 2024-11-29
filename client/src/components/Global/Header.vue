<script setup>
import { CalendarOutlined, HomeOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons-vue';

// [TODO: FIX H2H ROUTE]
const links = [
    {
        route: 'home',
        icon: HomeOutlined,
        tooltip: 'Home'
    },
    {
        route: 'archive',
        icon: CalendarOutlined,
        tooltip: 'Results Archive'
    },
    {
        route: 'h2h',
        icon: TeamOutlined,
        tooltip: 'Head to Head'
    },
    {
        route: 'search',
        icon: SearchOutlined,
        tooltip: 'Search'
    }
]
</script>

<template>
    <div class="flex justify-between items-center w-full">
        <div class="heading text-3xl">TennisHistory</div>
        <div>
            <a-tooltip v-for="link in links" :key="link.route">
                <template #title>{{ link.tooltip }}</template>
                <router-link :to="{ name: link.route }">
                    <component :is="link.icon" class="text-2xl mx-2 text-zinc-400" />
                </router-link>
            </a-tooltip>
        </div>
    </div>
</template>

<style scoped>
.heading {
    font-family: 'Petit Formal Script', cursive
}
</style>