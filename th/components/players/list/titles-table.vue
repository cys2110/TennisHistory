<script setup lang="ts">
import { BaseLink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { events, status, checked } = defineProps<{ events: { title: string; events: EventCardType[] }[]; status: APIStatusType; checked: boolean }>()
const appConfig = useAppConfig()

const formattedEvents = computed(() => {
  const newArray: EventCardType[] = []
  events.forEach(event => {
    newArray.push(...event.events)
  })
  return newArray
})

const columns: TableColumn<EventCardType>[] = [
  { id: "expand" },
  { accessorKey: "year", id: "year" },
  {
    id: "tournament",
    accessorKey: "tournament.id",
    header: "Tournament",
    aggregationFn: "uniqueCount",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        const count = row.getValue("tournament")
        return `${count} ${count === 1 ? "tournament" : "tournaments"}`
      } else {
        return h(BaseLink, {
          tournament: row.original.tournament,
          type: "tournament",
          class: "font-semibold"
        })
      }
    }
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        const count = row.getValue("category")
        return `${count} ${count === 1 ? "category" : "categories"}`
      } else {
        return h(BaseLink, { id: row.original.category as string, type: "category", class: "mx-auto" })
      }
    },
    aggregationFn: "uniqueCount"
  },
  { accessorKey: "dates", header: "Dates" },
  {
    id: "surface",
    accessorKey: "surface.id",
    header: "Surface",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        const count = row.getValue("surface")
        return `${count} ${count === 1 ? "surface" : "surfaces"}`
      } else {
        return h(BaseLink, {
          id: row.original.surface.id,
          type: "surface"
        })
      }
    },
    aggregationFn: "uniqueCount"
  },
  {
    id: "country",
    accessorFn: row => row.venues[0].country,
    header: "Country",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        const count = row.getValue("country")
        return `${count} ${count === 1 ? "country" : "countries"}`
      } else {
        const venues = row.original.venues
        return h(BaseLink, { country: venues[0].country, type: "country", class: "mx-auto" })
      }
    },
    aggregationFn: "uniqueCount"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="formattedEvents"
    :columns
    sticky
    class="w-full mx-auto max-h-200"
    :loading="['pending', 'idle'].includes(status)"
    :grouping="['year']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'min-w-full',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex w-full gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>

    <template #empty> No index available </template>

    <template #expand-cell="{ row }">
      <div
        v-if="row.getIsGrouped()"
        class="flex items-center"
      >
        <span
          class="inline-block"
          :style="{ width: `calc(${row.depth} * 1rem)` }"
        />

        <u-button
          variant="link"
          color="neutral"
          class="mr-2"
          size="xs"
          :icon="row.getIsExpanded() ? appConfig.ui.icons.minus : appConfig.ui.icons.plus"
          @click="row.toggleExpanded()"
        />

        <u-link
          class="hover-link w-fit font-semibold"
          :to="{
            name: 'event',
            params: { id: row.original.tournament.id, name: encodeName(row.original.tournament.name), year: row.original.year, eid: row.original.id }
          }"
        >
          {{ row.getValue("year") }}
        </u-link>
      </div>
    </template>
  </u-table>
</template>
