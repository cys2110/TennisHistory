<script setup lang="ts">
import { debounce } from "lodash";
import { SearchResultKeysEnum } from "~/types/enums";

definePageMeta({ name: "search" });
useHead({ title: "Search" });

const resultTypes = [SearchResultKeysEnum.PLAYERS, SearchResultKeysEnum.TOURNAMENTS, SearchResultKeysEnum.COUNTRIES, SearchResultKeysEnum.VENUES, SearchResultKeysEnum.SURFACES, SearchResultKeysEnum.COACHES, SearchResultKeysEnum.UMPIRES, SearchResultKeysEnum.SUPERVISORS];

const searchTerm = ref("");
const searchResults: Ref<SearchResultsType | undefined> = ref();
const icons = {
    [SearchResultKeysEnum.PLAYERS]: "i-material-symbols-person-rounded",
    [SearchResultKeysEnum.TOURNAMENTS]: "i-material-symbols-trophy-outline-rounded",
    [SearchResultKeysEnum.COUNTRIES]: "i-material-symbols-globe",
    [SearchResultKeysEnum.VENUES]: "i-material-symbols-stadium-outline-rounded",
    [SearchResultKeysEnum.SURFACES]: "i-game-icons-tennis-court",
    [SearchResultKeysEnum.COACHES]: "i-material-symbols-person-rounded",
    [SearchResultKeysEnum.UMPIRES]: "i-material-symbols-person-rounded",
    [SearchResultKeysEnum.SUPERVISORS]: "i-material-symbols-person-rounded"
};

const tabDefault = computed(() => {
    if (searchResults.value) {
        for (let i = 0; i < resultTypes.length; i++) {
            if (searchResults.value[resultTypes[i]].length > 0) {
                return resultTypes[i];
            }
        }
    }
});

const getSearchResults = async () => {
    const { data, status, error } = await $fetch("/api/getSearchResults", {
        method: "GET",
        params: { searchTerm: searchTerm.value },
        timeout: 3000,
        onResponse({ request, response, options }) {
            searchResults.value = response._data;
        }
    });
};

const debouncedSearch = debounce(getSearchResults, 500);

const handleSearch = () => {
    debouncedSearch();
};
</script>

<template>
    <div>
        <page-title>
            <template #heading>Search</template>
        </page-title>
        <div class="text-lg text-zinc-400 mb-5">Search for players, tournaments, coaches, umpires, venues, countries, surfaces and umpires</div>
        <div class="relative w-full max-w-sm items-center">
            <shadcn-input
                placeholder="Search"
                v-model="searchTerm"
                @update:model-value="handleSearch"
                class="pl-8"
            />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <Icon name="ph:magnifying-glass-duotone" />
            </span>
        </div>
        <shadcn-tabs
            v-if="searchResults"
            :default-value="tabDefault"
        >
            <shadcn-tabs-list>
                <template
                    v-for="type in resultTypes"
                    :key="type"
                >
                    <shadcn-tabs-trigger
                        v-if="searchResults[type].length > 0"
                        :value="type"
                    >
                        <Icon :name="icons[type]" />
                        <span>{{ type }}</span>
                    </shadcn-tabs-trigger>
                </template>
            </shadcn-tabs-list>
            <shadcn-tabs-content
                v-if="searchResults.Players.length > 0"
                value="Players"
            >
                <div class="grid grid-cols-3 gap-5">
                    <div
                        v-for="(result, index) in searchResults.Players"
                        :key="`Players-${index}`"
                        class="p-5 flex items-center justify-center border border-solid border-violet-600 rounded-xl"
                    >
                        <div class="flex items-center gap-2">
                            <Icon
                                v-if="getCountryCode(result.country)"
                                :name="`flag:${getCountryCode(result.country)}-4x3`"
                                class="text-base rounded border border-zinc-400"
                            />
                            <component
                                v-else
                                :is="`Icons${result.country}`"
                            />
                            <shadcn-avatar
                                class="border border-zinc-400"
                                size="sm"
                            >
                                <shadcn-avatar-image
                                    :src="`https://www.atptour.com/-/media/alias/player-headshot/${result.id}`"
                                    :alt="result.name"
                                />
                                <shadcn-avatar-fallback>
                                    <Icon name="material-symbols:person-rounded" />
                                </shadcn-avatar-fallback>
                            </shadcn-avatar>
                            <nuxt-link
                                class="hover-link text-zinc-300"
                                :to="`/players/${encodeName(result.name)}/${result.id}`"
                            >
                                {{ result.name }}
                            </nuxt-link>
                        </div>
                    </div>
                </div>
            </shadcn-tabs-content>
            <shadcn-tabs-content
                v-if="searchResults.Tournaments.length > 0"
                value="Tournaments"
            >
                <div class="grid grid-cols-3 gap-5">
                    <div
                        v-for="(result, index) in searchResults.Tournaments"
                        :key="`Tournaments-${index}`"
                        class="p-5 flex items-center justify-center border border-solid border-violet-600 rounded-xl"
                    >
                        <nuxt-link
                            class="hover-link text-zinc-300"
                            :to="`/tournaments/${encodeName(result.name)}/${result.id}`"
                            >{{ result.name }}</nuxt-link
                        >
                    </div>
                </div>
            </shadcn-tabs-content>
            <shadcn-tabs-content
                v-if="searchResults.Countries.length > 0"
                value="Countries"
            >
                <div class="grid grid-cols-3 gap-5">
                    <div
                        v-for="(result, index) in searchResults.Countries"
                        :key="`Countries-${index}`"
                        class="p-5 flex items-center justify-center border border-solid border-violet-600 rounded-xl"
                    >
                        <shadcn-dialog class="w-3/4">
                            <shadcn-dialog-trigger>
                                <div>
                                    <Icon
                                        v-if="getCountryCode(result.id)"
                                        :name="`flag:${getCountryCode(result.id)}-4x3`"
                                        class="text-base"
                                    />
                                    <component
                                        v-else
                                        :is="`Icons${result.id}`"
                                    />
                                </div>
                                <div>{{ result.name }}</div>
                            </shadcn-dialog-trigger>
                            <shadcn-dialog-content class="h-3/4">
                                <shadcn-dialog-header>
                                    <shadcn-dialog-title class="text-zinc-400">Players who represent or have represented {{ result.name }}</shadcn-dialog-title>
                                </shadcn-dialog-header>
                                <players-modal
                                    :id="result.id"
                                    type="Countries"
                                />
                            </shadcn-dialog-content>
                        </shadcn-dialog>
                    </div>
                </div>
            </shadcn-tabs-content>
            <shadcn-tabs-content
                v-if="searchResults.Venues.length > 0"
                value="Venues"
            >
                <div class="grid grid-cols-3 gap-5">
                    <div
                        v-for="(result, index) in searchResults.Venues"
                        :key="`Venues-${index}`"
                        class="p-5 flex items-center justify-center border border-solid border-violet-600 rounded-xl"
                    >
                        <shadcn-dialog class="w-3/4">
                            <shadcn-dialog-trigger>
                                <div>
                                    <Icon
                                        v-if="getCountryCode(result.country)"
                                        :name="`flag:${getCountryCode(result.country)}-4x3`"
                                        class="text-base"
                                    />
                                    <component
                                        v-else
                                        :is="`Icons${result.country}`"
                                    />
                                </div>
                                <div>{{ result.name }}, {{ result.city }}</div>
                            </shadcn-dialog-trigger>
                            <shadcn-dialog-content class="h-3/4">
                                <shadcn-dialog-header>
                                    <shadcn-dialog-title class="text-zinc-400">Events which took place at {{ result.name }}, {{ result.city }}</shadcn-dialog-title>
                                </shadcn-dialog-header>
                                <events-modal
                                    :item="result"
                                    type="Venues"
                                />
                            </shadcn-dialog-content>
                        </shadcn-dialog>
                    </div>
                </div>
            </shadcn-tabs-content>
            <shadcn-tabs-content
                v-if="searchResults.Surfaces.length > 0"
                value="Surfaces"
            >
                <div class="grid grid-cols-3 gap-5">
                    <div
                        v-for="(result, index) in searchResults.Surfaces"
                        :key="`Surfaces-${index}`"
                        class="p-5 flex items-center justify-center border border-solid border-violet-600 rounded-xl"
                    >
                        <shadcn-dialog class="w-3/4">
                            <shadcn-dialog-trigger>
                                {{ result }}
                            </shadcn-dialog-trigger>
                            <shadcn-dialog-content class="h-3/4">
                                <shadcn-dialog-header>
                                    <shadcn-dialog-title class="text-zinc-400">Events which took place on {{ result }}</shadcn-dialog-title>
                                </shadcn-dialog-header>
                                <events-modal
                                    :id="result"
                                    type="Surfaces"
                                />
                            </shadcn-dialog-content>
                        </shadcn-dialog>
                    </div>
                </div>
            </shadcn-tabs-content>
            <shadcn-tabs-content
                v-if="searchResults.Coaches.length > 0"
                value="Coaches"
            >
                <div class="grid grid-cols-3 gap-5">
                    <div
                        v-for="(result, index) in searchResults.Coaches"
                        :key="`Coaches-${index}`"
                        class="p-5 flex items-center justify-center border border-solid border-violet-600 rounded-xl"
                    >
                        <shadcn-dialog class="w-3/4">
                            <shadcn-dialog-trigger>
                                {{ result.name ?? result.id }}
                            </shadcn-dialog-trigger>
                            <shadcn-dialog-content class="h-3/4">
                                <shadcn-dialog-header>
                                    <shadcn-dialog-title class="text-zinc-400">Players coached by {{ result.name ?? result.id }}</shadcn-dialog-title>
                                </shadcn-dialog-header>
                                <players-modal
                                    :id="result.id"
                                    type="Coaches"
                                />
                            </shadcn-dialog-content>
                        </shadcn-dialog>
                    </div>
                </div>
            </shadcn-tabs-content>
            <shadcn-tabs-content
                v-if="searchResults.Umpires.length > 0"
                value="Umpires"
            >
                <div class="grid grid-cols-3 gap-5">
                    <div
                        v-for="(result, index) in searchResults.Umpires"
                        :key="`Umpires-${index}`"
                        class="p-5 flex items-center justify-center border border-solid border-violet-600 rounded-xl"
                    >
                        <shadcn-dialog class="w-3/4">
                            <shadcn-dialog-trigger>
                                {{ result }}
                            </shadcn-dialog-trigger>
                            <shadcn-dialog-content class="h-3/4">
                                <shadcn-dialog-header>
                                    <shadcn-dialog-title class="text-zinc-400">Matches umpired by {{ result }}</shadcn-dialog-title>
                                </shadcn-dialog-header>
                                <umpires-modal :id="result" />
                            </shadcn-dialog-content>
                        </shadcn-dialog>
                    </div>
                </div>
            </shadcn-tabs-content>
            <shadcn-tabs-content
                v-if="searchResults.Supervisors.length > 0"
                value="Supervisors"
            >
                <div class="grid grid-cols-3 gap-5">
                    <div
                        v-for="(result, index) in searchResults.Supervisors"
                        :key="`Supervisors-${index}`"
                        class="p-5 flex items-center justify-center border border-solid border-violet-600 rounded-xl"
                    >
                        <shadcn-dialog class="w-3/4">
                            <shadcn-dialog-trigger>
                                {{ result }}
                            </shadcn-dialog-trigger>
                            <shadcn-dialog-content class="h-3/4">
                                <shadcn-dialog-header>
                                    <shadcn-dialog-title class="text-zinc-400">Events supervised by {{ result }}</shadcn-dialog-title>
                                </shadcn-dialog-header>
                                <events-modal
                                    :id="result"
                                    type="Supervisors"
                                />
                            </shadcn-dialog-content>
                        </shadcn-dialog>
                    </div>
                </div>
            </shadcn-tabs-content>
        </shadcn-tabs>
    </div>
</template>
