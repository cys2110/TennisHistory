<script setup lang="ts">
import { CategoriesGrid, CategoriesTable } from "#components"

useHead({ title: "Categories", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
const appConfig = useAppConfig()
const toast = useToast()

const skip = ref(0)
const sort = ref<"ASC" | "DESC">("ASC")
const categories = ref<CategoryEnum[]>([])

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Categories", icon: ICONS.categories }
]

interface APIResponseType {
  count: number
  categories: CategoryEnum[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/categories", {
  query: { skip, sort },
  default: () => ({ count: 0, categories: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (categories.value = [...categories.value, ...(response._data.categories || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching categories",
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

execute()

watch(sort, () => {
  skip.value = 0
  categories.value = []
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? CategoriesGrid : CategoriesTable"
          :key="viewMode"
          v-model="skip"
          v-model:sort="sort"
          :categories
          :status
          :count="data?.count ?? 0"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
