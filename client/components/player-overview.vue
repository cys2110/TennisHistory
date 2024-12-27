<script setup>
import { convert } from 'convert'
import { breakpointsTailwind } from '@vueuse/core';
const breakpoints = useBreakpoints(breakpointsTailwind)

const emits = defineEmits(['update:showMessage'])
const route = useRoute()
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
            { title: 'Win-Loss', value: `${player.value.win}—${player.value.loss}` },
            { title: 'Titles', value: player.value.titles },
            { title: 'Prize Money', prefix: '$', value: player.value.pm.low.toLocaleString('en-GB') },
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
    return null
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
    return null
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
    return null
})
</script>

<template>
    <div v-if="player" class="grid grid-cols-5 grid-flow-col">
        <div class="col-span-5 lg:col-span-1">
            <nuxt-img v-if="player.gladiator && largeScreenUp"
                :src="`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${pid}`" />
            <u-avatar v-else size="3xl" :src="`https://www.atptour.com/-/media/alias/player-headshot/${pid}`" />

        </div>
        <div class="col-span-5 lg:col-span-4">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 justify-center">
                <card v-for="stat in statistics" :key="stat.title"
                    class="p-5 w-full mx-auto text-center full-card border-green-600 shadow-green-400 hover:shadow-green-400">
                    <template #subtitle>{{ stat.title }}</template>
                    <template #content>
                        <div class="font-bold text-xl md:text-lg">{{ stat.prefix || '' }} {{ stat.value }}</div>
                    </template>
                    <template #footer>
                        <div v-if="stat.description" class="text-zinc-400 text-sm">{{ stat.description }}</div>
                    </template>
                </card>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 mt-5">
                <Fieldset legend="Country" class="flex items-center justify-center">
                    <Icon v-if="getCountryCode(player.country)"
                        :name="`flag:${getCountryCode(player.country).toLowerCase()}-4x3`" class="text-base" />
                    <component v-else :is="`Icons${player.country}`" />
                </Fieldset>
                <Fieldset legend="Active" class="flex items-center justify-center">
                    <div class="text-center">{{ player.active_years ? `${player.active_years} years` : '—' }}</div>
                    <div class="text-center" v-if="player.active_years">{{ player.pro }}-{{ player.retired ?? 'present'
                        }}</div>
                </Fieldset>
                <Fieldset legend="Age" class="flex items-center justify-center">
                    <div v-if="player.age" class="text-center">{{ player.age }}</div>
                    <div class="text-center">{{ player.dob ?? '—' }}</div>
                </Fieldset>
                <Fieldset legend="Height" class="flex items-center justify-center">
                    <div class="text-center">{{ player.height ? `${player.height.low} cm` : '—' }}</div>
                    <div v-if="player.height" class="text-center">{{ height_ft }}</div>
                </Fieldset>
                <Fieldset legend="Plays" class="flex items-center justify-center">{{ plays }}</Fieldset>
                <Fieldset legend="Backhand" class="flex items-center justify-center">{{ bh }}</Fieldset>
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
                <Fieldset class="col-span-2 flex items-center justify-center" legend="Previous Representations">
                    <div v-if="player.countries.length > 0" v-for="country in player.countries" :key="country.id"
                        class="flex gap-2">
                        <div>
                            <Icon v-if="getCountryCode(country.id)"
                                :name="`flag:${getCountryCode(country.id).toLowerCase()}-4x3`" class="text-base" />
                            <component v-else :is="`Icons${country.id}`" />
                        </div>
                        <div>{{ country.start }}-{{ country.end }}</div>
                    </div>
                    <div v-else>—</div>
                </Fieldset>
            </div>
        </div>
    </div>
</template>