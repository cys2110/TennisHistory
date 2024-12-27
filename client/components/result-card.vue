<script setup>
import { useChangeCase } from '@vueuse/integrations';

const props = defineProps(['match'])
const { court, date, duration, incomplete, loser_country, loser_id, loser_incomplete, loser_name, loser_seed, loser_status, mid: { low: mid }, ws1, ws2, ws3, ws4, ws5, wt1, wt2, wt3, wt4, wt5, ls1, ls2, ls3, ls4, ls5, lt1, lt2, lt3, lt4, lt5, umpire, winner_country, winner_id, winner_name, winner_seed, winner_status } = props.match

const winnerParamName = computed(() => {
    if (winner_name) return useChangeCase(winner_name, 'snakeCase').value
    return ''
})
const loserParamName = computed(() => {
    if (loser_name) return useChangeCase(loser_name, 'snakeCase').value
    return ''
})
</script>

<template>
    <card class="full-card pt-3 px-3">
        <template #header>
            <div
                class="flex justify-between text-xs md:text-sm lg:text-xs xl:text-sm text-zinc-500 dark:text-zinc-400 px-5">
                <div class="flex flex-col">
                    <ClientOnly>
                        <NuxtTime v-if="date" :datetime="new Date(date.year.low, date.month.low - 1, date.day.low)"
                            day="numeric" month="long" year="numeric" weekday="long" />
                    </ClientOnly>
                    <div v-if="court">{{ court }}</div>
                </div>
                <div class="flex flex-col">
                    <div class="text-right">{{ duration ? formatTime(duration) : '0:00' }}</div>
                    <div v-if="umpire" class="text-right">{{ umpire }}</div>
                </div>
            </div>
        </template>
        <template #content>
            <div
                class="grid grid-cols-9 items-center gap-1 text-xs md:text-sm lg:text-xs xl:text-sm text-zinc-600 dark:text-zinc-300">
                <div class="flex justify-center items-center">
                    <Icon v-if="getCountryCode(winner_country)"
                        :name="`flag:${getCountryCode(winner_country).toLowerCase()}-4x3`" class="text-base" />
                    <component v-else :is="`Icons${winner_country}`" />
                </div>
                <div class="flex justify-center items-center">
                    <Avatar :image="`https://www.atptour.com/-/media/alias/player-headshot/${winner_id}`" size="small"
                        shape="circle" />
                </div>
                <div class="col-span-3 flex items-center">
                    <NuxtLink class="hover-link"
                        :to="{ name: 'player', params: { pid: winner_id, pname: useChangeCase(winner_name, 'snakeCase').value } }">
                        {{ winner_name }}</NuxtLink>
                </div>
                <div class="flex justify-center items-center">
                    <span v-if="winner_seed || winner_status">({{ winner_seed?.low }}{{ winner_status }})</span>
                </div>
                <div class="flex justify-center items-center">
                    <Icon name="ic:twotone-check-circle" class="text-green-600" />
                </div>
                <div class="col-span-2 flex justify-end gap-2">
                    <span v-if="ws1">{{ ws1 }}<sup v-if="wt1">{{ wt1 }}</sup></span>
                    <span v-if="ws2">{{ ws2 }}<sup v-if="wt2">{{ wt2 }}</sup></span>
                    <span v-if="ws3">{{ ws3 }}<sup v-if="wt3">{{ wt3 }}</sup></span>
                    <span v-if="ws4">{{ ws4 }}<sup v-if="wt4">{{ wt4 }}</sup></span>
                    <span v-if="ws5">{{ ws5 }}<sup v-if="wt5">{{ wt5 }}</sup></span>
                </div>
                <div class="flex justify-center items-center">
                    <Icon v-if="loser_country && getCountryCode(loser_country)"
                        :name="`flag:${getCountryCode(loser_country).toLowerCase()}-4x3`" class="text-base" />
                    <component v-else-if="loser_country" :is="`Icons${loser_country}`" />
                </div>
                <div class="flex justify-center items-center">
                    <Avatar v-if="loser_id" :image="`https://www.atptour.com/-/media/alias/player-headshot/${loser_id}`"
                        size="small" shape="circle" />
                </div>
                <div class="col-span-3 flex items-center">
                    <NuxtLink v-if="loser_name" class="hover-link"
                        :to="{ name: 'player', params: { pid: loser_id, pname: useChangeCase(loser_name, 'snakeCase').value } }">
                        {{ loser_name }}</NuxtLink>
                    <div v-else>BYE</div>
                </div>
                <div class="flex justify-center items-center">
                    <small v-if="loser_seed || loser_status">({{ loser_seed?.low }}{{ loser_status }})</small>
                </div>
                <div class="flex justify-center items-center">
                    <u-badge v-if="loser_incomplete" class="bg-red-800" :ui="{ rounded: 'rounded' }">{{
                        `${loser_incomplete}.` }}</u-badge>
                </div>
                <div class="col-span-2 flex justify-end gap-2">
                    <span v-if="ls1">{{ ls1 }}<sup v-if="lt1">{{ lt1 }}</sup></span>
                    <span v-if="ls2">{{ ls2 }}<sup v-if="lt2">{{ lt2 }}</sup></span>
                    <span v-if="ls3">{{ ls3 }}<sup v-if="lt3">{{ lt3 }}</sup></span>
                    <span v-if="ls4">{{ ls4 }}<sup v-if="lt4">{{ lt4 }}</sup></span>
                    <span v-if="ls5">{{ ls5 }}<sup v-if="lt5">{{ lt5 }}</sup></span>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-evenly">
                <u-button variant="outline" size="sm" icon="i-material-symbols-query-stats-rounded"
                    :to="{ name: 'match', params: { mid: mid } }" :ui="{ rounded: 'rounded-full' }"
                    :disabled="!!incomplete" label="Stats" />
                <u-button v-if="!loser_name" variant="outline" size="sm"
                    icon="i-material-symbols-swords-outline-rounded" label="H2H" :ui="{ rounded: 'rounded-full' }"
                    disabled />
                <u-button v-else variant="outline" size="sm" icon="i-material-symbols-swords-outline-rounded"
                    :ui="{ rounded: 'rounded-full' }"
                    :to="`/h2h/${winnerParamName}-v-${loserParamName}/${winner_id}-${loser_id}`" label="H2H" />
            </div>
        </template>
    </card>
</template>