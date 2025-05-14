<script setup lang="ts">
import { CoachesGrid, CoachesTable } from "#components"

useHead({ title: "Coaches", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
const appConfig = useAppConfig()
const toast = useToast()

const selectedLetter = ref<string>("All")
const skip = ref(0)
const sort = ref<"ASC" | "DESC">("ASC")
const coaches = ref<{ labels: string[] & Pick<CoachType, "id" | "name" | "country"> }[]>([])

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Coaches", icon: ICONS.coach }
]

interface APIResponseType {
  count: number
  coaches: ({ labels: string[] } & Pick<CoachType, "id" | "name" | "country">)[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/coaches", {
  query: { skip, sort, letter: selectedLetter },
  default: () => ({ count: 0, coaches: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (coaches.value = [...coaches.value, ...(response._data.coaches || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching coaches",
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
  coaches.value = []
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
          :is="viewMode === 'cards' ? CoachesGrid : CoachesTable"
          :key="viewMode"
          v-model="skip"
          v-model:sort="sort"
          :coaches
          :status
          :count="data?.count ?? 0"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
