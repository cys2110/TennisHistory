<script setup>
import { CalendarOutlined, HomeOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons-vue';

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
    <div class="flex justify-between w-full">
        <div>TennisHistory</div>
        <!--[TODO: ADJUST LINK SIZING AND HOVER]-->
        <div>
            <a-tooltip v-for="link in links" :key="link.route">
                <template #title>{{ link.tooltip }}</template>
                <router-link :to="{ name: link.route }">
                    <component :is="link.icon" />
                </router-link>
            </a-tooltip>
        </div>
    </div>
</template>