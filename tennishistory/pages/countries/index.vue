<script setup lang="ts">
useHead({ title: "Countries", templateParams: { subPage: null } })
const appConfig = useAppConfig()
const toast = useToast()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Countries", icon: ICONS.countries }
]

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

interface CountriesAPIResponse {
  count: number
  countries: CountryInterface[]
}

// API call
const { data, status } = await useFetch<CountriesAPIResponse>("/api/countries/all-countries", {
  query: {
    letter: selectedLetter,
    skip: computed(() => (page.value - 1) * pageSize.value),
    limit: pageSize
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching countries",
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
      <country-card
        v-if="data"
        v-for="country in data.countries"
        :key="country.id"
        :country
      />
      <base-loading-card
        v-else
        v-for="_ in 15"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      :icon="ICONS.noCountries"
      title="No countries found"
    />
  </paginated-overview>
</template>
