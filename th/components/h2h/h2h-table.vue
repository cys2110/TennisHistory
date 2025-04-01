<script setup lang="ts">
const { h2h } = defineProps<{ h2h: { p1: H2HPlayerInterface; p2: H2HPlayerInterface } }>()

const p1Numbers = computed(() => {
  return {
    wl: percentage(h2h.p1.wins, h2h.p1.wins + h2h.p1.losses),
    titles: h2h.p1.titles,
    pm: Number(h2h.p1.pm.replaceAll(",", "")),
    ch: h2h.p1.ch ? h2h.p1.ch : 0
  }
})

const p2Numbers = computed(() => {
  return {
    wl: percentage(h2h.p2.wins, h2h.p2.wins + h2h.p2.losses),
    titles: h2h.p2.titles,
    pm: Number(h2h.p2.pm.replaceAll(",", "")),
    ch: h2h.p2.ch ? h2h.p2.ch : 0
  }
})

const comparisons = computed(() => [
  {
    title: "Win-Loss",
    p1: `${h2h.p1.wins}—${h2h.p1.losses} (${p1Numbers.value.wl}%)`,
    p2: `${h2h.p2.wins}—${h2h.p2.losses} (${p2Numbers.value.wl}%)`,
    percent: percentage(p1Numbers.value.wl, p1Numbers.value.wl + p2Numbers.value.wl)
  },
  {
    title: "Titles",
    p1: h2h.p1.titles,
    p2: h2h.p2.titles,
    percent: percentage(p1Numbers.value.titles, p1Numbers.value.titles + p2Numbers.value.titles)
  },
  {
    title: "Prize Money",
    p1: `US$${h2h.p1.pm}`,
    p2: `US$${h2h.p2.pm}`,
    percent: percentage(p1Numbers.value.pm, p1Numbers.value.pm + p2Numbers.value.pm)
  },
  {
    title: "Career High",
    p1: h2h.p1.ch ?? "—",
    p2: h2h.p2.ch ?? "—",
    percent: h2h.p1.ch && h2h.p2.ch ? percentage(p1Numbers.value.ch, p1Numbers.value.ch + p2Numbers.value.ch) : null
  }
])
</script>

<template>
  <u-page-list class="w-full">
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
        :ui="{ indicator: 'bg-primary-700', base: 'bg-emerald-700' }"
      />
    </div>
  </u-page-list>
</template>
