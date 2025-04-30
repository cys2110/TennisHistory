<script setup lang="ts">
useHead({ title: "Surfaces", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", icon: ICONS.court }
]

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

interface SurfacesAPIResponse {
  count: number
  surfaces: string[]
}

// API call
const { data, status } = await useFetch<SurfacesAPIResponse>("/api/surfaces", {
  query: {
    letter: selectedLetter,
    skip: computed(() => (page.value - 1) * pageSize.value),
    limit: pageSize
  },
  default: () => ({ count: 0, surfaces: [] }),
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
</script>

<template>
  <paginated-overview
    :breadcrumbs
    v-model="selectedLetter"
    v-model:page="page"
    v-model:page-size="pageSize"
    :count="data.count"
  >
    <u-page-grid
      v-if="data.count || ['pending', 'idle'].includes(status)"
      class="mt-10"
    >
      <base-card
        v-if="data.count"
        v-for="surface in data.surfaces"
        :key="surface"
        type="surface"
        :id="surface"
      />

      <base-loading-card
        v-else
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      title="No surfaces found"
    />
  </paginated-overview>
</template>
