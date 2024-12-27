<script setup>
import { useChangeCase } from '@vueuse/integrations';
const props = defineProps(['event', 'year'])

const earnings = {
    Seed: props.event.seed,
    Status: props.event.status,
    Points: props.event.points,
    Rank: props.event.rank,
    'Prize Money': `${CURRENCIES[props.event.currency]}${props.event.pm.low.toLocaleString('en-GB')}`
}

const tagColors = {
    Seed: 'bg-orange-500 text-orange-800',
    Status: 'bg-fuchsia-500 text-fuchsia-800',
    Points: 'bg-teal-500 text-teal-800',
    Rank: 'bg-blue-500 text-blue-800',
    'Prize Money': 'bg-emerald-500 text-emerald-800',
}

// Get country code for icons
const countryCode = getCountryCode(props.event.country)
</script>

<template>
    <card :id="event.eid" class="w-full px-12 pt-5">
        <template #header>
            <div class="flex text-lg">
                <span>
                    <NuxtLink class="hover-link font-bold" :to="{
                        name: 'tournament', params: {
                            tname: useChangeCase(event.name, 'snakeCase').value,
                            tid: event.tid
                        }
                    }">
                        {{ event.name }}</NuxtLink>
                </span>
                <span v-if="event.ename">&nbsp;| {{ event.ename }}</span>
            </div>
        </template>
        <template #subtitle>
            <div class="flex items-center justify-between">
                <div>
                    <span>{{ event.start }}-{{ event.end }}</span>
                    <span>&nbsp;| {{ event.city }}</span>
                    <span class="ml-3">
                        <Icon v-if="countryCode" :name="`flag:${countryCode.toLowerCase()}-4x3`" />
                        <component v-else :is="`Icons${event.country}`" />
                    </span>
                </div>
                <div>{{ event.surface }}</div>
            </div>
            <Divider class="mb-1" />
        </template>
        <template #content>
            <player-activity-table :event :year />
        </template>
        <template #footer>
            <div class="flex justify-between gap-3">
                <div class="flex gap-1 text-center items-center">
                    <template v-for="(value, key) in earnings" :key>
                        <u-badge v-if="value" :label="`${key}: ${value}`" variant="outline" size="sm"
                            :ui="{ rounded: 'rounded-lg' }" :class="tagColors[key]" />
                    </template>
                </div>
                <div class="flex gap-1">
                    <Button v-for="button in EVENT_PAGES" :key="button.title" as="router-link" :label="button.title"
                        size="small" class="mx-1" variant="outlined" raised :to="{
                            name: button.name, params: {
                                tname: useChangeCase(event.name, 'snakeCase').value,
                                tid: event.tid,
                                year: year,
                                eid: event.eid
                            }
                        }" />
                </div>
            </div>
        </template>
    </card>
</template>