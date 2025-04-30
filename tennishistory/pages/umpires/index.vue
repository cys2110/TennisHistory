<script setup lang="ts">
useHead({ title: "Umpires", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Umpires", icon: ICONS.umpire }
]

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

interface UmpiresAPIResponse {
  count: number
  umpires: string[]
}

// API call
const { data, status } = await useFetch<UmpiresAPIResponse>("/api/umpires/all-umpires", {
  query: {
    letter: selectedLetter,
    skip: computed(() => (page.value - 1) * pageSize.value),
    limit: pageSize
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching umpires",
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
    :count="data?.count"
  >
    <u-page-grid
      v-if="data?.count || ['pending', 'idle'].includes(status)"
      class="mt-10"
    >
      <base-card
        v-if="data"
        v-for="umpire in data.umpires"
        :key="umpire"
        type="umpire"
        :id="umpire"
      />
      <base-loading-card
        v-else
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      title="No umpires found"
    />
  </paginated-overview>
</template>
