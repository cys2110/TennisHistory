<script setup lang="ts">
import { CountryLink, UBadge, UButton, USelectMenu } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"

useHead({ title: "Players" })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Coaches",
  description: "A collection of tennis players"
}))

const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const smAndDown = breakpoints.smallerOrEqual("sm")

const currentYear = new Date().getFullYear()
const page = ref(1)
const tour = ref<TourType | undefined>()
const active = ref<"Active" | "Inactive" | undefined>()
const country = ref<string | undefined>()
const min_year = ref<number[]>([])
const max_year = ref<number[]>([])
const firstName = ref<string | undefined>()
const lastName = ref<string | undefined>()
const sortOrder = ref<{ type: string; sort: SortType }[]>([])

const players = ref<PlayerInterface[]>([])

const reset = () => {
  page.value = 1
  set(players, [])
}

watch([firstName, lastName, tour, active, country, sortOrder, min_year, max_year], reset)

// API call
const { data, status, execute } = await useFetch<{ total: number; player: PlayerInterface }[]>("/api/players", {
  key: () =>
    `players-${firstName.value}-${lastName.value}-${sortOrder.value}-${tour.value}-${active.value}-${country.value}-${min_year.value}-${max_year.value}`,
  query: {
    pageSize: 40,
    page,
    first_name: firstName,
    last_name: lastName,
    sort_order: sortOrder,
    tour,
    active,
    country,
    min_year,
    max_year
  },
  default: () => [],
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => {
    set(players, [...players.value, ...(response._data?.map((item: any) => item.player) || [])])
  }
})

execute()

const table = useTemplateRef<ComponentPublicInstance>("table")
onMounted(() => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      page.value++
    },
    {
      distance: 50,
      canLoadMore: () => {
        return status.value !== "pending" && (data.value?.[0]?.total ?? 0) > players.value.length
      }
    }
  )
})

const columns: TableColumn<PlayerInterface>[] = [
  {
    accessorKey: "tour",
    cell: ({ row }) =>
      h(UBadge, {
        label: row.original.tour,
        color: getTourColour([row.original.tour]),
        class: "mx-1"
      })
  },
  {
    id: "status",
    accessorFn: row => (row.max_year === currentYear ? "Active" : "Inactive"),
    cell: ({ cell }) =>
      h(UBadge, {
        label: cell.getValue() as string,
        color: (cell.getValue() as string).toLowerCase() as "active" | "inactive"
      })
  },
  {
    accessorKey: "country.name",
    cell: ({ row }) =>
      h(CountryLink, {
        country: row.original.country,
        class: "mx-auto"
      })
  },
  { accessorKey: "first_name", footer: () => `Total: ${data.value?.[0]?.total ?? 0}` },
  { accessorKey: "last_name" },
  { accessorKey: "min_year" },
  { accessorKey: "max_year" }
]

const handleSelectRow = async (row: TableRow<PersonInterface>) => {
  await navigateTo({ name: "player", params: { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) } })
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
          ref="table"
          :data="players"
          :columns="columns"
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
                :name="icons.noPlayer"
                class="text-base"
              />
              No players found
            </div>
          </template>

          <template #tour-header>
            <u-select-menu
              v-model="tour"
              :items="['ATP', 'WTA']"
              class="w-fit"
              placeholder="Tour"
            >
              <template #content-bottom>
                <u-button
                  :trailing-icon="uIcons.close"
                  color="neutral"
                  variant="link"
                  size="xs"
                  label="Clear"
                  @click="tour = undefined"
                  block
                  class="border-t rounded-t-none border-muted"
                />
              </template>
            </u-select-menu>
          </template>

          <template #status-header>
            <u-select-menu
              v-model="active"
              :items="['Active', 'Inactive']"
              class="w-fit"
              placeholder="Status"
            >
              <template #content-bottom>
                <u-button
                  :trailing-icon="uIcons.close"
                  color="neutral"
                  variant="link"
                  size="xs"
                  label="Clear"
                  @click="active = undefined"
                  block
                  class="border-t rounded-t-none border-muted"
                />
              </template>
            </u-select-menu>
          </template>

          <template #country_name-header>
            <custom-input-table-header
              label="Country"
              v-model:filter="country"
              v-model:sort-order="sortOrder"
            />
          </template>

          <template #first_name-header>
            <custom-input-table-header
              label="First Name"
              v-model:filter="firstName"
              v-model:sort-order="sortOrder"
            />
          </template>

          <template #last_name-header>
            <custom-input-table-header
              label="Last Name"
              v-model:filter="lastName"
              v-model:sort-order="sortOrder"
            />
          </template>

          <template #min_year-header>
            <custom-range-table-header
              label="First Tournament Year"
              v-model:range="min_year"
              v-model:sort-order="sortOrder"
            />
          </template>

          <template #max_year-header>
            <custom-range-table-header
              label="Last Tournament Year"
              v-model:range="max_year"
              v-model:sort-order="sortOrder"
            />
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
