<script setup lang="ts">
import { PlayerAvatar, UButton, UTooltip } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { seeds } = defineProps<{ seeds: SeedType[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<SeedType>[] = [
  {
    accessorKey: "seed",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Seed",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => h("span", { class: row.original.withdrew && "line-through" }, [row.original.seed])
  },
  {
    accessorKey: "last",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaDown : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) =>
      h(PlayerAvatar, {
        player: {
          id: row.original.id,
          name: row.original.name,
          country: row.original.country
        },
        strikethrough: row.original.withdrew ? true : false
      })
  },
  {
    accessorKey: "rank2",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UTooltip, { text: "Rank at time of draw" }, () =>
        h(UButton, {
          color: "neutral",
          variant: "link",
          label: "Rank",
          icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "-mx-2.5 font-semibold text-(--ui-text)"
        })
      )
    },
    cell: ({ row }) => {
      return h("span", { class: row.original.withdrew && "line-through" }, [row.original.rank2])
    }
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UTooltip, { text: "Rank at start of event" }, () =>
        h(UButton, {
          color: "neutral",
          variant: "link",
          label: "Rank",
          icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "-mx-2.5 font-semibold text-(--ui-text)"
        })
      )
    },
    cell: ({ row }) => {
      return h("span", { class: row.original.withdrew && "line-through" }, [row.original.rank])
    }
  }
]
</script>

<template>
  <u-table
    :data="seeds"
    :columns
    class="max-w-full w-fit mx-auto"
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
    <template #empty> No seeds available for {{ name }} {{ route.params.year }}</template>
  </u-table>
</template>
