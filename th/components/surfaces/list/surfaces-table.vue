<script setup lang="ts">
import { UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { surfaces, status, loadMore } = defineProps<{
  surfaces: SurfaceInterface[]
  status: APIStatusType
  loadMore: () => void
}>()

const columns: TableColumn<SurfaceInterface>[] = [
  {
    accessorKey: "environment",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Environment",
        icon: isSorted
          ? isSorted === "asc"
            ? ICONS.sortAlphaUp
            : ICONS.sortAlphaDown
          : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "surface",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Surface",
        icon: isSorted
          ? isSorted === "asc"
            ? ICONS.sortAlphaUp
            : ICONS.sortAlphaDown
          : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "navigation",
    header: "",
    cell: ({ row }) => {
      return h(UButton, {
        label: "Go to",
        icon: ICONS.court,
        to: { name: "surface", params: { id: encodeName(row.original.id) } },
        size: "sm"
      })
    }
  }
]

const table = useTemplateRef<ComponentPublicInstance>("table")

onMounted(() => {
  useInfiniteScroll(table.value?.$el, () => loadMore(), {
    distance: 200,
    canLoadMore: () => status !== "pending"
  })
})
</script>

<template>
  <u-table
    ref="table"
    :data="surfaces"
    :columns
    class="max-h-175 w-fit mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
  >
    <template #loading>
      <div class="flex flex-col gap-4">
        <div
          v-for="_ in 6"
          :key="_"
          class="flex gap-8"
        >
          <u-skeleton
            v-for="_ in 2"
            :key="_"
            class="h-4 w-1/2 rounded-lg"
          />
        </div>
      </div>
    </template>
    <template #empty> No surfaces found </template>
  </u-table>
</template>
