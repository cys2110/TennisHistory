<script setup>
import { useChangeCase } from '@vueuse/integrations';
import defaultLayout from '~/layouts/default.vue'

const route = useRoute()
const tname = ref(route.params.tname)
const year = ref(route.params.year)

const pages = [
    { title: "Event Details", name: "event", icon: "i-ix-item-details" },
    { title: "Results", name: "results", icon: "i-clarity-view-cards-line" },
    { title: "Draw", name: "draw", icon: "i-icon-park-twotone-tree-diagram" },
];

const pageName = computed(() => {
    const filteredPage = Object.entries(pages).find(([key, value]) => value.name === route.name)
    return filteredPage[1].title
})

const pageIcon = computed(() => {
    const filteredPage = Object.entries(pages).find(([key, value]) => value.name === route.name)
    return filteredPage[1].icon
})

useHead({ title: `${pageName.value} | ${useChangeCase(tname.value, 'capitalCase').value} ${year.value}` })

// Breadcrumbs
const links = [
    { label: 'Home', icon: 'i-ph-house-duotone', to: '/' },
    { label: useChangeCase(tname.value, 'capitalCase').value, to: { name: 'tournament' } },
    { label: year.value, icon: 'i-ph-calendar-dots-duotone' },
    { label: pageName.value, icon: pageIcon.value }
]
</script>

<template>
    <defaultLayout>
        <u-breadcrumb :links class="mb-5"
            :ui="{ active: 'text-emerald-400', inactive: 'text-emerald-600', base: 'text-emerald-600 text-lg', divider: { base: 'text-zinc-400' } }" />
        <page-title>
            <template #heading>{{ useChangeCase(tname, 'capitalCase').value }} {{ year }}</template>
            <template #subtitle>{{ pageName }}</template>
        </page-title>
        <toolbar class="mb-5 flex justify-between">
            <template #start>
                <div id="event-toolbar-start"></div>
            </template>
            <template #end>
                <div class="flex flex-col md:flex-row md:items-center md:justify-center items-end gap-2">
                    <template v-for="page in pages" :key="page.title">
                        <Button variant="outlined" v-if="route.name !== page.name" as="router-link" :label="page.title"
                            size="small" rounded raised :to="{ name: page.name }" />
                    </template>
                </div>
            </template>
        </toolbar>
        <slot />
    </defaultLayout>
</template>