<script setup lang="ts">
definePageMeta({ name: "coaches" })
useHead({ title: "Coaches", templateParams: { subPage: null } })
const toast = useToast()

interface CoachesAPIResponse {
  count: number
  coaches: {
    labels: string[]
    id: string
    name: string
    country: CountryInterface | null
  }[]
}

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

// API call
const { data, status } = await useFetch<CoachesAPIResponse>("/api/all-coaches", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * pageSize.value), limit: pageSize },
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching coaches",
      description: error?.message,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Coaches", icon: ICONS.coach }
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
      v-if="data?.count || ['pending', 'idle'].includes(status)"
      class="mt-10"
    >
      <coach-card
        v-if="data"
        v-for="coach in data.coaches"
        :key="coach.id"
        :coach
      />
      <base-loading-card
        v-else
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      title="No coaches found"
      :status
      error="coaches"
    />
  </paginated-overview>
</template>
