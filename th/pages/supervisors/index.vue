<script setup lang="ts">
definePageMeta({ name: "supervisors" })
useHead({ title: "Supervisors", templateParams: { subPage: null } })

interface SupervisorsAPIResponse {
  count: number
  supervisors: { id: string; first_name: string; last_name: string }[]
}

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

// API call
const { data, status } = await useFetch<SupervisorsAPIResponse>("/api/all-supervisors", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * pageSize.value), limit: pageSize }
})

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Supervisors", icon: ICONS.supervisor }
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
      <supervisor-card
        v-for="supervisor in data.supervisors"
        :key="supervisor.id"
        :supervisor
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
      :icon="ICONS.noSupervisor"
      title="No supervisors found"
      :status
      error="Error fetching supervisors"
    />
  </paginated-overview>
</template>
