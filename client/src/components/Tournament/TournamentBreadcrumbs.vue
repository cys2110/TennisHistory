<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { GET_TOURNAMENT_YEARS } from '@/services/TournamentService';
import { unencodeName } from '@/utils/functions';

const route = useRoute()
const tournamentYears = ref(null)
const pages = [{ name: 'event', title: 'Details' }, { name: 'results', title: 'Results' }, { name: 'draw', title: 'Draw' }]

if (route.name !== 'match') {
    const { query, variables } = GET_TOURNAMENT_YEARS(parseInt(route.params.id))
    const { result, loading, error } = useQuery(query, variables)

    watch(result, (newResult) => {
        if (newResult) tournamentYears.value = newResult.tournaments[0].events
    })

    watch(error, newError => {
        if (newError) console.error(newError)
    })
}
</script>

<template>
    <a-breadcrumb v-if="tournamentYears">
        <a-breadcrumb-item>
            <router-link :to="{ name: 'home' }">Home</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
            {{ unencodeName(route.params.name) }}
            <template #overlay>
                <a-menu>
                    <template v-for="event in tournamentYears" :key="event.id">
                        <a-menu-item v-if="route.name === 'tournament' || parseInt(route.params.eid) !== event.id">
                            <router-link
                                :to="{ name: 'event', params: { id: route.params.id, name: route.params.name, year: event.year.id, eid: event.id } }">{{
                                    event.year.id }}</router-link>
                        </a-menu-item>
                    </template>
                </a-menu>
            </template>
        </a-breadcrumb-item>
        <a-breadcrumb-item v-if="route.name === 'event' || route.name === 'results' || route.name === 'draw'">
            {{ route.params.year }}
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