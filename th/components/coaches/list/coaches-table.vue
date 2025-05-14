<script setup lang="ts">
import { BaseLink, UAvatar, UButton, UIcon } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { coaches, count, status } = defineProps<{
  coaches: ({ labels: string[] } & Pick<CoachType, "id" | "name" | "country">)[]
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
      canLoadMore: () => status !== "pending" && coaches.length < count
    }
  )
})

const columns: TableColumn<{ labels: string[] } & Pick<CoachType, "id" | "name" | "country">>[] = [
  {
    id: "coach",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Coaches",
        icon: sort.value ? (sort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          sort.value = sort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      if (row.original.labels.includes("Player")) {
        return h("div", { class: "flex items-center gap-2 mx-auto w-fit" }, [
          h(UIcon, {
            name: row.original.country?.alpha2 ? `flag:${row.original.country.alpha2}-4x3` : `flags:${row.original.country?.id}`
          }),
          h(UAvatar, {
            src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.id}`,
            alt: row.original.name,
            icon: ICONS.coach,
            size: "sm"
          }),
          h(
            BaseLink,
            {
              type: "coach",
              id: row.original.id
            },
            () => row.original.name
          )
        ])
      } else {
        return h(BaseLink, {
          type: "coach",
          id: row.original.id
        })
      }
    }
  }
]
</script>

<template>
  <u-table
    ref="table"
    :data="coaches"
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
    <template #empty> No coaches found </template>
  </u-table>
</template>
