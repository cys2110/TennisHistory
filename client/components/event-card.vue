<script setup>
import { useChangeCase } from '@vueuse/integrations';

const props = defineProps(['event'])
const { surface, country, city, tname, tid: { low: tid }, ename, year: { low: year }, eid: { low: eid }, start_date, end_date, category } = props.event

// Disabled buttons if event has not started yet
const startDate = new Date(start_date.year.low, start_date.month.low - 1, start_date.day.low)
const currentDate = new Date()
const isDisabled = currentDate < startDate

// Get country code for icons
const countryCode = getCountryCode(country)

// Route params
const tournamentParams = computed(() => ({ tname: useChangeCase(tname, 'snakeCase').value, tid: tid }))
const eventParams = computed(() => ({ ...tournamentParams.value, year, eid }))
</script>

<template>
    <card class="full-card">
        <template #title>
            <div class="flex items-center gap-3">
                <div class="rounded-full bg-violet-800 w-10 h-10 flex justify-center items-center">
                    <Avatar v-if="category" :image="`/category/${category}.svg`" class="border-none" />
                </div>
                <div>
                    <NuxtLink class="hover-link" :to="{ name: 'tournament', params: tournamentParams }">{{ tname }}
                    </NuxtLink>
                </div>
            </div>
        </template>
        <template #subtitle>
            <div v-if="ename">{{ ename }}</div>
        </template>
        <template #content>
            <div class="flex flex-col gap-1 justify-end">
                <Divider />
                <div class="text-center md:text-left" v-if="city">
                    <span>{{ city }}</span>
                    <span>
                        <!--FIXME: Flag components-->
                        <Icon v-if="countryCode" :name="`flag:${countryCode.toLowerCase()}-4x3`" />
                        <component v-else :is="`Icons${country}`" />
                    </span>
                </div>
                <div class="text-center md:text-left">{{ getLongDates(start_date, end_date) }}</div>
                <div v-if="surface" class="text-center md:text-left">{{ surface }}</div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between md:justify-evenly mt-5">
                <u-button v-for="page in EVENT_PAGES" :key="page.title" :label="page.title" variant="outline" size="sm"
                    :icon="page.icon" :to="{ name: page.name, params: eventParams }" :ui="{ rounded: 'rounded-full' }"
                    :disabled="isDisabled" />
            </div>
        </template>
    </card>
</template>