<script setup>
import { useChangeCase } from '@vueuse/integrations';

const props = defineProps(['item', 'type'])

const { data: matches, status, error } = await useFetch('/api/getUmpireResults', {
    method: 'GET',
    params: { id: computed(() => props.item) }
})
</script>

<template>
    <div v-if="matches" class="grid grid-cols-3 gap-5">
        <Fieldset v-for="event in matches" :key="event.eid" class="border-emerald-600">
            <template #legend>
                <NuxtLink class="text-zinc-400 hover-link font-bold"
                    :to="{ name: 'event', params: { tname: useChangeCase(event.tname, 'snakeCase').value, tid: event.tid, year: event.year, eid: event.eid } }">
                    {{ event.tname }} {{ event.year }}
                </NuxtLink>
            </template>
            <div v-for="round in event.rounds" :key="round.round">
                <div class="text-zinc-300 text-base">{{ round.round }}</div>
                <div v-for="match in round.matches" :key="match.match_no" class="ml-3">
                    <NuxtLink v-if="match.match_no" class="hover-link text-zinc-400"
                        :to="{ name: 'match', params: { tname: useChangeCase(event.tname, 'snakeCase').value, tid: event.tid, year: event.year, eid: event.eid, mid: match.match_no } }">
                        {{ match.p1 }} v. {{ match.p2 }}</NuxtLink>
                </div>
            </div>
        </Fieldset>
    </div>
</template>