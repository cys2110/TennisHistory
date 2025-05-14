<script setup lang="ts">
import { UmpiresGrid, UmpiresTable } from "#components"

useHead({ title: "Umpires", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
const appConfig = useAppConfig()
const toast = useToast()

const selectedLetter = ref<string>("All")
const skip = ref(0)
const sort = ref<"ASC" | "DESC">("ASC")
const umpires = ref<string[]>([])

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Umpires", icon: ICONS.umpire }
]

interface APIResponseType {
  count: number
  umpires: string[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/umpires", {
  query: { sort, letter: selectedLetter, skip },
  default: () => ({ count: 0, umpires: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (umpires.value = [...umpires.value, ...(response._data.umpires || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching umpires",
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

execute()

watch([sort, selectedLetter], () => {
  skip.value = 0
  umpires.value = []
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

        <u-dashboard-toolbar>
          <letters-select v-model="selectedLetter" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? UmpiresGrid : UmpiresTable"
          :key="viewMode"
          v-model="skip"
          v-model:sort="sort"
          :umpires
          :status
          :count="data?.count ?? 0"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
