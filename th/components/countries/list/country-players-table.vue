<script setup lang="ts">
import { PlayerAvatar, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { players, count, status } = defineProps<{
  players: (Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year"> & { current?: boolean })[]
  status: APIStatusType
  count: number
  name: string | undefined
}>()

const route = useRoute()
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

const columns: TableColumn<Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year"> & { current?: boolean }>[] = [
  {
    id: "player",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Players",
        icon: sort.value ? (sort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          sort.value = sort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) =>
      h(PlayerAvatar, {
        player: row.original,
        class: "mx-auto w-fit"
      })
  },
  {
    id: "years",
    header: "Years",
    cell: ({ row }) => `${row.original.min_year} - ${row.original.max_year === new Date().getFullYear() ? "present" : row.original.max_year}`
  },
  {
    id: "current",
    header: "Current / Former",
    cell: ({ row }) => {
      const current = row.original.current
      return h(UButton, {
        color: current ? "secondary" : "warning",
        variant: "outline",
        label: current ? "Current" : "Former",
        class: "mx-auto w-fit rounded-full",
        size: "xs"
      })
    }
  }
]
</script>

<template>
  <u-table
    ref="table"
    :data="players"
    :columns
    class="max-h-160 w-fit mx-auto mt-5"
    :loading="['pending', 'idle'].includes(status)"
    sticky
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex w-full gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>
    <template #empty> No players who (have) represent(ed) {{ name ?? route.params.id }} </template>
  </u-table>
</template>
