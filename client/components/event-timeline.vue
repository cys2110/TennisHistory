<script setup>
import { useChangeCase } from '@vueuse/integrations';

const props = defineProps(['events', 'counts'])
</script>

<template>
    <div>
        <timeline v-if="counts.length > 0" :value="counts" layout="horizontal" align="bottom">
            <template #opposite="{ item }">
                <span class="text-zinc-400">{{ item.count }}</span>
            </template>
            <template #content="{ item }">
                <span class="font-bold text-zinc-300">{{ item.year }}</span>
            </template>
        </timeline>
        <timeline :value="events" align="alternate" class="w-2/3 mx-auto">
            <template #opposite="{ item }">
                <span class="text-zinc-400">{{ item.date }}</span>
            </template>
            <template #content="{ item }">
                <card class="mb-10 pt-3 px-3">
                    <template #header>
                        <NuxtLink class="hover-link"
                            :to="{ name: 'tournament', params: { tname: useChangeCase(item.tname, 'snakeCase').value, tid: item.tid } }">
                            {{ item.tname }}</NuxtLink>
                    </template>
                    <template #subtitle>
                        <span class="w-full">{{ item.surface }}</span>
                    </template>
                    <template #footer>
                        <div class="flex justify-evenly">
                            <Button v-for="(page, index) in EVENT_PAGES" :key="index" as="router-link" class="text-xs"
                                :label="page.title" size="small" variant="outlined" rounded raised
                                :to="{ name: page.name, params: { tname: useChangeCase(item.tname, 'snakeCase').value, tid: item.tid, year: item.year, eid: item.eid } }" />
                        </div>
                    </template>
                </card>
            </template>
        </timeline>
    </div>
</template>