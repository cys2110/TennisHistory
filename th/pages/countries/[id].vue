<script setup lang="ts">
definePageMeta({ name: "country" })
const id = useRouteParams<string>("id")

// API call
const { data: country } = await useFetch<CountryInterface>("/api/country-details", { query: { id } })

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Countries", to: { name: "countries" }, icon: ICONS.countries },
  { label: country.value?.name, icon: `flag:${country.value?.alpha2}-4x3` }
])

useHead({ title: country.value?.name, templateParams: { subPage: "Countries" } })
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
