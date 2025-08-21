<script setup lang="ts">
import { UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const smAndDown = breakpoints.smallerOrEqual("sm")

const page = ref(1)
const firstName = ref<string | undefined>()
const lastName = ref<string | undefined>()
const sortOrder = ref<{ type: string; sort: SortType }[]>([])

watch(
  () => [firstName, lastName, sortOrder.value],
  () => {
    page.value = 1
    set(coaches, [])
  },
  { deep: true }
)

const coaches = ref([])

// API call
const { data, status, execute } = await useFetch<{ total: number; coach: PlayerInterface }[]>("/api/coaches", {
  key: `coaches-${firstName.value}-${lastName.value}-${sortOrder.value}`,
  query: {
    pageSize: 40,
    page,
    first_name: firstName,
    last_name: lastName,
    sort_order: sortOrder
  },
  default: () => [],
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => {
    set(coaches, [...coaches.value, ...(response._data.map((item: any) => item.coach) || [])])
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
        return status.value !== "pending" && (data.value?.[0]?.total ?? 0) > coaches.value.length
      }
    }
  )
})

const columns: TableColumn<PlayerInterface>[] = [
  { accessorKey: "first_name", footer: () => `Total: ${data.value?.[0]?.total ?? 0}` },
  { accessorKey: "last_name" },
  {
    id: "navigation",
    cell: ({ row }) =>
      h(UButton, {
        label: "Go to...",
        trailingIcon: icons.coach,
        to: { name: "coach", params: { id: kebabCase(row.original.id) } },
        size: smAndDown ? "xs" : "sm"
      })
  }
]
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
          :data="coaches"
          :columns
          :loading="status === 'pending'"
          sticky
          empty="No coaches found"
          :ui="{
            root: 'w-fit min-w-1/3 mx-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent'
          }"
        >
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
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
