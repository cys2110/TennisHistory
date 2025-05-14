<script setup lang="ts">
import { PlayerAvatar, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { data, status } = defineProps<{ data: EntryInfoType[]; status: APIStatusType }>()
const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const formattedData = computed(() => {
  if (data.length) {
    const newArray: { label: string; player: Pick<PlayerInterface, "id" | "name" | "country">; reason: string }[] = []
    data.forEach(item => {
      item.content.forEach(player => {
        newArray.push({
          label: item.label,
          player: {
            id: player.id,
            name: player.name,
            country: player.country
          },
          reason: player.rank ? `${player.status && item.label === "Last direct acceptance" ? "P" : ""}${player.rank}` : player.reason ?? "—"
        })
      })
    })
    return newArray
  }
  return []
})

const columns: TableColumn<{ label: string; player: Pick<PlayerInterface, "id" | "name" | "country">; reason: string }>[] = [
  {
    accessorKey: "label",
    header: "",
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
          () => row.getValue("label")
        )
      }
    },
    meta: { class: { td: "text-left" } }
  },
  {
    id: "players",
    accessorKey: "player.id",
    header: "Players",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        const count = row.getValue("players")
        return `${count} ${count === 1 ? "player" : "players"}`
      } else {
        return h(PlayerAvatar, {
          player: row.original.player,
          class: "mx-auto"
        })
      }
    },
    aggregationFn: "uniqueCount"
  },
  {
    accessorKey: "reason",
    header: "Rank/Reason",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) return row.getValue("reason")
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
    :data="formattedData"
    :columns
    class="w-fit mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    :grouping="['label']"
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
    <template #empty> No entry information available for {{ name }} {{ route.params.year }}</template>
  </u-table>
</template>
