<script setup lang="ts">
import { UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { venues, status } = defineProps<{
  venues: VenueInterface[]
  status: APIStatusType
}>()

const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))

const columns: TableColumn<VenueInterface>[] = [
  {
    id: "city",
    accessorKey: "city",
    header: ({ column }) =>
      h(UButton, {
        variant: "link",
        color: "neutral",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        label: "City",
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) => {
      if (row.getIsGrouped())
        return h(UButton, {
          variant: "link",
          color: "neutral",
          label: row.getValue("city") as string,
          icon: row.getIsExpanded() ? appIcons.minus : appIcons.plus,
          onClick: () => row.toggleExpanded()
        })
    },
    meta: { class: { th: "text-left", td: "text-left" } }
  },
  {
    id: "venue",
    accessorKey: "venue.name",
    header: "Venues",
    aggregationFn: "count",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `${row.getValue("venue")} ${row.getValue("venue") === 1 ? "venue" : "venues"}`
      } else {
        return h(
          ULink,
          {
            to: {
              name: "venue",
              params: { id: encodeName(row.original.id) }
            },
            class: "hover-link"
          },
          () => row.original.name
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
    :data="venues"
    :columns
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="['city']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'max-h-200 max-w-full min-w-full md:min-w-3/4 xl:min-w-1/2 mx-auto',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
    :empty="`No venues located in ${name}`"
  />
</template>
