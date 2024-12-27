<script setup>
import { useChangeCase } from '@vueuse/integrations';
import { debounce } from 'lodash'

definePageMeta({ name: 'search' })
useHead({ title: 'Search' })

const searchTerm = ref('')
const tabItems = ref([])
const visible = ref(false)
const selection = ref('')
const selectedType = ref('')
const icons = {
    Players: 'i-material-symbols-person-rounded',
    Tournaments: 'i-material-symbols-trophy-outline-rounded',
    Countries: 'i-material-symbols-globe',
    Venues: 'i-material-symbols-stadium-outline-rounded',
    Surfaces: 'i-game-icons-tennis-court',
    Coaches: 'i-material-symbols-person-rounded',
    Umpires: 'i-material-symbols-person-rounded',
    Supervisors: 'i-material-symbols-person-rounded'
}
const modals = computed(() => ({
    Countries: { component: resolveComponent('players-modal'), header: `Players who represent or have represented ${selection.value.name}` },
    Venues: { component: resolveComponent('events-modal'), header: 'Events held at ' },
    Surfaces: { component: resolveComponent('events-modal'), header: 'Events played on ' },
    Coaches: { component: resolveComponent('players-modal'), header: 'Players coached by ' },
    Umpires: { component: resolveComponent('umpires-modal'), header: 'Matches umpired by ' },
    Supervisors: { component: resolveComponent('events-modal'), header: 'Events supervised by ' }
}))

const getSearchResults = async () => {
    const { data, status, error } = await $fetch('/api/getSearchResults', {
        method: 'GET',
        params: { searchTerm: searchTerm.value },
        immediate: false,
        timeout: 3000,
        onResponse({ request, response, options }) {
            const filteredResults = Object.entries(response._data).filter(([key, value]) => value.length > 0)
            tabItems.value = filteredResults.map(([key, value]) => {
                return {
                    label: key,
                    icon: icons[key],
                    content: value
                }
            })
        }
    })
}

const debouncedSearch = debounce(getSearchResults, 500)

const handleSearch = () => {
    debouncedSearch()
}

const handleClick = (type, item) => {
    selection.value = item
    selectedType.value = type
    visible.value = true
}
</script>

<template>
    <div>
        <page-title>
            <template #heading>Search</template>
        </page-title>
        <div class="text-lg text-zinc-400 mb-5">Search for players, tournaments, coaches, umpires, venues, countries,
            surfaces and
            umpires</div>
        <div>
            <FloatLabel variant="on">
                <InputText id="search" type="text" v-model="searchTerm" class="w-full" size="small"
                    @update:model-value="handleSearch" />
                <label for="search">Search</label>
            </FloatLabel>
        </div>
        <u-tabs class="mt-10" v-if="tabItems.length > 0" :items="tabItems" orientation="vertical" :default-index="0"
            :ui="{ wrapper: 'flex gap-10', list: { width: 'w-40' } }">
            <template #item="{ item }">
                <div class="grid grid-cols-3 gap-5">
                    <div v-for="result in item.content" :key="result"
                        class="p-5 flex items-center justify-center border border-solid border-violet-600 rounded-xl">

                        <NuxtLink v-if="item.label === 'Tournaments'" class="hover-link text-zinc-300"
                            :to="{ name: 'tournament', params: { tname: useChangeCase(result.name, 'snakeCase').value, tid: result.id } }">
                            {{ result.name }}</NuxtLink>

                        <div v-else-if="item.label === 'Players'" class="flex items-center">
                            <Icon v-if="getCountryCode(result.country)"
                                :name="`flag:${getCountryCode(result.country).toLowerCase()}-4x3`" class="text-base" />
                            <component v-else :is="`Icons${result.country}`" />
                            <Avatar :image="`https://www.atptour.com/-/media/alias/player-headshot/${result.id}`"
                                shape="circle" size="small" />
                            <NuxtLink class="hover-link text-zinc-300"
                                :to="{ name: 'player', params: { pname: useChangeCase(result.name, 'snakeCase').value, pid: result.id } }">
                                {{ result.name }}</NuxtLink>
                        </div>

                        <div v-else class="flex">
                            <div v-if="item.label === 'Venues' || item.label === 'Countries'">
                                <Icon v-if="getCountryCode(result.country) || getCountryCode(result.id)"
                                    :name="`flag:${getCountryCode(item.label === 'Venues' ? result.country : result.id).toLowerCase()}-4x3`"
                                    class="text-base" />
                                <component v-else
                                    :is="`Icons${item.label === 'Venues' ? result.country : result.id}`" />
                            </div>
                            <div class="hover-link text-zinc-300 cursor-pointer"
                                @click="handleClick(item.label, result)">
                                <span v-if="item.label === 'Venues' || item.label === 'Countries'">{{ result.name
                                    }}<span v-if="item.label === 'Venues'">, {{ result.city }}</span></span>
                                <span v-else-if="item.label === 'Coaches'">{{ result.name ?? result.id }}</span>
                                <span v-else>{{ result }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </u-tabs>
        <Dialog v-model:visible="visible" maximizable modal class="w-3/4">
            <template #header>
                <div class="text-2xl flex items-center gap-3">{{ modals[selectedType].header }}
                    <div v-if="selectedType === 'Venues'">
                        <Icon v-if="getCountryCode(selection.country)"
                            :name="`flag:${getCountryCode(selection.country).toLowerCase()}-4x3`" class="text-xl" />
                        <component v-else :is="`Icons${selection.country}`" />
                    </div>
                </div>
            </template>
            <component :is="modals[selectedType].component" :item="selection" :type="selectedType" />
        </Dialog>
    </div>
</template>