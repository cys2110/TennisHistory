<script setup lang="ts">
import type { Surface, TitlesAndFinals } from '@/utils/types';
import { useConversion } from '@/utils/useConversion';
import { useGlobalBreakpoints } from '@/utils/useGlobalBreakpoints';
import { useImages } from '@/utils/useImages';
import { useUrlNames } from '@/utils/useUrlNames';
import { SURFACES } from '@/utils/variables';
import { computed } from 'vue';

const { isBreakpointOrUp } = useGlobalBreakpoints()
const { encodeName } = useUrlNames()
const { formattedDates } = useConversion()
const { categorySrc } = useImages()

const props = defineProps<{
    events: TitlesAndFinals[]
}>()

const eventPages = [
    { title: 'Details', name: 'event' },
    { title: 'Results', name: 'results' },
    { title: 'Draw', name: 'draw' },
]

const totalEvents = computed(() => {
    const totalEventsObject = props.events.reduce((acc: { [key: number]: number }, obj) => {
        acc[obj.year] = (acc[obj.year] || 0) + 1
        return acc
    }, {} as { [key: number]: number })
    return Object.entries(totalEventsObject).map(([year, count]) => ({ year: +year, count }))
})
</script>

<template>
    <Timeline :value="totalEvents" layout="horizontal" align="bottom">
        <template #opposite="{ item }">{{ item.count }}</template>
        <template #content="{ item }"><span class="font-bold">{{ item.year }}</span></template>
    </Timeline>
    <Timeline :value="events" :align="isBreakpointOrUp('md') ? 'alternate' : 'left'">
        <template #opposite="{ item }">{{ formattedDates(item.start, item.end) }}</template>
        <template #content="{ item }">
            <Panel v-if="isBreakpointOrUp('md')" class="my-3">
                <template #header>
                    <div class="flex items-center gap-3">
                        <div class="rounded-full bg-violet-700 w-10 h-10 flex justify-center items-center">
                            <Avatar :image="categorySrc(item.category)" size="large" />
                        </div>
                        <div>
                            <router-link class="hover-link font-bold"
                                :to="{ name: 'tournament', params: { name: encodeName(item.tname), id: item.tid } }">
                                {{ item.tname }}
                            </router-link>
                        </div>
                    </div>
                </template>
                <div class="flex flex-col gap-1">
                    <Divider />
                    <div class="text-zinc-400 text-center md:text-left">{{ SURFACES[item.surface as Surface] }}</div>
                </div>
                <template #footer>
                    <div class="flex justify-between md:justify-evenly mt-5">
                        <Button v-for="(page, index) in eventPages" :key="index" as="router-link" :label="page.title"
                            size="small" class="!text-zinc-400 hover:!text-zinc-300" variant="outlined" rounded raised
                            :to="{ name: page.name, params: { name: encodeName(item.tname), id: item.tid, year: item.year, eid: item.id } }" />
                    </div>
                </template>
            </Panel>
            <router-link v-else :to="{ name: 'tournament', params: { name: encodeName(item.tname), id: item.tid } }">
                {{ item.tname }}
            </router-link>
        </template>
    </Timeline>
</template>