<script setup lang="ts">
import { BaseLink, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { umpires, count, status } = defineProps<{
  umpires: string[]
  status: APIStatusType
  count: number
}>()

const skip = defineModel<number>({ default: 0 })
const sort = defineModel<"ASC" | "DESC">("sort", { default: "ASC" })

const table = useTemplateRef<ComponentPublicInstance>("table")

onMounted(async () => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 150,
      canLoadMore: () => status !== "pending" && umpires.length < count
    }
  )
})

const columns: TableColumn<string>[] = [
  {
    id: "umpire",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Umpires",
        icon: sort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown,
        onClick: () => {
          sort.value = sort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      return h(BaseLink, {
        label: row.original,
        type: "umpire",
        id: row.original
      })
    }
  }
]
</script>

<template>
  <u-table
    ref="table"
    :data="umpires"
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
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>
    <template #empty> No umpires found </template>
  </u-table>
</template>
