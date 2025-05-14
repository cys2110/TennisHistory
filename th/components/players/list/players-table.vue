<script setup lang="ts">
import { BaseLink, PlayerAvatar, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { players, count, status } = defineProps<{
  players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]
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
      canLoadMore: () => status !== "pending" && players.length < count
    }
  )
})

const columns: TableColumn<Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">>[] = [
  {
    id: "player",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Players",
        icon: sort.value ? (sort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          sort.value = sort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) =>
      h(PlayerAvatar, {
        player: row.original,
        class: "mx-auto w-fit"
      })
  }
]
</script>

<template>
  <u-table
    ref="table"
    :data="players"
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
    <template #empty> No players found </template>
  </u-table>
</template>
