<script setup lang="ts">
import { CountryLink, UBadge, UButton, UIcon, UUser } from "#components"
import type { TableColumn } from "@nuxt/ui"

defineProps<{
  entries: Omit<EntryInterface, "incomplete" | "rank2" | "reason">[]
  status: "pending" | "idle" | "error" | "success"
}>()
const appConfig = useAppConfig()

const columns: TableColumn<Omit<EntryInterface, "incomplete" | "rank2" | "reason">>[] = [
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
            ? ICONS.sortAlphaUp
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
      if (row.original.seed) {
        return h("span", { class: row.original.withdrew && "line-through" }, [row.original.seed])
      }
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Status",
        icon: isSorted
          ? isSorted === "asc"
            ? ICONS.sortAlphaUp
            : ICONS.sortAlphaDown
          : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      if (row.original.status) {
        return h(UBadge, {
          class: STATUSES[row.original.status].class + " font-bold",
          label: STATUSES[row.original.status].longName
        })
      }
    }
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
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
    },
    cell: ({ row }) => {
      if (row.original.rank) {
        return h("span", { class: row.original.withdrew && "line-through" }, [row.original.rank])
      }
    }
  },
  {
    accessorKey: "withdrew",
    header: "Withdrew",
    cell: ({ row }) => {
      if (row.original.withdrew) {
        if (typeof row.original.withdrew === "string") {
          return h("span", {}, [row.original.withdrew])
        } else {
          return h(UIcon, {
            name: appConfig.ui.icons.success,
            class: "text-error-600 dark:text-error-400 text-xl"
          })
        }
      }
    }
  }
]
</script>

<template>
  <u-table
    :data="entries"
    :columns
    class="w-fit mx-auto my-5"
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
            v-for="_ in 5"
            :key="_"
            class="h-4 w-1/2 rounded-lg"
          />
        </div>
      </div>
      <template v-else>No entries available</template>
    </template>
  </u-table>
</template>
