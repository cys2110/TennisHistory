<script setup>
const props = defineProps(['h2h'])

const comparisons = computed(() => {
    return [
        { title: 'Win-Loss', p1: props.h2h.p1_wl, p2: props.h2h.p2_wl, percent: percentage(props.h2h.p1_wl_pc.low, props.h2h.p1_wl_pc.low + props.h2h.p2_wl_pc.low) },
        { title: 'Titles', p1: props.h2h.p1_titles.low, p2: props.h2h.p2_titles.low, percent: percentage(props.h2h.p1_titles.low, props.h2h.p1_titles.low + props.h2h.p2_titles.low) },
        { title: 'Prize Money', p1: `US$${props.h2h.p1_pm.low.toLocaleString('en-GB')}`, p2: `US$${props.h2h.p2_pm.low.toLocaleString('en-GB')}`, percent: percentage(props.h2h.p1_pm.low, props.h2h.p1_pm.low + props.h2h.p2_pm.low) },
        ...(props.p1_ch && props.p2_ch ? [{ title: 'Career High', p1: props.p1_ch.low, p2: props.p2_ch.low, percent: percentage(props.p1_ch.low, props.p1_ch.low + props.p2_ch.low) }] : [])
    ].filter(Boolean)
})
</script>

<template>
    <div v-for="comparison in comparisons" :key="comparison.title" class="my-1 w-full">
        <div class="flex justify-between items-center text-zinc-300">
            <div>{{ comparison.p1 }}</div>
            <div class="font-bold">{{ comparison.title }}</div>
            <div>{{ comparison.p2 }}</div>
        </div>
        <div class="w-full mt-1">
            <u-progress v-if="isNaN(comparison.percent)" animation="carousel" />
            <u-progress v-else :value="comparison.percent" />
        </div>
    </div>
</template>