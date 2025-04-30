<script setup lang="ts">
useHead({ title: "Coaches", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Coaches", icon: ICONS.coach }
]

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

interface CoachesAPIResponse {
  count: number
  coaches: (Pick<CoachType, "id" | "name" | "country"> & { labels: string[] })[]
}

// API call
const { data, status } = await useFetch<CoachesAPIResponse>("/api/coaches", {
  query: {
    letter: selectedLetter,
    skip: computed(() => (page.value - 1) * pageSize.value),
    limit: pageSize
  },
  default: () => ({ count: 0, coaches: [] }),
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
      <coach-card
        v-if="data.count"
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
    />
  </paginated-overview>
</template>
