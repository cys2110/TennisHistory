<script setup lang="ts">
definePageMeta({ name: "countries" })
useHead({ title: "Countries", templateParams: { subPage: null } })

interface CountriesAPIResponse {
  count: number
  countries: CountryInterface[]
}

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

// API call
const { data, status } = await useFetch<CountriesAPIResponse>("/api/all-countries", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * pageSize.value), limit: pageSize }
})

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Countries", icon: ICONS.countries }
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
      <country-card
        v-for="country in data.countries"
        :key="country.id"
        :country
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
      :icon="ICONS.noCountries"
      title="No countries found"
      :status
      error="Error fetching countries"
    />
  </paginated-overview>
</template>
