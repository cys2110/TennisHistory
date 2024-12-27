<script setup>
import { useChangeCase } from '@vueuse/integrations';

const props = defineProps(['event'])
const { eid: { low: eid }, loser_country, loser_name, loser_id, s1, s2, s3, s4, s5, t1, t2, t3, t4, t5, winner_country, winner_name, winner_id, year: { low: year }, match_no } = props.event

// Get country codes for icons
const winnerCountryCode = getCountryCode(winner_country)
const loserCountryCode = getCountryCode(loser_country)

// Link params
const eventParams = { year, eid }
const matchParams = { ...eventParams, mid: match_no }
</script>

<template>
    <card class="full-card">
        <template #title>
            <NuxtLink class="hover-link font-bold" :to="{ name: 'event', params: eventParams }">{{ year }}</NuxtLink>
            <Divider />
        </template>
        <template #content>
            <div class="w-3/4 mx-auto grid grid-cols-5 gap-y-3 items-center">
                <!--FIXME: Flag components-->
                <Icon v-if="winnerCountryCode" :name="`flag:${winnerCountryCode.toLowerCase()}-4x3`"
                    class="text-base" />
                <component v-else :is="`Icons${winner_country}`" />
                <Avatar shape="circle" :image="`https://www.atptour.com/-/media/alias/player-headshot/${winner_id}`" />
                <NuxtLink class="hover-link text-base col-span-3"
                    :to="{ name: 'player', params: { pid: winner_id, pname: useChangeCase(winner_name, 'snakeCase').value } }">
                    {{ winner_name }}
                </NuxtLink>
                <div class="col-span-5 text-center">d.</div>
                <!--FIXME: Flag components-->
                <Icon v-if="loserCountryCode" :name="`flag:${loserCountryCode.toLowerCase()}-4x3`" class="text-base" />
                <component v-else :is="`Icons${loser_country}`" />
                <Avatar shape="circle" :image="`https://www.atptour.com/-/media/alias/player-headshot/${loser_id}`" />
                <NuxtLink class="hover-link text-base col-span-3"
                    :to="{ name: 'player', params: { pid: loser_id, pname: useChangeCase(loser_name, 'snakeCase').value } }">
                    {{ loser_name }}
                </NuxtLink>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-center items-center">
                <NuxtLink class="hover-link text-base" :to="{ name: 'match', params: matchParams }">
                    {{ s1 }}<sup v-if="t1">{{ t1.low }}</sup>
                    {{ s2 }}<sup v-if="t2">{{ t2.low }}</sup>
                    {{ s3 }}<sup v-if="t3">{{ t3.low }}</sup>
                    {{ s4 }}<sup v-if="t4">{{ t4.low }}</sup>
                    {{ s5 }}<sup v-if="t5">{{ t5.low }}</sup>
                </NuxtLink>
            </div>
        </template>
    </card>
</template>