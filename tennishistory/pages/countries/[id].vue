<script setup lang="ts">
definePageMeta({ name: "country" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

// API call
const { data: country } = await useFetch<CountryInterface>("/api/countries/country-details", {
  query: { id: route.params.id },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details about ${route.params.id}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

useHead({ title: country.value?.name, templateParams: { subPage: "Countries" } })

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Countries", to: { name: "countries" }, icon: ICONS.countries },
  {
    label: country.value?.name,
    icon: country.value?.alpha2 ? `flag:${country.value?.alpha2}-4x3` : `flags:${route.params.id}`
  }
])
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <u-page-columns class="lg:columns-2 xl:columns-2 2xl:columns-2">
        <country-players :name="country?.name" />
        <country-venues :name="country?.name" />
      </u-page-columns>
    </nuxt-layout>
  </div>
</template>
