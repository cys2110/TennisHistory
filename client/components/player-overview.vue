<script setup>
import { convert } from 'convert'
import { breakpointsTailwind } from '@vueuse/core';
const breakpoints = useBreakpoints(breakpointsTailwind)

const emits = defineEmits(['update:showMessage'])
const route = useRoute()
const pname = ref(route.params.pname)
const pid = ref(route.params.pid)
const largeScreenUp = breakpoints.greaterOrEqual('lg')

// API call
const { data: player, status, error } = await useFetch('/api/getPlayerDetails', {
    method: 'GET',
    params: { pid: computed(() => pid.value) },
    onResponse({ response }) {
        if (response.status === 204) emits('update:showMessage', 'success')
    },
    onResponseError({ error }) {
        if (error) emits('update:showMessage', 'error')
    }
})

watch(status, (newStatus) => {
    if (newStatus === 'pending') {
        emits('update:showMessage', 'pending')
    } else if (newStatus === 'success') {
        emits('update:showMessage', false)
    } else {
        emits('update:showMessage', 'error')
    }
})

const statistics = computed(() => {
    if (player) {
        return [
            { title: 'Career High', value: player.value.ch ?? '—', description: player.value.ch_date },
            { title: 'Win-Loss', value: `${player.value.wl}` },
            { title: 'Titles', value: player.value.titles },
            { title: 'Prize Money', prefix: '$', value: player.value.pm },
        ]
    }
    return []
})

const height_ft = computed(() => {
    if (player) {
        const ftDecimal = convert(player.value.height.low, 'cm').to('ft')
        const ft = Math.floor(ftDecimal)
        const inches = Math.round((ftDecimal - ft) * 12)
        return `${ft}'${inches}"`
    }
    return '—'
})

const plays = computed(() => {
    if (player) {
        switch (player.value.plays) {
            case true:
                return 'Right-handed'
            case false:
                return 'Left-handed'
            default:
                return '—'
        }
    }
    return '—'
})

const bh = computed(() => {
    if (player) {
        switch (player.value.bh) {
            case true:
                return 'One-handed'
            case false:
                return 'Two-handed'
            default:
                return '—'
        }
    }
    return '—'
})

const fieldsetItems = [
    { legend: 'Active', value: player.value.active_years ? `${player.value.active_years} years` : '—', description: player.value.years_active },
    { legend: 'Age', value: player.value.age ?? '—', description: player.value.dob },
    { legend: 'Height', value: player.value.height ? `${player.value.height.low} cm` : '—', description: player.value.height ? height_ft : null },
    { legend: 'Plays', value: plays },
    { legend: 'Backhand', value: bh }
]
</script>

<template>
    <div v-if="player" class="flex flex-col lg:flex-row gap-5">
        <div class="my-3 mx-auto max-w-56">
            <ClientOnly>
                <nuxt-img v-if="player.gladiator && largeScreenUp"
                    :src="`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${pid}`" :alt="pname" />
                <u-avatar v-else class="avatar" size="sm"
                    :src="`https://www.atptour.com/-/media/alias/player-headshot/${pid}`" :alt="pname" />
            </ClientOnly>
        </div>
        <div class="col-span-5 lg:col-span-4 w-fit mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 justify-center">
                <card v-for="stat in statistics" :key="stat.title"
                    class="p-5 w-full mx-auto text-center full-card border-green-600 shadow-green-400 hover:shadow-green-400">
                    <template #title>
                        <span class="text-zinc-400 text-base">{{ stat.title }}</span>
                    </template>
                    <template #content>
                        <div class="font-bold text-zinc-300 text-xl md:text-lg">{{ stat.prefix || '' }} {{ stat.value }}
                        </div>
                    </template>
                    <template #footer>
                        <div v-if="stat.description" class="text-zinc-400 text-sm">{{ stat.description }}</div>
                    </template>
                </card>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 mt-5">
                <Fieldset legend="Country" class="flex items-center justify-center">
                    <div class="flex items-center justify-center gap-2">
                        <Icon v-if="getCountryCode(player.country_id)"
                            :name="`flag:${getCountryCode(player.country_id)}-4x3`"
                            class="text-lg border border-zinc-400 rounded" :alt="player.country_name" />
                        <component v-else :is="`Icons${player.country_id}`" />
                        <span>{{ player.country_name }}</span>
                    </div>
                </Fieldset>
                <Fieldset v-for="item in fieldsetItems" :key="item.legend" :legend="item.legend"
                    class="flex items-center justify-center">
                    <div class="text-center">{{ item.value }}</div>
                    <div v-if="item.description" class="text-center">{{ item.description }}</div>
                </Fieldset>
                <Fieldset class="col-span-2 flex items-center justify-center" legend="Previous Representations">
                    <div v-if="player.countries.length > 0" v-for="country in player.countries" :key="country.id"
                        class="grid grid-cols-5 gap-1 text-sm">
                        <div>
                            <Icon v-if="getCountryCode(country.id)" :name="`flag:${getCountryCode(country.id)}-4x3`"
                                class="text-lg border border-zinc-400 rounded" />
                            <component v-else :is="`Icons${country.id}`" />
                        </div>
                        <div class="col-span-2">{{ country.name }}</div>
                        <div class="col-span-2">{{ country.dates }}</div>
                    </div>
                    <div v-else>—</div>
                </Fieldset>
                <Fieldset :legend="player.coaches.length === 1 ? 'Coach' : 'Coaches'"
                    class="flex items-center justify-center">
                    <div v-if="player.coaches.length > 0" v-for="coach in player.coaches" :key="coach.id">
                        <NuxtLink v-if="coach.labels.includes('Player')" class="hover-link"
                            :to="{ name: 'player', params: { pid: coach.properties.id, pname: `${coach.properties.first_name.toLowerCase()}_${coach.properties.last_name.toLowerCase()}` } }">
                            {{ coach.properties.first_name }} {{ coach.properties.last_name }}</NuxtLink>
                        <template v-else>{{ coach.properties.id }}</template>
                    </div>
                    <div v-else>—</div>
                </Fieldset>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(span img) {
    @apply !w-1/2 !h-1/2 border border-zinc-400 mx-auto my-5;
}
</style>