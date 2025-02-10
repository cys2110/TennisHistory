<script setup lang="ts">
const { h2h } = defineProps<{ h2h: H2HType }>()

const comparisons = computed(() => {
  return [
    { title: "Win-Loss", p1: h2h.p1.wl, p2: h2h.p2.wl, percent: percentage(Number(h2h.p1.wl_pc), Number(h2h.p1.wl_pc) + Number(h2h.p2.wl_pc)) },
    { title: "Titles", p1: h2h.p1.titles, p2: h2h.p2.titles, percent: percentage(Number(h2h.p1.titles), Number(h2h.p1.titles) + Number(h2h.p2.titles)) },
    { title: "Prize Money", p1: Number(h2h.p1.pm).toLocaleString("en-GB", { style: "currency", currency: "USD" }), p2: Number(h2h.p2.pm).toLocaleString("en-GB", { style: "currency", currency: "USD" }), percent: percentage(Number(h2h.p1.pm), Number(h2h.p1.pm) + Number(h2h.p2.pm)) },
    { title: "Career High", p1: h2h.p1.ch ? Number(h2h.p1.ch) : 0, p2: h2h.p2.ch ? Number(h2h.p2.ch) : 0, percent: h2h.p1.ch && h2h.p2.ch ? percentage(Number(h2h.p1.ch), Number(h2h.p1.ch) + Number(h2h.p2.ch)) : null }
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
      <u-progress
        v-model="comparison.percent"
        :ui="{ indicator: 'bg-violet-600', base: 'bg-teal-600' }"
      />
    </div>
  </u-page-list>
</template>
