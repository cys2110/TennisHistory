<script setup lang="ts">
import { PlayerAvatar, UBadge, UButton, UIcon } from "#components"
import type { TableColumn } from "@nuxt/ui"

defineProps<{
  entries: Omit<EntryInterface, "incomplete" | "rank2" | "reason">[]
  status: APIStatusType
}>()
const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<Omit<EntryInterface, "incomplete" | "rank2" | "reason">>[] = [
  {
    accessorKey: "last",
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
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
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
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
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
    class="my-5 w-fit mx-auto"
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
    <template #empty> No entries available for {{ name }} {{ route.params.year }}</template>
  </u-table>
</template>
