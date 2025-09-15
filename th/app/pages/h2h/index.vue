<script setup lang="ts">
import { CountryLink } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { createColumnHelper } from "@tanstack/vue-table"

useHead({ title: "H2H" })
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

interface APIResponse {
  p1: PlayerInterface
  p2: PlayerInterface
  p1Wins: number
  p2Wins: number
}

// API call
const { data, status } = await useFetch<APIResponse[]>("/api/h2h", {
  key: "h2h",
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<APIResponse>()

const columns: TableColumn<APIResponse>[] = [
  columnHelper.group({
    header: "Player 1",
    columns: [
      {
        id: "p1Country",
        header: "Country",
        cell: ({ row }) => h(CountryLink, { country: row.original.p1.country, class: "mx-auto" })
      },
      {
        id: "p1Name",
        header: "Name",
        accessorFn: row => `${row.p1.first_name} ${row.p1.last_name}`
      },
      {
        accessorKey: "p1Wins",
        header: "Wins"
      }
    ]
  }),
  columnHelper.group({
    header: "Player 2",
    columns: [
      {
        accessorKey: "p2Wins",
        header: "Wins"
      },
      {
        id: "p2Country",
        header: "Country",
        cell: ({ row }) => h(CountryLink, { country: row.original.p2.country, class: "mx-auto" })
      },
      {
        id: "p2Name",
        header: "Name",
        accessorFn: row => `${row.p2.first_name} ${row.p2.last_name}`
      }
    ]
  })
]

const handleSelectRow = async (row: TableRow<APIResponse>) => {
  await navigateTo({
    name: "h2h-players",
    params: {
      p1Id: row.original.p1.id,
      p2Id: row.original.p2.id,
      p1Name: kebabCase(`${row.original.p1.first_name}-${row.original.p1.last_name}`),
      p2Name: kebabCase(`${row.original.p2.first_name}-${row.original.p2.last_name}`)
    }
  })
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-table
          :data="data"
          :columns
          :loading="['idle', 'pending'].includes(status)"
          sticky
          @select="handleSelectRow"
          :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer' }"
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
                :name="uIcons.caution"
                class="text-base"
              />
              No results found
            </div>
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
