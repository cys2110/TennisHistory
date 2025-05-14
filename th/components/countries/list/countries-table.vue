<script setup lang="ts">
import { BaseLink, UButton, UIcon } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { countries, count, status } = defineProps<{
  countries: CountryInterface[]
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
      canLoadMore: () => status !== "pending" && countries.length < count
    }
  )
})

const columns: TableColumn<CountryInterface>[] = [
  {
    id: "flag",
    cell: ({ row }) =>
      h(UIcon, {
        name: row.original.alpha2 ? `flag:${row.original.alpha2}-4x3` : `flags:${row.original.id}`
      })
  },
  {
    id: "country",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Countries",
        icon: sort.value ? (sort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          sort.value = sort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) =>
      h(
        BaseLink,
        {
          type: "country",
          id: row.original.id
        },
        () => row.original.name
      )
  }
]
</script>

<template>
  <u-table
    ref="table"
    :data="countries"
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
    <template #empty> No countries found </template>
  </u-table>
</template>
