<script setup>
const props = defineProps(['tournament'])
</script>

<template>
    <a-breadcrumb separator=">">
        <a-breadcrumb-item>
            <router-link :to="{ name: 'home' }">Home</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
            {{ tournament.name }}
            <template #overlay>
                <a-menu>
                    <a-menu-item v-for="event in tournament.events" :key="event.id">{{ event.year.id }}</a-menu-item>
                    <!--[INSERT EVENT LINKS]-->
                </a-menu>
            </template>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>