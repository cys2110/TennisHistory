<script setup lang="ts">
import { BaseLink, EventButtons } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { events } = defineProps<{ events: CountryEventType[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<CountryEventType>[] = [
  {
    accessorKey: "year",
    header: "Year"
  },
  {
    id: "Winner",
    header: "Winner",
    cell: ({ row }) => {
      const c1 = row.original.c1
      return h("div", { class: "flex items-center gap-2" }, [
        h(BaseLink, { type: "country", country: c1 }),
        h(BaseLink, { type: "country" }, () => c1.name)
      ])
    }
  },
  {
    id: "Finalist",
    header: "Finalist",
    cell: ({ row }) => {
      const c2 = row.original.c2
      return h("div", { class: "flex items-center gap-2" }, [
        h(BaseLink, { type: "country", country: c2 }),
        h(BaseLink, { type: "country" }, () => c2.name)
      ])
    }
  },
  { accessorKey: "score", header: "Score" },
  {
    id: "navigation",
    cell: ({ row }) =>
      h(EventButtons, {
        tournament: { id: route.params.id as string, name: route.params.name as string },
        year: row.original.year,
        id: row.original.id,
        draw_type: "Country draw"
      })
  }
]
</script>

<template>
  <u-table
    :data="events"
    :columns
    class="w-fit mx-auto"
    :loading="['pending', 'idle'].includes(status)"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex gap-8"
      >
        <u-skeleton
          v-for="_ in 5"
          :key="_"
          class="h-4 rounded-lg"
        />
      </div>
    </template>
    <template #empty> No events found for {{ name }}</template>
  </u-table>
</template>
