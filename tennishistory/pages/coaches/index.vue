<script setup lang="ts">
useHead({ title: "Coaches", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()
const { viewMode } = useViewMode()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Coaches", icon: ICONS.coach }
]

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

// API call
const { data, status } = await useFetch<CoachesAPIResponseType>("/api/coaches", {
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
    <coaches-card-view
      v-if="viewMode === 'cards'"
      :results="data"
      :status
    />
    <coaches-list-view
      v-else
      :results="data"
      :status
    />
  </paginated-overview>
</template>
