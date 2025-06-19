<script setup lang="ts">
import { UButton, UIcon, ULink, UTooltip } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { seeds, tours } = defineProps<{ seeds: APISeedsResponseType; status: APIStatusType; tours: TourType[] }>()
const { params } = useRoute()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()

type newSeedType = {
  team?: SeedType[]
  seed: number
  tour: string
  draw: string
  type: "Singles" | "Doubles"
  country?: CountryInterface
  name?: string
  id?: number
  rank: number
  rank2: number
  withdrew: boolean
}

const allSeeds = computed(() => {
  const mainSinglesSeeds = seeds.mainSeeds
    .filter(s => s.type === "Singles")
    .map(s => ({
      ...s,
      draw: "Main"
    }))
  const qualSinglesSeeds = seeds.qualSeeds
    .filter(s => s.type === "Singles")
    .map(s => ({
      ...s,
      draw: "Qualifying"
    }))

  const mainDoublesSeeds = seeds.mainSeeds
    .filter(s => s.type === "Doubles")
    .map(s => ({
      ...s,
      draw: "Main"
    }))

  const qualDoublesSeeds = seeds.qualSeeds
    .filter(s => s.type === "Doubles")
    .map(s => ({
      ...s,
      draw: "Qualifying"
    }))

  const groupedDoubles: {
    team: SeedType[]
    seed: number
    tour: string
    draw: string
    rank: number
    rank2: number
    withdrew: boolean | string
    type: "Doubles"
  }[] = []

  const map = new Map<
    string,
    { team: SeedType[]; seed: number; tour: string; draw: string; rank: number; rank2: number; withdrew: boolean | string; type: "Doubles" }
  >()

  for (const seed of [...mainDoublesSeeds, ...qualDoublesSeeds]) {
    const key = `${seed.tour}-${seed.seed}-${seed.draw}`
    if (!map.has(key)) {
      map.set(key, {
        team: [],
        seed: seed.seed!,
        tour: seed.tour,
        draw: seed.draw,
        rank: seed.rank!,
        rank2: seed.rank2!,
        withdrew: seed.withdrew,
        type: "Doubles"
      })
    } else {
      const existing = map.get(key)
      existing!.rank += seed.rank!
    }
    map.get(key)!.team.push(seed)
  }

  for (const group of map.values()) {
    groupedDoubles.push(group)
  }
  return [...mainSinglesSeeds, ...qualSinglesSeeds, ...groupedDoubles] as newSeedType[]
})

const columns: TableColumn<newSeedType>[] = [
  {
    id: "expand"
  },
  {
    id: "tour",
    accessorKey: "tour"
  },
  {
    accessorKey: "type"
  },
  {
    accessorKey: "draw"
  },
  {
    accessorKey: "seed",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Seed",
        icon:
          isSorted ?
            isSorted === "asc" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `${row.getValue("seed")} ${row.getValue("seed") === 1 ? "seed" : "seeds"}`
      } else {
        return h("span", { class: row.original.withdrew && "line-through" }, [row.original.seed])
      }
    },
    aggregationFn: "count"
  },
  {
    accessorKey: "last",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon:
          isSorted ?
            isSorted === "asc" ?
              icons.sortAlphaDown
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        if (row.original.team) {
          return h(
            "div",
            {
              class: "flex flex-wrap items-center gap-2 mx-auto w-fit"
            },
            [
              h(
                ULink,
                {
                  class: "flex items-center"
                },
                () =>
                  h(UIcon, {
                    name: getFlagCode(row.original.team![0].country),
                    class: "text-xl"
                  })
              ),
              h(
                ULink,
                {
                  to: {
                    name: "player",
                    params: {
                      id: row.original.id,
                      name: encodeName(row.original.team[0].name!)
                    }
                  },
                  class: "hover-link " + (row.original.withdrew ? "line-through" : "")
                },
                () => row.original.team![0].name
              ),
              h("span", {}, " / "),
              h(
                ULink,
                {
                  class: "flex items-center"
                },
                () =>
                  h(UIcon, {
                    name: getFlagCode(row.original.team![1].country),
                    class: "text-xl"
                  })
              ),
              h(
                ULink,
                {
                  to: {
                    name: "player",
                    params: {
                      id: row.original.id,
                      name: encodeName(row.original.team[1].name!)
                    }
                  },
                  class: "hover-link " + (row.original.withdrew ? "line-through" : "")
                },
                () => row.original.team![1].name
              )
            ]
          )
        } else {
          return h(
            "div",
            {
              class: "flex items-center gap-2 w-fit mx-auto"
            },
            [
              h(
                ULink,
                {
                  class: "flex items-center"
                },
                () =>
                  h(UIcon, {
                    name: getFlagCode(row.original.country!),
                    class: "text-xl"
                  })
              ),
              h(
                ULink,
                {
                  to: {
                    name: "player",
                    params: {
                      id: row.original.id,
                      name: encodeName(row.original.name!)
                    }
                  },
                  class: "hover-link " + (row.original.withdrew ? "line-through" : "")
                },
                () => row.original.name
              )
            ]
          )
        }
      }
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
          icon:
            isSorted ?
              isSorted === "asc" ?
                icons.sortNumberUp
              : icons.sortNumberDown
            : icons.sortNumber,
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "-mx-2.5 font-semibold text-(--ui-text)"
        })
      )
    },
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `Avg: ${Math.round(row.getValue("rank2"))}`
      } else {
        return h("span", { class: row.original.withdrew && "line-through" }, [row.original.rank2])
      }
    },
    aggregationFn: "mean"
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
          icon:
            isSorted ?
              isSorted === "asc" ?
                icons.sortNumberUp
              : icons.sortNumberDown
            : icons.sortNumber,
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "-mx-2.5 font-semibold text-(--ui-text)"
        })
      )
    },
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `Avg: ${Math.round(row.getValue("rank"))}`
      } else {
        return h("span", { class: row.original.withdrew && "line-through" }, [
          row.original.team ? `${row.original.team[0].rank} / ${row.original.team[1].rank}` : row.original.rank
        ])
      }
    },
    aggregationFn: "mean"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="allSeeds"
    :columns="tours.includes('ATP') && tours.includes('WTA') ? columns : columns.filter(c => c.id !== 'tour')"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="tours.includes('ATP') && tours.includes('WTA') ? ['tour', 'type', 'draw'] : ['type', 'draw']"
    :grouping-options="grouping_options"
    :empty="`No seeds available for ${decodeName(params.name as string)} ${params.year}`"
    :ui="{
      root: 'max-h-200 max-w-full w-fit md:min-w-3/4 xl:min-w-2/3 mx-auto mt-5',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #expand-cell="{ row }">
      <div
        v-if="row.getIsGrouped()"
        class="flex items-center"
      >
        <span
          class="inline-block"
          :style="{ width: `calc(${row.depth} * 1rem)` }"
        />

        <u-button
          variant="link"
          color="neutral"
          class="mr-2"
          size="xs"
          :icon="row.getIsExpanded() ? appIcons.minus : appIcons.plus"
          @click="row.toggleExpanded()"
        />

        <u-badge
          v-if="row.groupingColumnId === 'tour'"
          class="font-semibold"
          :label="row.original.tour"
          :color="getTourColours([row.original.tour]).cardColour"
        />

        <u-badge
          v-else-if="row.groupingColumnId === 'type'"
          class="font-semibold"
          :label="row.original.type"
          :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
        />

        <u-badge
          v-if="row.groupingColumnId === 'draw'"
          class="font-semibold"
          :label="row.original.draw"
          :color="row.original.draw === 'Main' ? 'active' : 'neutral'"
        />
      </div>
    </template>
  </u-table>
</template>
