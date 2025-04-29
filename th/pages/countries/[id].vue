<script setup lang="ts">
definePageMeta({ name: "country" })
const id = useRouteParams<string>("id")
const route = useRoute()
const toast = useToast()

// API call
const { data: country, refresh } = await useFetch<CountryInterface>("/api/country-details", {
  query: { id },
  watch: false,
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details about ${id.value}`,
      description: error?.message,
      icon: ICONS.error,
      color: "error"
    })
  }
})

watch(
  () => id.value,
  newId => {
    if (newId && newId !== " " && route.name === "country") refresh()
  }
)

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Countries", to: { name: "countries" }, icon: ICONS.countries },
  { label: country.value?.name, icon: country.value?.alpha2 ? `flag:${country.value?.alpha2}-4x3` : `flags:${id.value}` }
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
