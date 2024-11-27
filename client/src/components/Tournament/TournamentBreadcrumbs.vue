<script setup>
import { encodeName } from '@/utils/functions';

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
                    <a-menu-item v-for="event in tournament.events" :key="event.id">
                        <router-link
                            :to="{ name: 'event', params: { id: tournament.id, name: encodeName(tournament.name), year: event.year.id, eid: event.id } }">{{
                                event.year.id }}</router-link>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>