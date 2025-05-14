<script setup lang="ts">
import { PlayerAvatar, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"

defineProps<{ ages: WinnersByAgeInterface[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<WinnersByAgeInterface>[] = [
  {
    accessorKey: "age",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Age",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) =>
      h(
        ULink,
        {
          class: "hover-link w-fit",
          to: {
            name: "event",
            params: {
              id: route.params.id,
              name: name.value,
              eid: row.original.id,
              year: row.original.year
            }
          }
        },
        () => row.getValue("year")
      )
  },
  {
    id: "player",
    header: "Player",
    cell: ({ row }) => {
      return h("div", { class: "mx-auto flex justify-center items-center" }, [
        h(PlayerAvatar, {
          player: row.original.player
        })
      ])
    }
  }
]
</script>

<template>
  <u-table
    :data="ages"
    :columns="columns"
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
    <template #empty> No winners by age found for {{ name }} </template>
  </u-table>
</template>
