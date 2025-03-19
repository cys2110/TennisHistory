<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const { seeds } = defineProps<{ seeds: SeedType[] }>()
const UButton = resolveComponent("u-button")
const UTooltip = resolveComponent("u-tooltip")

const columns: TableColumn<SeedType>[] = [
  { accessorKey: "withdrew" },
  {
    accessorKey: "seed",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Seed",
        icon: isSorted ? (isSorted === "asc" ? ICONS["sort-number-up"] : ICONS["sort-number-down"]) : ICONS["sort-number"],
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold"
      })
    }
  },
  {
    accessorKey: "last",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon: isSorted ? (isSorted === "asc" ? ICONS["sort-alpha-up"] : ICONS["sort-alpha-down"]) : ICONS["sort-alpha"],
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold"
      })
    }
  },
  {
    accessorKey: "rank2",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UTooltip, { text: "Rank at time of draw" }, () =>
        h(UButton, {
          color: "neutral",
          variant: "link",
          label: "Rank",
          icon: isSorted ? (isSorted === "asc" ? ICONS["sort-number-up"] : ICONS["sort-number-down"]) : ICONS["sort-number"],
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "-mx-2.5 font-semibold"
        })
      )
    }
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UTooltip, { text: "Rank at start of event" }, () =>
        h(UButton, {
          color: "neutral",
          variant: "link",
          label: "Rank",
          icon: isSorted ? (isSorted === "asc" ? ICONS["sort-number-up"] : ICONS["sort-number-down"]) : ICONS["sort-number"],
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "-mx-2.5 font-semibold"
        })
      )
    }
  }
]

const columnVisibility = ref({ withdrew: false })
</script>

<template>
  <u-table
    v-if="seeds"
    :data="seeds"
    :columns
    :column-visibility
    class="my-5 w-fit mx-auto"
  >
    <template #seed-cell="{ row }">
      <span :class="{ 'line-through': row.getValue('withdrew') }">
        {{ row.getValue("seed") }}
      </span>
    </template>

    <template #last-cell="{ row }">
      <div class="flex items-center gap-2">
        <flag-icon :country="row.original.country" />
        <u-user
          :name="row.original.name"
          :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.id}`, icon: ICONS.person }"
          :to="{ name: 'player', params: { id: row.original.id, name: useChangeCase(row.original.name, 'kebabCase').value } }"
          prefetch-on="interaction"
          :ui="{ name: row.original.withdrew ? 'line-through text-xs md:text-sm lg:text-md' : 'text-xs md:text-sm lg:text-md' }"
        />
      </div>
    </template>

    <template #rank-cell="{ row }">
      <span :class="{ 'line-through': row.getValue('withdrew') }">
        {{ row.getValue("rank") ?? "—" }}
      </span>
    </template>

    <template #rank2-cell="{ row }">
      <span :class="{ 'line-through': row.getValue('withdrew') }">
        {{ row.getValue("rank2") ?? "—" }}
      </span>
    </template>
  </u-table>
</template>
