<script setup>
import { useChangeCase } from '@vueuse/integrations';
import defaultLayout from '~/layouts/default.vue'

const route = useRoute()
const pname = ref(route.params.pname)

const pages = [
    { title: "Player Details", name: "player", icon: "i-solar-user-circle-line-duotone" },
    { title: "Activity", name: "activity", icon: "i-ph-calendar-dots-duotone" },
    { title: "Titles and Finals", name: "titles", icon: "i-ph-trophy-duotone" },
    { title: "Win-Loss Index", name: "index", icon: "i-solar-graph-new-bold-duotone" },
    { title: "Stats", name: "stats", icon: "i-solar-chart-2-bold-duotone" }
];

const pageName = computed(() => {
    const filteredPage = Object.entries(pages).find(([key, value]) => value.name === route.name)
    return filteredPage[1].title
})

const pageIcon = computed(() => {
    const filteredPage = Object.entries(pages).find(([key, value]) => value.name === route.name)
    return filteredPage[1].icon
})

useHead({ title: `${pageName.value} | ${useChangeCase(pname.value, 'capitalCase').value}` })

// Breadcrumbs
const links = [
    { label: 'Home', icon: 'i-ph-house-duotone', to: '/' },
    { label: useChangeCase(pname.value, 'capitalCase').value, to: { name: 'player' } },
    { label: pageName.value, icon: pageIcon.value }
]
</script>

<template>
    <defaultLayout>
        <u-breadcrumb :links class="mb-5"
            :ui="{ active: 'text-emerald-400', inactive: 'text-emerald-600', base: 'text-emerald-600 text-lg', divider: { base: 'text-zinc-400' } }" />
        <page-title>
            <template #heading>{{ useChangeCase(pname, 'capitalCase').value }}</template>
            <template #subtitle>{{ pageName }}</template>
        </page-title>
        <toolbar class="mb-5 flex justify-between">
            <template #start>
                <div id="player-toolbar-start"></div>
            </template>
            <template #center>
                <div id="player-toolbar-center"></div>
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