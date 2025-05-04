<script setup lang="ts">
useHead({ title: "Surfaces", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()
const { viewMode } = useViewMode()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", icon: ICONS.court }
]

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)
const surfaces = ref<SurfaceInterface[]>([]) // Initialise surfaces for infinite scroll table

// API call
const { data, status, execute } = useFetch<SurfacesAPIResponseType>("/api/surfaces", {
  query: computed(() => ({
    letter: selectedLetter.value,
    skip: (page.value - 1) * pageSize.value,
    limit: pageSize.value
  })),
  default: () => ({ count: 0, surfaces: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => {
    // Concatenate surfaces for infinite scroll table
    if (viewMode.value === "list")
      surfaces.value = [...surfaces.value, ...(response._data.surfaces || [])]
  },
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

watch([selectedLetter, pageSize, viewMode], () => {
  page.value = 1
  if (viewMode.value === "list") surfaces.value = []
  execute()
})

watch(page, () => execute())

onMounted(() => execute())

const loadMore = () => page.value++
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>

          <template #right>
            <ClientOnly>
              <set-page-size
                v-if="viewMode === 'cards'"
                v-model="pageSize"
              />
            </ClientOnly>
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <letters-radio-group v-model="selectedLetter" />
        </u-dashboard-toolbar>
      </template>
      <template #body>
        <ClientOnly>
          <surfaces-grid
            v-if="viewMode === 'cards'"
            v-model="page"
            v-model:page-size="pageSize"
            :data
            :status
          />

          <surfaces-table
            v-else
            :surfaces
            :status
            :loadMore
          />
        </ClientOnly>

        <pagination-component
          v-if="data.count"
          v-model="page"
          :total="data.count"
          :page-size="pageSize"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
