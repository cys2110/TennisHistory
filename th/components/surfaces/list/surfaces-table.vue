<script setup lang="ts">
import { UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { surfaces, count, status } = defineProps<{
  surfaces: SurfaceInterface[]
  status: APIStatusType
  count: number
}>()

const skip = defineModel<number>({ default: 0 })
const envSort = defineModel<"ASC" | "DESC" | undefined>("env-sort", { default: undefined })
const surfaceSort = defineModel<"ASC" | "DESC" | undefined>("surface-sort", { default: "ASC" })

const table = useTemplateRef<ComponentPublicInstance>("table")

onMounted(async () => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 150,
      canLoadMore: () => status !== "pending" && surfaces.length < count
    }
  )
})

const columns: TableColumn<{ id: string; environment: "Indoor" | "Outdoor"; surface: SurfaceEnum }>[] = [
  {
    accessorKey: "environment",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Environment",
        icon: envSort.value ? (envSort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          surfaceSort.value = undefined
          envSort.value = envSort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
  },
  {
    accessorKey: "surface",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Surface",
        icon: surfaceSort.value ? (surfaceSort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          envSort.value = undefined
          surfaceSort.value = surfaceSort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
  },
  {
    id: "navigation",
    cell: ({ row }) =>
      h(UButton, {
        label: "Go to",
        icon: ICONS.court,
        to: { name: "surface", params: { id: encodeName(row.original.id) } },
        size: "sm"
      })
  }
]
</script>

<template>
  <u-table
    ref="table"
    :data="surfaces"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex gap-8"
      >
        <u-skeleton class="h-4 w-40 rounded-lg" />
      </div>
    </template>
    <template #empty> No surfaces found </template>
  </u-table>
</template>
