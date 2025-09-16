<script setup lang="ts">
import type { TableColumn, TableRow } from "@nuxt/ui"

useHead({ title: "Coaches" })
const { icons } = useAppConfig()

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Coaches",
  description: "A collection of tennis coaches"
}))

const page = ref(1)
const firstName = ref<string | undefined>()
const lastName = ref<string | undefined>()
const sortOrder = ref<{ type: string; sort: SortType }[]>([])

watch(
  () => [firstName.value, lastName.value, sortOrder.value],
  () => {
    page.value = 1
    set(coaches, [])
  },
  { deep: true }
)

const coaches = ref([])

// API call
const { data, status, execute } = await useFetch<{ total: number; coach: PersonInterface }[]>("/api/coaches", {
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
    if (page.value === 1) {
      set(coaches, response?._data?.map((item: any) => item.coach) || [])
    } else {
      set(coaches, [...coaches.value, ...(response?._data?.map((item: any) => item.coach) || [])])
    }
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
        return status.value !== "pending" && (get(data)?.[0]?.total ?? 0) > get(coaches).length
      }
    }
  )
})

const columns: TableColumn<PersonInterface>[] = [
  { accessorKey: "first_name", footer: () => `Total: ${data.value?.[0]?.total ?? 0}` },
  { accessorKey: "last_name" }
]

const handleSelectRow = async (row: TableRow<PersonInterface>) => {
  await navigateTo({ name: "coach", params: { id: kebabCase(row.original.id) } })
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
          :data="coaches"
          :columns
          :loading="['idle', 'pending'].includes(status)"
          sticky
          @select="handleSelectRow"
          :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer' }"
        >
          <template #loading>
            <loading-icon />
          </template>

          <template #empty>
            <empty-message
              :icon="icons.noPeople"
              message="No coaches found"
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
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
