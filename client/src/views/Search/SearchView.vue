<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { SearchOutlined } from '@ant-design/icons-vue';
import { GET_SEARCH } from '@/services/MiscService';
import { encodeName, headshot } from '@/utils/functions';

document.title = 'Search | TennisHistory'

const searchTerm = ref(null)
const noMatch = ref(true)
const results = ref(null)

const { query, variables } = GET_SEARCH(searchTerm.value)
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, newResult => {
    if (newResult) {
        if (Object.values(newResult).every(val => val.length === 0)) {
            noMatch.value = true
        } else {
            noMatch.value = false
        }
        results.value = newResult
    }
})

watch(error, newError => {
    if (newError) console.error(newError)
})

const handleSearch = (e) => {
    refetch({ searchTerm: e.target.value })
}
</script>

<template>
    <Title>
        <template #title>Search</template>
    </Title>
    <div>
        <a-input v-model:value="searchTerm" @pressEnter="handleSearch"
            placeholder="Search for players, tournaments, umpires, coaches, supervisors, countries, venues and surfaces"
            allowClear>
            <template #prefix>
                <search-outlined />
            </template>
        </a-input>
    </div>

    <div v-if="noMatch" class="my-10 text-3xl text-zinc-400">No results matching search</div>

    <a-list v-if="results?.searchPlayers.length > 0" :data-source="results.searchPlayers" header="Players">
        <template #renderItem="{ item }">
            <a-list-item>
                <a-list-item-meta>
                    <template #avatar>
                        <a-avatar :alt="item.full_name" :src="headshot(item.id)" class="border-zinc-300 mx-2" />
                    </template>
                    <template #title>
                        <router-link class="hover-link hover:!text-zinc-300 text-left"
                            :to="{ name: 'player', params: { name: encodeName(item.full_name), id: item.id } }">{{
                                item.full_name }}</router-link>
                    </template>
                    <template #description>{{ item.country.name }}</template>
                </a-list-item-meta>
            </a-list-item>
        </template>
    </a-list>

    <a-list v-if="results?.searchTournaments.length > 0" :data-source="results.searchTournaments" header="Tournaments">
        <template #renderItem="{ item }">
            <a-list-item>
                <a-list-item-meta>
                    <template #title>
                        <router-link class="hover-link hover:!text-zinc-300"
                            :to="{ name: 'tournament', params: { name: encodeName(item.name), id: item.id } }">
                            {{ item.name }}</router-link>
                    </template>
                </a-list-item-meta>
            </a-list-item>
        </template>
    </a-list>

    <CountryResults v-if="results?.searchCountries.length > 0" :countries="results.searchCountries" />

    <CoachResults v-if="results?.searchCoaches.length > 0" :coaches="results.searchCoaches" />

    <UmpireResults v-if="results?.searchUmpires.length > 0" :umpires="results.searchUmpires" />

    <SurfaceResults v-if="results?.searchSurface.length > 0" :surfaces="results.searchSurface" />

    <VenueResults v-if="results?.searchVenue.length > 0" :venues="results.searchVenue" />

    <SupervisorResults v-if="results?.searchSupervisors.length > 0" :supervisors="results.searchSupervisors" />

    <Loading v-if="loading" :loading />

</template>