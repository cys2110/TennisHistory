<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { SearchOutlined } from '@ant-design/icons-vue';
import { GET_SEARCH } from '@/services/MiscService';
import { encodeName } from '@/utils/functions';
import { Surface } from '@/utils/types';

document.title = 'Search | TennisHistory'

interface Results {
    searchTournaments: {
        id: number
        name: string
    }[]
    searchPlayers: {
        id: string
        full_name: string
        country: {
            name: string
            id: string
        }
    }[]
    searchCoaches: {
        id: string
        full_name: string | null
    }[]
    searchCountries: {
        name: string
        id: string
    }[]
    searchSupervisors: {
        id: string
    }[]
    searchSurface: {
        id: Surface
    }[]
    searchUmpires: {
        id: string
    }[]
    searchVenue: {
        name: string
        city: string
        country: {
            id: string
        }
    }[]
}
const searchTerm = ref(null)
const noMatch = ref(true)
const results: Ref<Results | null> = ref(null)

const { query, variables } = GET_SEARCH("Search")
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, (newResult: Results) => {
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

const handleSearch = (e: { target: { value: string } }) => {
    refetch({ searchTerm: e.target.value })
}
</script>

<template>
    <Title>
        <template #title>Search</template>
    </Title>
    <div class="mb-3">
        <a-input v-model:value="searchTerm" @pressEnter="handleSearch"
            placeholder="Search for players, tournaments, umpires, coaches, supervisors, countries, venues and surfaces"
            allowClear>
            <template #prefix>
                <search-outlined />
            </template>
        </a-input>
    </div>

    <div v-if="noMatch" class="my-10 text-3xl text-zinc-400">No results matching search</div>

    <a-list v-if="results && results.searchPlayers.length > 0" :data-source="results.searchPlayers" header="Players">
        <template #renderItem="{ item }">
            <a-list-item>
                <a-skeleton :loading active avatar>
                    <SearchPlayerRow :player="item" />
                </a-skeleton>
            </a-list-item>
        </template>
    </a-list>

    <a-list v-if="results && results.searchTournaments.length > 0" :data-source="results.searchTournaments"
        header="Tournaments">
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

    <CountryResults v-if="results && results?.searchCountries.length > 0" :countries="results.searchCountries" />

    <CoachResults v-if="results && results?.searchCoaches.length > 0" :coaches="results.searchCoaches" />

    <UmpireResults v-if="results && results?.searchUmpires.length > 0" :umpires="results.searchUmpires" />

    <SurfaceResults v-if="results && results?.searchSurface.length > 0" :surfaces="results.searchSurface" />

    <VenueResults v-if="results && results?.searchVenue.length > 0" :venues="results.searchVenue" />

    <SupervisorResults v-if="results && results?.searchSupervisors.length > 0"
        :supervisors="results.searchSupervisors" />

    <Loading v-if="loading" :loading />

</template>