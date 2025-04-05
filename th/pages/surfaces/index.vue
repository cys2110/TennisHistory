<script setup lang="ts">
definePageMeta({ name: "surfaces" })
useHead({ title: "Surfaces", templateParams: { subPage: null } })
const toast = useToast()

interface SurfacesAPIResponse {
  count: number
  surfaces: string[]
}

// API call
const { data, status } = await useFetch<SurfacesAPIResponse>("/api/all-surfaces", {
  onResponseError: () => {
    toast.add({
      title: "Error fetching surfaces",
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", icon: ICONS.court }
]
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <u-page-grid
        v-if="data && data.count > 0"
        class="mt-10"
      >
        <u-page-card
          v-for="surface in data.surfaces"
          :key="surface"
          :title="surface"
          :to="{ name: 'surface', params: { id: encodeName(surface) } }"
          highlight
          :ui="{ container: 'justify-center items-center text-center' }"
        />
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS.noSupervisor"
        title="No supervisors found"
        :status
      />
    </nuxt-layout>
  </div>
</template>
