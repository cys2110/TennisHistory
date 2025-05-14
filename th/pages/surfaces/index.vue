<script setup lang="ts">
import { SurfacesGrid, SurfacesTable } from "#components"

useHead({ title: "Surfaces", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
const appConfig = useAppConfig()
const toast = useToast()

const skip = ref(0)
const envSort = ref<"ASC" | "DESC" | undefined>("ASC")
const surfaceSort = ref<"ASC" | "DESC" | undefined>("ASC")
const surfaces = ref<SurfaceInterface[]>([])

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", icon: ICONS.court }
]

interface APIResponseType {
  count: number
  surfaces: SurfaceInterface[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/surfaces", {
  query: { skip, envSort, surfaceSort },
  default: () => ({ count: 0, surfaces: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (surfaces.value = [...surfaces.value, ...(response._data.surfaces || [])]),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching surfaces",
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

execute()

watch([envSort, surfaceSort], () => {
  skip.value = 0
  surfaces.value = []
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
          :is="viewMode === 'cards' ? SurfacesGrid : SurfacesTable"
          :key="viewMode"
          v-model="skip"
          v-model:env-sort="envSort"
          v-model:surface-sort="surfaceSort"
          :surfaces
          :status
          :count="data?.count ?? 0"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
