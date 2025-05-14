<script setup lang="ts">
import { BaseLink, UButton, UUser } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

defineProps<{ entries: CountryEntryType[]; status: APIStatusType }>()
const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<CountryEntryType>[] = [
  {
    id: "country",
    accessorKey: "country.id",
    header: "Country",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return h(
          UButton,
          {
            variant: "link",
            color: "neutral",
            icon: row.getIsExpanded() ? appConfig.ui.icons.minus : appConfig.ui.icons.plus,
            onClick: () => row.toggleExpanded(),
            class: "font-semibold"
          },
          () => {
            return h("div", { class: "flex items-center gap-2" }, [
              h(BaseLink, {
                type: "country",
                country: row.original.country
              }),
              h(
                BaseLink,
                {
                  type: "country",
                  id: row.original.country.id
                },
                () => row.original.country.name
              )
            ])
          }
        )
      }
    },
    meta: { class: { td: "text-left" } }
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        const count = row.getValue("id")
        return `${count} ${count === 1 ? "player" : "players"}`
      } else {
        return h(UUser, {
          name: row.original.name,
          avatar: {
            src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.id}`,
            icon: ICONS.player
          },
          to: {
            name: "player",
            params: { id: row.original.id, name: encodeName(row.original.name) }
          },
          ui: { name: "text-xs md:text-sm lg:text-md", root: "w-fit mx-auto" }
        })
      }
    },
    aggregationFn: "uniqueCount"
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Rank",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return (row.getValue("rank") as number).toFixed(0)
      } else {
        return row.original.rank ?? "—"
      }
    },
    aggregationFn: "mean"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="entries"
    :columns
    class="w-fit mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    :grouping="['country']"
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
        class="flex gap-8"
      >
        <u-skeleton
          v-for="_ in 5"
          :key="_"
          class="h-4 rounded-lg"
        />
      </div>
    </template>
    <template #empty> No entries available for {{ name }} {{ route.params.year }}</template>
  </u-table>
</template>
