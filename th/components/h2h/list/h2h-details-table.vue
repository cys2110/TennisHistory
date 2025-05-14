<script setup lang="ts">
import { PlayerAvatar } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { c1, c2, h2h, status } = defineProps<{
  c1: CountryInterface
  c2: CountryInterface
  h2h: {
    p1: H2HPlayerInterface
    p2: H2HPlayerInterface
    p1Wins: number
    p2Wins: number
  } | null
  status: APIStatusType
}>()

const route = useRoute()
const p1Name = computed(() => decodeName(route.params.p1Name as string))
const p2Name = computed(() => decodeName(route.params.p2Name as string))

const formattedData = computed(() => {
  if (h2h) {
    return [
      { title: "Wins", p1: h2h.p1Wins, p2: h2h.p2Wins },
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
      { title: "Turned Pro", p1: h2h.p1.turned_pro ?? "Unknown", p2: h2h.p2.turned_pro ?? "Unknown" },
      {
        title: "Win-Loss",
        p1: `${h2h.p1.wins}—${h2h.p1.losses} (${percentage(h2h.p1.wins, h2h.p1.wins + h2h.p1.losses)}%)`,
        p2: `${h2h.p2.wins}—${h2h.p2.losses} (${percentage(h2h.p2.wins, h2h.p2.wins + h2h.p2.losses)}%)`
      },
      {
        title: "Titles",
        p1: h2h.p1.titles,
        p2: h2h.p2.titles
      },
      {
        title: "Prize Money",
        p1: `US$${h2h.p1.pm}`,
        p2: `US$${h2h.p2.pm}`
      },
      {
        title: "Career High",
        p1: h2h.p1.ch ?? "—",
        p2: h2h.p2.ch ?? "—"
      }
    ]
  }
  return []
})

const columns: TableColumn<{ title: string; p1: string | number; p2: string | number }>[] = [
  {
    accessorKey: "p1",
    header: () => h(PlayerAvatar, { player: { id: route.params.p1Id as string, name: p1Name.value, country: c1 }, bold: true }),
    meta: { class: { td: "px-5 font-semibold", th: "px-5" } }
  },
  {
    accessorKey: "title",
    header: "",
    meta: { class: { td: "px-5" } }
  },
  {
    accessorKey: "p2",
    header: () => h(PlayerAvatar, { player: { id: route.params.p2Id as string, name: p2Name.value, country: c2 }, bold: true }),
    meta: { class: { td: "px-5 font-semibold", th: "px-5" } }
  }
]
</script>

<template>
  <u-table
    :data="formattedData"
    :columns
    :loading="['pending', 'idle'].includes(status)"
    sticky
    class="max-h-200 w-fit mx-auto"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>
    <template #empty> No details found for {{ p1Name }} and {{ p2Name }} </template>
  </u-table>
</template>
