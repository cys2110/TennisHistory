<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const { seeds } = defineProps<{ seeds: SeedType[] | null; status: string }>()
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
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
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
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaDown : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
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
          icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "-mx-2.5 font-semibold text-(--ui-text)"
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
          icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "-mx-2.5 font-semibold text-(--ui-text)"
        })
      )
    }
  }
]

const columnVisibility = ref({ withdrew: false })
</script>

<template>
  <u-table
    :data="seeds || []"
    :columns
    :column-visibility
    class="my-5 w-fit mx-auto"
    :loading="status === 'pending'"
  >
    <template #empty>
      <div
        v-if="status === 'pending'"
        class="flex flex-col gap-4"
      >
        <div
          v-for="_ in 6"
          :key="_"
          class="flex gap-8"
        >
          <u-skeleton
            v-for="_ in 4"
            :key="_"
            class="h-4 w-1/2 rounded-lg"
          />
        </div>
      </div>
      <template v-else>No seeds available</template>
    </template>

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
          :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.id}`, icon: ICONS.player }"
          :to="{ name: 'player', params: { id: row.original.id, name: encodeName(row.original.name) } }"
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
