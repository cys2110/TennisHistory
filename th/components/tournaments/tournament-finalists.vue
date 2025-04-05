<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const UButton = resolveComponent("u-button")
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

interface APIResponse {
  finals: string
  player: Pick<PlayerInterface, "id" | "name" | "country">
}

// API call
const { data: finalists, status } = await useFetch<APIResponse[]>("/api/tournament-finalists", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching finalists for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

const columns: TableColumn<APIResponse>[] = [
  {
    accessorKey: "finals",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Finals",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  { id: "player", header: "Player" }
]
</script>

<template>
  <dashboard-subpanel
    title="Finalists by No. of Finals"
    :icon="ICONS.upcoming"
  >
    <u-table
      v-if="finalists"
      :data="finalists"
      :columns="columns"
    >
      <template #player-cell="{ row }">
        <player-avatar :player="row.original.player" />
      </template>
    </u-table>
    <error-message
      v-else
      :icon="ICONS.noInfo"
      :status
      :title="`No finalists found for ${name}`"
    />
  </dashboard-subpanel>
</template>
