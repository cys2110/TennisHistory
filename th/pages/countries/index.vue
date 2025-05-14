<script setup lang="ts">
import { CountriesGrid, CountriesTable } from "#components"

useHead({ title: "Countries", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
const appConfig = useAppConfig()
const toast = useToast()

const selectedLetter = ref<string>("All")
const skip = ref(0)
const sort = ref<"ASC" | "DESC">("ASC")
const countries = ref<CountryInterface[]>([])

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Countries", icon: ICONS.countries }
]

interface APIResponseType {
  count: number
  countries: CountryInterface[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/countries", {
  query: { skip, sort, letter: selectedLetter },
  default: () => ({ count: 0, countries: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (countries.value = [...countries.value, ...(response._data.countries || [])]),
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

execute()

watch([sort, selectedLetter], () => {
  skip.value = 0
  countries.value = []
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <letters-select v-model="selectedLetter" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? CountriesGrid : CountriesTable"
          :key="viewMode"
          v-model="skip"
          v-model:sort="sort"
          :countries
          :status
          :count="data?.count ?? 0"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
