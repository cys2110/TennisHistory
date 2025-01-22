<script setup lang="ts">
const props = defineProps<{ h2h: H2H }>()
const { p1, p2 } = props.h2h

const comparisons = computed(() => {
  return [
    { title: "Win-Loss", p1: p1.wl, p2: p2.wl, percent: percentage(p1.wl_pc.low, p1.wl_pc.low + p2.wl_pc.low) },
    { title: "Titles", p1: p1.titles, p2: p2.titles, percent: percentage(parseInt(p1.titles), parseInt(p1.titles) + parseInt(p2.titles)) },
    { title: "Prize Money", p1: p1.pm.low.toLocaleString("en-GB", { style: "currency", currency: "USD" }), p2: p2.pm.low.toLocaleString("en-GB", { style: "currency", currency: "USD" }), percent: percentage(p1.pm.low, p1.pm.low + props.h2h.p2.pm.low) },
    { title: "Career High", p1: p1.ch?.low ?? 0, p2: p2.ch?.low ?? 0, percent: p1.ch && p2.ch ? percentage(p1.ch.low, p1.ch.low + p2.ch.low) : null }
  ]
})
</script>

<template>
  <u-page-list>
    <div
      v-for="comparison in comparisons"
      :key="comparison.title"
      class="w-full"
    >
      <div class="grid grid-cols-3 items-center">
        <div>{{ comparison.p1 }}</div>
        <div class="text-center font-bold">{{ comparison.title }}</div>
        <div class="text-right">{{ comparison.p2 }}</div>
      </div>
      <u-progress v-model="comparison.percent" />
    </div>
  </u-page-list>
</template>
