<script setup lang="ts">
definePageMeta({ name: "surfaces" })
useHead({ title: "Surfaces", templateParams: { subPage: null } })

interface SurfacesAPIResponse {
  count: number
  surfaces: string[]
}

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

// API call
const { data, status } = await useFetch<SurfacesAPIResponse>("/api/all-surfaces", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * pageSize.value), limit: pageSize }
})

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", icon: ICONS.court }
]
</script>

<template>
  <paginated-overview
    :breadcrumbs
    v-model="selectedLetter"
    v-model:page="page"
    v-model:page-size="pageSize"
    :count="data?.count"
  >
    <u-page-grid
      v-if="data && data.count > 0"
      class="mt-10"
    >
      <surface-card
        v-for="surface in data.surfaces"
        :key="surface"
        :surface
      />
    </u-page-grid>

    <u-page-grid
      v-else-if="status === 'pending'"
      class="mt-10"
    >
      <base-loading-card
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      title="No surfaces found"
      :status
      error="Error fetching surfaces"
    />
  </paginated-overview>
</template>
