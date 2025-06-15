<script setup lang="ts">
import { UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { tour, results } = defineProps<{
  results: APIPlayerRecordType
  status: APIStatusType
  tour: TourType
}>()
const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
const {
  ui: { icons }
} = useAppConfig()

type FlattenedYearRecordWithType = {
  year: number
  type: "Singles" | "Doubles"
  [key: string]: RoundType | number | "Singles" | "Doubles"
}

const resultsByYear = computed(() => {
  const collect = (group: Record<string, PlayerRecordType[]>, type: "Singles" | "Doubles"): Record<number, FlattenedYearRecordWithType> => {
    const yearMap: Record<number, FlattenedYearRecordWithType> = {}

    for (const tourKey in group) {
      for (const record of group[tourKey]) {
        const { year, round } = record
        if (!yearMap[year]) {
          yearMap[year] = { year, type }
        }
        yearMap[year][tourKey] = round
      }
    }

    return yearMap
  }

  const singlesMap = collect(results.singles, "Singles")
  const doublesMap = collect(results.doubles, "Doubles")

  const merged = [...Object.values(singlesMap), ...Object.values(doublesMap)]

  return merged.sort((a, b) => a.year - b.year)
})

type flattenedResultsType = (typeof resultsByYear.value)[number]

const tournamentMap = {
  "580": "Australian Open",
  "520": "French Open",
  "540": "Wimbledon",
  "560": "US Open",
  "605": "ATP Finals",
  "10": "WTA Finals",
  "96": "Olympics"
}

const columns: TableColumn<flattenedResultsType>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return h(UButton, {
          variant: "link",
          color: "neutral",
          icon: row.getIsExpanded() ? icons.minus : icons.plus,
          onClick: () => row.toggleExpanded()
        })
      }
    }
  },
  {
    accessorKey: "year",
    header: "Year"
  },
  {
    accessorKey: "type",
    header: "Singles/Doubles",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(UBadge, { color: row.original.type.toLowerCase() as "singles" | "doubles", label: row.original.type })
      }
    }
  },
  {
    accessorKey: "580",
    header: () =>
      h(
        ULink,
        {
          to: { name: "tournament", params: { id: 580, name: "Australian_Open" } },
          class: "hover-link"
        },
        () => "Australian Open"
      ),
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id: 580, name: "Australian_Open", year: row.original.year, eid: `580${row.original.year}` } },
            class: "hover-link"
          },
          () => row.original["580"] ?? "—"
        )
      }
    }
  },
  {
    accessorKey: "520",
    header: () =>
      h(
        ULink,
        {
          to: { name: "tournament", params: { id: 520, name: "French_Open" } },
          class: "hover-link"
        },
        () => "French Open"
      ),
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id: 520, name: "French_Open", year: row.original.year, eid: `520${row.original.year}` } },
            class: "hover-link"
          },
          () => row.original["520"] ?? "—"
        )
      }
    }
  },
  {
    accessorKey: "540",
    header: () =>
      h(
        ULink,
        {
          to: { name: "tournament", params: { id: 540, name: "Wimbledon" } },
          class: "hover-link"
        },
        () => "Wimbledon"
      ),
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id: 540, name: "Wimbledon", year: row.original.year, eid: `540${row.original.year}` } },
            class: "hover-link"
          },
          () => row.original["540"] ?? "—"
        )
      }
    }
  },
  {
    accessorKey: "560",
    header: () =>
      h(
        ULink,
        {
          to: { name: "tournament", params: { id: 560, name: "US_Open" } },
          class: "hover-link"
        },
        () => "US Open"
      ),
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id: 560, name: "US_Open", year: row.original.year, eid: `560${row.original.year}` } },
            class: "hover-link"
          },
          () => row.original["560"] ?? "—"
        )
      }
    }
  },
  {
    accessorKey: tour === "ATP" ? "605" : "10",
    header: () =>
      h(
        ULink,
        {
          to: { name: "tournament", params: { id: tour === "ATP" ? 605 : 10, name: tour === "ATP" ? "ATP_Finals" : "WTA_Finals" } },
          class: "hover-link"
        },
        () => "Year End Finals"
      ),
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(
          ULink,
          {
            to: {
              name: "event",
              params: {
                id: tour === "ATP" ? 605 : 10,
                name: tour === "ATP" ? "ATP_Finals" : "WTA_Finals",
                year: row.original.year,
                eid: `${tour === "ATP" ? 605 : 10}${row.original.year}`
              }
            },
            class: "hover-link"
          },
          () => row.original[tour === "ATP" ? "605" : "10"] ?? "—"
        )
      }
    }
  },
  {
    accessorKey: "96",
    header: () =>
      h(
        ULink,
        {
          to: { name: "tournament", params: { id: 96, name: "Olympics" } },
          class: "hover-link"
        },
        () => "Olympics"
      ),
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id: 96, name: "Olympics", year: row.original.year, eid: `96${row.original.year}` } },
            class: "hover-link"
          },
          () => row.original["96"] ?? "—"
        )
      }
    }
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="resultsByYear"
    :columns
    :loading="['pending', 'idle'].includes(status)"
    :grouping="['year']"
    :grouping-options="grouping_options"
    sticky
    :ui="{
      root: 'max-h-200 min-w-full',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
    :empty="`No records found for ${name}`"
  />
</template>
