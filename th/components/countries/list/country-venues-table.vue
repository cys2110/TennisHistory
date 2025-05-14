<script setup lang="ts">
import { BaseLink, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { venues, count, status } = defineProps<{
  venues: VenueInterface[]
  status: APIStatusType
  count: number
  name: string | undefined
}>()

const appConfig = useAppConfig()
const route = useRoute()
const skip = defineModel<number>({ default: 0 })
const sort = defineModel<"ASC" | "DESC" | undefined>("sort", { default: undefined })

const table = useTemplateRef<ComponentPublicInstance>("table")

onMounted(async () => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 150,
      canLoadMore: () => status !== "pending" && venues.length < count
    }
  )
})

const columns: TableColumn<VenueInterface>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return h(UButton, {
          variant: "link",
          color: "neutral",
          icon: row.getIsExpanded() ? appConfig.ui.icons.minus : appConfig.ui.icons.plus,
          onClick: () => row.toggleExpanded()
        })
      }
    }
  },
  {
    id: "city",
    accessorKey: "city",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "City",
        icon: sort.value ? (sort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          sort.value = sort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return row.getValue("city")
      }
    }
  },
  {
    id: "venue",
    accessorKey: "venue.name",
    header: "Venues",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `${row.getValue("venue")} ${row.getValue("venue") === 1 ? "venue" : "venues"}`
      } else {
        return h(
          BaseLink,
          {
            type: "venue",
            id: row.original.id
          },
          () => (row.original.name ? `${row.original.name}, ${row.original.city}` : row.original.city)
        )
      }
    },
    aggregationFn: "count"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    ref="table"
    :data="venues"
    :columns
    class="max-h-200"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="['city']"
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
    <template #empty> No venues located in {{ name ?? route.params.id }} </template>
  </u-table>
</template>
