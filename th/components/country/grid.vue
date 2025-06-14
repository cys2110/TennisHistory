<script setup lang="ts">
const { icons } = useAppConfig()
const page = ref(1)
const selectedLetter = defineModel<string>()

// API call
const { data, status } = await useFetch<APICountriesResponseType>("/api/countries", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 40) }
})

// Reset page when the selected letter changes
watch(selectedLetter, () => (page.value = 1))
</script>

<template>
  <u-page-grid
    v-if="(data && data.count) || ['pending', 'idle'].includes(status)"
    class="my-5"
  >
    <u-page-card
      v-if="data?.count"
      v-for="country in data.countries"
      :key="country.id"
      :to="{ name: 'country', params: { id: country.id, name: encodeName(country.name) } }"
      highlight
      highlight-color="joint"
      :ui="{
        body: 'mx-auto w-full',
        title: 'text-center flex items-center gap-2 justify-center flex-wrap',
        container: 'items-center'
      }"
    >
      <template #title>
        <u-icon
          :name="getFlagCode(country)"
          class="text-xl"
        />
        {{ country.name }}
      </template>
    </u-page-card>
    <loading-base
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    message="No countries found"
    :icon="icons.noCountries"
  />
  <u-pagination
    v-if="data && data.count"
    v-model:page="page"
    :total="data.count"
    :items-per-page="40"
    variant="ghost"
    color="primary"
    active-variant="subtle"
    class="mx-auto mt-auto"
  />
</template>
