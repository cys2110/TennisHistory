<script setup lang="ts">
import { SupervisorsTable, SupervisorsGrid } from "#components"

useHead({ title: "Supervisors", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
const appConfig = useAppConfig()
const toast = useToast()

const selectedLetter = ref<string>("All")
const skip = ref(0)
const sort = ref<"ASC" | "DESC">("ASC")
const supervisors = ref<string[]>([])

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Supervisors", icon: ICONS.supervisor }
]

interface APIResponseType {
  count: number
  supervisors: string[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/supervisors", {
  query: { skip, sort, letter: selectedLetter },
  default: () => ({ count: 0, supervisors: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (supervisors.value = [...supervisors.value, ...(response._data.supervisors || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching supervisors",
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
  supervisors.value = []
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
          :is="viewMode === 'cards' ? SupervisorsGrid : SupervisorsTable"
          :key="viewMode"
          v-model="skip"
          v-model:sort="sort"
          :supervisors
          :status
          :count="data?.count ?? 0"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
