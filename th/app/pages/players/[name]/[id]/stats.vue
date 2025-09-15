<script setup lang="ts">
import { FilterTableHeader, UButton, UProgress } from "#components"
import type { TableColumn } from "@nuxt/ui"
import {
  type Column,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

definePageMeta({ name: "stats" })
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const {
  params: { id }
} = useRoute("stats")

const playerYears = useState<number[]>("player-years")
const year = ref<number>()
const surface = ref<SurfaceType>()
const draw = ref<DrawType>("Main")
const level = ref<"Tour" | "Challenger" | "ITF">("Tour")

interface APIResponse {
  surface: SurfaceInterface
  category: CategoryType
  draw: DrawType
  level: "Tour" | "Challenger" | "ITF"
  year: number
}

// API call
const { data, status } = await useFetch<APIResponse[]>("/api/players/stats", {
  key: `stats-${id}`,
  query: { id },
  default: () => [],
  server: false
})

interface TableInterface {
  label: string
  category: string
  value: number
  low: boolean
  percent: boolean
  surface?: string
  event_category?: string
  draw?: DrawType
  level?: "Tour" | "Challenger" | "ITF"
}

const stats = computed<TableInterface[]>(() => {
  if (data.value.length) {
    const results = get(data)
    const allStats = []

    for (const statLabel of MATCH_STATS) {
      if (statLabel.key) {
        const value = results.map(s => ({
          label: statLabel.label,
          category: statLabel.category,
          value: s[statLabel.key as keyof APIResponse],
          low: statLabel.low,
          percent: statLabel.percent,
          surface: s.surface?.id,
          event_category: s.category,
          draw: s.draw,
          level: s.level,
          year: s.year
        }))
        allStats.push(...value)
      } else if (statLabel.label === "Service games won") {
        const value = results.map(s => {
          const numerator =
            (s[statLabel.denominators![0] as keyof APIResponse] as number) -
            ((s[statLabel.numerators![1] as keyof APIResponse] as number) - (s[statLabel.numerators![1] as keyof APIResponse] as number))
          const denominator = s[statLabel.denominators![0] as keyof APIResponse] as number

          return {
            label: statLabel.label,
            category: statLabel.category,
            value: denominator === 0 ? 0 : Math.round((numerator / denominator) * 100),
            low: statLabel.low,
            percent: statLabel.percent,
            surface: s.surface?.id,
            event_category: s.category,
            draw: s.draw,
            level: s.level,
            year: s.year
          }
        })
        allStats.push(...value)
      } else {
        const value = results.map(s => {
          const numerator = statLabel.numerators!.reduce((acc, curr) => {
            return acc + (s[curr as keyof APIResponse] as number)
          }, 0)
          const denominator = statLabel.denominators!.reduce((acc, curr) => {
            return acc + (s[curr as keyof APIResponse] as number)
          }, 0)

          return {
            label: statLabel.label,
            category: statLabel.category,
            value: denominator === 0 ? 0 : Math.round((numerator / denominator) * 100),
            low: statLabel.low,
            percent: true,
            surface: s.surface?.id,
            event_category: s.category,
            draw: s.draw,
            level: s.level,
            year: s.year
          }
        })
        allStats.push(...value)
      }
    }

    return allStats as TableInterface[]
  }
  return []
})

const columns: TableColumn<TableInterface>[] = [
  {
    accessorKey: "category",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Category", type: "alpha" }),
    cell: ({ row }) => row.original.category
  },
  {
    accessorKey: "label",
    header: ""
  },
  {
    accessorKey: "value",
    aggregationFn: "mean",
    header: "",
    cell: ({ row, cell, table }) => {
      if (row.original.percent) {
        return h(
          UProgress,
          {
            modelValue: cell.getValue() as number,
            max: 100
          },
          {
            status: () => `${Math.round(cell.getValue() as number)}%`
          }
        )
      } else if (row.original.category === "Service Speed") {
        return h(
          "div",
          {
            class: "flex flex-col items-center"
          },
          [h("div", {}, `${Math.round(cell.getValue() as number)} km/h`), h("div", {}, `${Math.round(kmhToMph(cell.getValue() as number))} mph`)]
        )
      } else {
        const filtered = table.getFilteredRowModel().rows.filter(r => r.original.label === row.original.label)
        const sumOfValues = filtered.reduce((acc, curr) => acc + (curr.original.value ?? 0), 0)
        return sumOfValues
      }
    }
  },
  { accessorKey: "surface" },
  { accessorKey: "draw" },
  { accessorKey: "level" },
  { accessorKey: "year" }
]

const columnFilters = computed(() => [
  ...(year.value ? [{ id: "year", value: year.value }] : []),
  ...(surface.value ? [{ id: "surface", value: surface.value }] : []),
  ...(draw.value ? [{ id: "draw", value: draw.value }] : []),
  ...(level.value ? [{ id: "level", value: level.value }] : [])
])
const columnVisibility = ref({
  surface: false,
  draw: false,
  level: false,
  year: false
})

const grouping = ref<string[]>(["label"])

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <player-wrapper>
    <template #toolbar>
      <filter-select-years
        v-model="year"
        :items="playerYears"
      />
      <u-form-field label="Surface">
        <u-select
          v-model="surface"
          :items="SURFACES_LIST.map(s => s.id)"
          placeholder="Select surface"
          :icon="icons.court"
        >
          <template #content-bottom>
            <u-button
              :trailing-icon="uIcons.close"
              color="neutral"
              variant="link"
              size="xs"
              @click="surface = undefined"
              label="Clear"
              block
              class="border-t rounded-t-none border-muted"
            />
          </template>
        </u-select>
      </u-form-field>
      <u-radio-group
        legend="Level"
        v-model="level"
        :items="['Tour', 'Challenger', 'ITF']"
        orientation="horizontal"
      />
      <u-radio-group
        legend="Draw Type"
        v-model="draw"
        :items="['Main', 'Qualifying']"
        orientation="horizontal"
      />
    </template>
    <client-only>
      <u-table
        ref="table"
        :data="stats"
        :columns
        :loading="['idle', 'pending'].includes(status)"
        sticky
        v-model:column-filters="columnFilters"
        :faceted-options="{
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedMinMaxValues: getFacetedMinMaxValues(),
          getFacetedUniqueValues: getFacetedUniqueValues()
        }"
        :grouping="grouping"
        :grouping-options="grouping_options"
        v-model:column-visibility="columnVisibility"
      >
        <template #loading>
          <u-icon
            :name="uIcons.loading"
            class="size-8"
          />
        </template>
        <template #empty>
          <div class="flex justify-center items-center w-full gap-2 text-error">
            <u-icon
              :name="icons.noChart"
              class="text-base"
            />
            No stats found
          </div>
        </template>
      </u-table>
    </client-only>
  </player-wrapper>
</template>
