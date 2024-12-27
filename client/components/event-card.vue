<script setup>
import { useChangeCase } from '@vueuse/integrations';

const props = defineProps(['event'])
const { surface, country, city, tname, tid, ename, year, eid, start, dates, category } = props.event

// Disabled buttons if event has not started yet
const startDate = new Date(start)
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
                <div class="rounded-full dark:bg-violet-800 w-10 h-10 flex justify-center items-center">
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
                <Divider class="mt-1" />
                <div class="text-center md:text-left flex items-center gap-2" v-if="city">
                    <span>{{ city }}</span>
                    <span>
                        <Icon v-if="countryCode" :name="`flag:${countryCode}-4x3`"
                            class="border border-solid border-zinc-500 rounded" />
                        <component v-else :is="`Icons${country}`" />
                    </span>
                </div>
                <div class="text-center md:text-left">{{ dates }}</div>
                <div v-if="surface" class="text-center md:text-left">{{ surface }}</div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between md:justify-evenly mt-5">
                <u-button v-for="page in EVENT_PAGES" :key="page.title" :label="page.title" size="sm" :icon="page.icon"
                    :to="{ name: page.name, params: eventParams }"
                    :ui="{ rounded: 'rounded-full', icon: { size: { sm: 'text-base' } }, base: 'py-1 flex items-center' }"
                    class="border border-solid border-emerald-600 hover:border-emerald-500 dark:border-emerald-700 dark:hover-border-emerald-600 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover-text-zinc-300 px-2 py-[1.5px] shadow-sm hover:shadow-md shadow-emerald-800 hover:shadow-emerald-800 dark:shadow-emerald-500 dark:hover:shadow-emerald-500 flex gap-1"
                    :disabled="isDisabled">
                </u-button>
            </div>
        </template>
    </card>
</template>