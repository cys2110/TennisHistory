<script setup lang="ts">
import { BaseLink, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { tournaments, count, status } = defineProps<{
  tournaments: Pick<TournamentInterface, "id" | "name" | "years">[]
  status: APIStatusType
  count: number
}>()

const skip = defineModel<number>({ default: 0 })
const sort = defineModel<"ASC" | "DESC" | undefined>("sort", { default: undefined })

const table = useTemplateRef<ComponentPublicInstance>("table")

onMounted(async () => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 150,
      canLoadMore: () => status !== "pending" && tournaments.length < count
    }
  )
})

const columns: TableColumn<Pick<TournamentInterface, "id" | "name" | "years">>[] = [
  {
    id: "tournament",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Tournaments",
        icon: sort.value ? (sort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          sort.value = sort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) =>
      h(BaseLink, {
        type: "tournament",
        tournament: row.original
      })
  },
  {
    accessorKey: "years",
    header: "Years"
  }
]
</script>

<template>
  <u-table
    ref="table"
    :data="tournaments"
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
    <template #empty> No tournaments found </template>
  </u-table>
</template>
