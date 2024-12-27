<script setup>
import { useChangeCase } from '@vueuse/integrations';

const props = defineProps(['event'])
const { eid, loser_country, loser_name, loser_id, winner_country, winner_name, winner_id, year, match_no, ...event } = props.event
const route = useRoute()
const tname = ref(route.params.tname)
const tid = ref(route.params.tid)

// Get country codes for icons
const winnerCountryCode = getCountryCode(winner_country)
const loserCountryCode = getCountryCode(loser_country)

// Link params
const eventParams = computed(() => ({ tname: tname.value, tid: tid.value, year, eid }))
const matchParams = computed(() => ({ ...eventParams.value, mid: match_no }))
</script>

<template>
    <card class="full-card">
        <template #title>
            <NuxtLink class="hover-link font-bold" :to="{ name: 'event', params: eventParams }">{{ year }}</NuxtLink>
            <Divider />
        </template>
        <template #content>
            <div class="w-3/4 mx-auto grid grid-cols-5 gap-y-3 gap-x-2 items-center">
                <Icon v-if="winnerCountryCode" :name="`flag:${winnerCountryCode}-4x3`"
                    class="text-lg rounded border border-zinc-400" />
                <component v-else :is="`Icons${winner_country}`" />
                <Avatar shape="circle" :image="`https://www.atptour.com/-/media/alias/player-headshot/${winner_id}`"
                    :alt="winner_name" />
                <NuxtLink class="hover-link text-base col-span-3"
                    :to="{ name: 'player', params: { pid: winner_id, pname: useChangeCase(winner_name, 'snakeCase').value } }">
                    {{ winner_name }}
                </NuxtLink>
                <div class="col-span-5 text-center">d.</div>
                <Icon v-if="loserCountryCode" :name="`flag:${loserCountryCode}-4x3`"
                    class="text-lg rounded border border-zinc-400" />
                <component v-else :is="`Icons${loser_country}`" />
                <Avatar shape="circle" :image="`https://www.atptour.com/-/media/alias/player-headshot/${loser_id}`"
                    :alt="loser_name" />
                <NuxtLink class="hover-link text-base col-span-3"
                    :to="{ name: 'player', params: { pid: loser_id, pname: useChangeCase(loser_name, 'snakeCase').value } }">
                    {{ loser_name }}
                </NuxtLink>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-center items-center">
                <NuxtLink class="hover-link text-base flex gap-1" :to="{ name: 'match', params: matchParams }">
                    <template v-for="(_, index) in new Array(5)" :key="index">
                        <span v-if="event[`s${index + 1}`]">{{ event[`s${index + 1}`] }}<sup
                                v-if="event[`t${index + 1}`]">{{ event[`t${index + 1}`] }}</sup></span>
                    </template>
                </NuxtLink>
            </div>
        </template>
    </card>
</template>