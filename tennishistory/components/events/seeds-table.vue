<script setup lang="ts">
import { CountryLink, UButton, UTooltip, UUser } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { seeds } = defineProps<{ seeds: SeedType[] | null; status: string }>()

const columns: TableColumn<SeedType>[] = [
  {
    accessorKey: "seed",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Seed",
        icon: isSorted
          ? isSorted === "asc"
            ? ICONS.sortNumberUp
            : ICONS.sortNumberDown
          : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      return h("span", { class: row.original.withdrew && "line-through" }, [row.original.seed])
    }
  },
  {
    accessorKey: "last",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon: isSorted
          ? isSorted === "asc"
            ? ICONS.sortAlphaDown
            : ICONS.sortAlphaDown
          : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-2" }, [
        h(CountryLink, { country: row.original.country }),
        h(UUser, {
          name: row.original.name,
          avatar: {
            src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.id}`,
            icon: ICONS.player
          },
          to: {
            name: "player",
            params: { id: row.original.id, name: encodeName(row.original.name) }
          },
          ui: {
            name: `${row.original.withdrew && "line-through "} text-xs md:text-sm lg:text-md`
          }
        })
      ])
    }
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
          icon: isSorted
            ? isSorted === "asc"
              ? ICONS.sortNumberUp
              : ICONS.sortNumberDown
            : ICONS.sortNumber,
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
          icon: isSorted
            ? isSorted === "asc"
              ? ICONS.sortNumberUp
              : ICONS.sortNumberDown
            : ICONS.sortNumber,
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
    class="w-fit mx-auto"
    :loading="['pending', 'idle'].includes(status)"
  >
    <template #empty>
      <div
        v-if="['pending', 'idle'].includes(status)"
        class="flex flex-col gap-4"
      >
        <div
          v-for="_ in 6"
          :key="_"
          class="flex gap-8"
        >
          <u-skeleton
            v-for="_ in 4"
            :key="_"
            class="h-4 w-1/2 rounded-lg"
          />
        </div>
      </div>
      <template v-else>No seeds available</template>
    </template>
  </u-table>
</template>
