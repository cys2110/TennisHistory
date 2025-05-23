<script setup lang="ts">
const { h2h, c1, c2 } = defineProps<{
  h2h: { p1: H2HPlayerInterface; p2: H2HPlayerInterface }
  c1: CountryInterface
  c2: CountryInterface
}>()

const route = useRoute()
const p1Id = computed(() => route.params.p1Id as string)
const p2Id = computed(() => route.params.p2Id as string)
const p1Name = computed(() => decodeName(route.params.p1Name as string))
const p2Name = computed(() => decodeName(route.params.p2Name as string))

const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual("lg")

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

const playerDetails = computed(() => [
  { title: "Date of Birth", p1: h2h.p1.dob ?? "Unknown", p2: h2h.p2.dob ?? "Unknown" },
  {
    title: "Height",
    p1: h2h.p1.height ? `${h2h.p1.height}cm (${convertToFt(h2h.p1.height)})` : "Unknown",
    p2: h2h.p2.height ? `${h2h.p2.height}cm (${convertToFt(h2h.p2.height)})` : "Unknown"
  },
  {
    title: "Plays",
    p1: h2h.p1.rh ? handedness(h2h.p1.rh) : "Unknown",
    p2: h2h.p2.rh ? handedness(h2h.p2.rh) : "Unknown"
  },
  {
    title: "Backhand",
    p1: h2h.p1.bh ? `${h2h.p1.bh}-Handed` : "Unknown",
    p2: h2h.p2.bh ? `${h2h.p2.bh}-Handed` : "Unknown"
  },
  { title: "Turned Pro", p1: h2h.p1.turned_pro ?? "Unknown", p2: h2h.p2.turned_pro ?? "Unknown" }
])
</script>

<template>
  <u-page-list class="w-full mt-auto">
    <ClientOnly>
      <div
        v-if="!lgAndUp"
        class="w-full flex flex-col gap-2 mb-2"
      >
        <div class="flex justify-between items-center">
          <player-avatar
            :player="{ id: p1Id, name: p1Name, country: c1 }"
            bold
          />
          <player-avatar
            :player="{ id: p2Id, name: p2Name, country: c2 }"
            bold
          />
        </div>
        <div
          v-for="detail in playerDetails"
          :key="detail.title"
          class="grid grid-cols-3 items-center"
        >
          <div class="font-bold">{{ detail.p1 }}</div>
          <div class="text-center">{{ detail.title }}</div>
          <div class="text-right font-bold">{{ detail.p2 }}</div>
        </div>
      </div>
    </ClientOnly>
    <div
      v-for="comparison in comparisons"
      :key="comparison.title"
      class="w-full"
    >
      <div class="grid grid-cols-3 items-center">
        <div class="font-bold">{{ comparison.p1 }}</div>
        <div class="text-center">{{ comparison.title }}</div>
        <div class="text-right font-bold">{{ comparison.p2 }}</div>
      </div>
      <u-progress
        v-model="comparison.percent"
        :ui="{ indicator: 'bg-primary-700', base: 'bg-emerald-700' }"
      />
    </div>
  </u-page-list>
</template>
