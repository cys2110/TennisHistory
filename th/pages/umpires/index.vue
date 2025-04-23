<script setup lang="ts">
definePageMeta({ name: "umpires" })
useHead({ title: "Umpires", templateParams: { subPage: null } })

interface UmpiresAPIResponse {
  count: number
  umpires: string[]
}

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

// API call
const { data, status } = await useFetch<UmpiresAPIResponse>("/api/all-umpires", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * pageSize.value), limit: pageSize }
})

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Umpires", icon: ICONS.umpire }
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
      <umpire-card
        v-for="umpire in data.umpires"
        :key="umpire"
        :umpire
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
