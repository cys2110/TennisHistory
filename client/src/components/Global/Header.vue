<script setup>
import { ref } from 'vue';
import { Grid } from 'ant-design-vue';
import { CalendarOutlined, HomeOutlined, SearchOutlined, TeamOutlined, MenuOutlined } from '@ant-design/icons-vue';

const useBreakpoint = Grid.useBreakpoint;
const screens = useBreakpoint();
const open = ref(false);

const links = [
    { route: 'home', icon: HomeOutlined, tooltip: 'Home' },
    { route: 'archive', icon: CalendarOutlined, tooltip: 'Results Archive' },
    { route: 'h2h', icon: TeamOutlined, tooltip: 'Head to Head' },
    { route: 'search', icon: SearchOutlined, tooltip: 'Search' }
]

const toggleCollapsed = () => {
    open.value = !open.value;
}
</script>

<template>
    <div class="flex justify-between items-center w-full">
        <div class="heading text-3xl">TennisHistory</div>
        <div v-if="screens.sm === true" class="mt-2">
            <a-tooltip v-for="link in links" :key="link.route">
                <template #title>{{ link.tooltip }}</template>
                <router-link :to="{ name: link.route }">
                    <component :is="link.icon" class="text-2xl mx-2 text-zinc-400" />
                </router-link>
            </a-tooltip>
        </div>
        <div v-else>
            <a-button :ghost="true" class="!border-none !text-zinc-300 !text-lg" @click="toggleCollapsed">
                <MenuOutlined />
            </a-button>
            <a-drawer :open="open" placement="bottom" @close="toggleCollapsed">
                <div class="flex flex-col">
                    <router-link v-for="link in links" :key="link.route" class="my-2" :to="{ name: link.route }">
                        <component :is="link.icon" class="text-xl mx-2 text-zinc-400" />
                        {{ link.tooltip }}
                    </router-link>
                </div>
            </a-drawer>
        </div>
    </div>
</template>

<style scoped>
.heading {
    font-family: 'Petit Formal Script', cursive
}
</style>