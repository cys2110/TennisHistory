<script setup lang="ts">
import { UBadge, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions, type Column } from "@tanstack/vue-table"

const UDropdownMenu = resolveComponent("UDropdownMenu")

const { data, status } = defineProps<{ data: EntryInfoType[]; status: APIStatusType }>()
const { tableMode } = useDefaultTable()
const { params } = useRoute()
const { year, name } = params as { year: string; name: string }
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const tours = inject<TourType[]>("tours", [])

type NewEntryInfoType = EntryInterface & { label: string }

const formattedData = computed(() => {
  if (data.length) {
    const newArray: NewEntryInfoType[] = []
    data.forEach(item => {
      item.teams.forEach(team => {
        newArray.push({
          ...team,
          label: item.label
        })
      })
    })
    return newArray
  }
  return []
})

const getHeader = (column: Column<NewEntryInfoType>, label: string) => {
  const isSorted = column.getIsSorted()
  return h(
    UDropdownMenu,
    {
      ui: { group: "w-fit", itemLabel: "text-red" },
      items: [
        {
          label: "Asc",
          icon: icons.sortAlphaUp,
          checked: isSorted === "asc",
          onSelect: () => {
            if (isSorted === "asc") {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          }
        },
        {
          label: "Desc",
          icon: icons.sortAlphaDown,
          checked: isSorted === "desc",
          onSelect: () => {
            if (isSorted === "desc") {
              column.clearSorting()
            } else {
              column.toggleSorting(true)
            }
          }
        }
      ]
    },
    () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label,
        icon:
          isSorted ?
            isSorted === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        class: "-mx-2.5 data-[state=open]:bg-elevated"
      })
  )
}

const columns: TableColumn<NewEntryInfoType>[] = [
  { id: "expand" },
  { accessorKey: "label", header: "" },
  {
    id: "tour",
    accessorKey: "tour"
  },
  {
    id: "type",
    accessorKey: "type"
  },
  {
    id: "draw",
    accessorKey: "draw"
  },
  {
    id: "players",
    header: ({ column }) => getHeader(column, "Player(s)"),
    accessorFn: row => row.players.map(p => p).sort((a, b) => a.last_name.localeCompare(b.last_name)),
    meta: { class: { th: "text-left" } }
  },
  {
    accessorFn: row => {
      if (row.team_reason) {
        return row.team_reason
      } else if (row.players[0]?.reason && row.players[0].reason !== "teammate") {
        if (row.type === "Singles") {
          return row.players[0].reason
        } else {
          return `${row.players[0].last_name} - ${row.players[0].reason}`
        }
      } else if (row.players[1]?.reason && row.players[1].reason !== "teammate") {
        return `${row.players[1].last_name} - ${row.players[1].reason}`
      } else {
        return row.team_reason ?? row.rank ?? ""
      }
    },
    header: "Rank/Reason",
    id: "reason"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="formattedData"
    :columns="tours.length > 1 ? columns : columns.filter(c => c.id !== 'tour')"
    :loading="status === 'pending'"
    :empty="`No entry information available for ${capitalCase(name)} ${year}`"
    :grouping="tours.length > 1 ? ['label', 'tour', 'type', 'draw'] : ['label', 'type', 'draw']"
    :grouping-options="grouping_options"
    sticky
    :ui="{
      root: 'max-h-200 max-w-full w-fit md:min-w-3/4 xl:min-w-2/3 mx-auto mt-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
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
          :icon="row.getIsExpanded() ? appIcons.minus : appIcons.plus"
          @click="row.toggleExpanded()"
        />
        <span
          v-if="row.groupingColumnId === 'label'"
          class="font-semibold"
        >
          {{ ENTRY_INFO_LABELS[row.original.label as keyof typeof ENTRY_INFO_LABELS] }}
        </span>
        <u-badge
          v-if="row.groupingColumnId === 'tour'"
          class="font-semibold"
          :label="row.original.tour"
          :color="getTourColor([row.original.tour])"
        />
        <u-badge
          v-else-if="row.groupingColumnId === 'type'"
          class="font-semibold"
          :label="row.original.type"
          :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
        />
        <u-badge
          v-if="row.groupingColumnId === 'draw'"
          class="font-semibold"
          :label="row.original.draw"
          :color="row.original.draw === 'Main' ? 'main' : 'qualifying'"
        />
      </div>
    </template>
    <template #players-cell="{ row }">
      <div
        v-if="!row.getIsGrouped()"
        class="flex items-center gap-2"
      >
        <div
          v-for="(player, index) in row.original.players"
          :key="player.id"
          class="flex items-center gap-2"
        >
          <u-separator
            v-if="index > 0"
            orientation="vertical"
            class="h-4"
          />
          <player-link :player="player" />
        </div>
      </div>
      <template v-else></template>
    </template>
  </u-table>
</template>
