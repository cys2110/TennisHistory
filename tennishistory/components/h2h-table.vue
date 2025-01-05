<script setup lang="ts">
const props = defineProps<{ h2h: H2H }>();

const comparisons = computed(() => {
    return [
        { title: "Win-Loss", p1: props.h2h.p1.wl, p2: props.h2h.p2.wl, percent: percentage(props.h2h.p1.wl_pc.low, props.h2h.p1.wl_pc.low + props.h2h.p2.wl_pc.low) },
        { title: "Titles", p1: props.h2h.p1.titles, p2: props.h2h.p2.titles, percent: percentage(parseInt(props.h2h.p1.titles), parseInt(props.h2h.p1.titles) + parseInt(props.h2h.p2.titles)) },
        { title: "Prize Money", p1: `US$${props.h2h.p1.pm.low.toLocaleString("en-GB")}`, p2: `US$${props.h2h.p2.pm.low.toLocaleString("en-GB")}`, percent: percentage(props.h2h.p1.pm.low, props.h2h.p1.pm.low + props.h2h.p2.pm.low) },
        ...(props.h2h.p1.ch && props.h2h.p2.ch ? [{ title: "Career High", p1: props.h2h.p1.ch.low, p2: props.h2h.p2.ch.low, percent: percentage(props.h2h.p1.ch.low, props.h2h.p1.ch.low + props.h2h.p2.ch.low) }] : [])
    ].filter(Boolean);
});
</script>

<template>
    <div
        v-for="comparison in comparisons"
        :key="comparison.title"
        class="my-1 w-full"
    >
        <div class="flex justify-between items-center text-zinc-300">
            <div>{{ comparison.p1 }}</div>
            <div class="font-bold">{{ comparison.title }}</div>
            <div>{{ comparison.p2 }}</div>
        </div>
        <div class="w-full mt-1">
            <prime-progress-bar
                v-if="isNaN(comparison.percent)"
                mode="indeterminate"
                style="height: 6px"
            />
            <shadcn-progress
                v-else
                :model-value="comparison.percent"
            />
        </div>
    </div>
</template>
