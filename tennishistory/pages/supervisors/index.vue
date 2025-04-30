<script setup lang="ts">
useHead({ title: "Supervisors", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Supervisors", icon: ICONS.supervisor }
]

// Default values
const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

interface SupervisorsAPIResponse {
  count: number
  supervisors: string[]
}

// API call
const { data, status } = await useFetch<SupervisorsAPIResponse>(
  "/api/supervisors/all-supervisors",
  {
    query: {
      letter: selectedLetter,
      skip: computed(() => (page.value - 1) * pageSize.value),
      limit: pageSize
    },
    onResponseError: ({ error }) => {
      toast.add({
        title: "Error fetching supervisors",
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)
</script>

<template>
  <paginated-overview
    :breadcrumbs
    v-model="selectedLetter"
    v-model:page="page"
    v-model:page-size="pageSize"
  >
    <u-page-grid
      v-if="data?.count || ['pending', 'idle'].includes(status)"
      class="mt-10"
    >
      <base-card
        v-if="data"
        v-for="supervisor in data.supervisors"
        :key="supervisor"
        type="supervisor"
        :id="supervisor"
      />

      <base-loading-card
        v-else
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      title="No supervisors found"
      :icon="ICONS.noSupervisor"
    />
  </paginated-overview>
</template>
