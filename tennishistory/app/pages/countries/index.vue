<script setup lang="ts">
useHead({ title: "Countries" })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Countries",
  description: "A collection of countries"
}))

const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

// API call
const { data: countries, status } = await useFetch<CountryInterface[]>("/api/countries", {
  key: "countries",
  default: () => [],
  server: false
})

const selectedLetter = ref<string | undefined>()

const filteredCountries = computed(() => {
  if (countries.value && selectedLetter.value) {
    return countries.value.filter(country => country.name.startsWith(selectedLetter.value!))
  }
  return countries.value
})

// TOC
const toc = computed(() => [
  {
    id: "countries",
    items: filteredCountries.value.map(country => ({
      label: country.name,
      to: `#${country.id}`
    }))
  }
])
</script>

<template>
  <u-container>
    <u-page>
      <template #left>
        <u-page-aside>
          <filter-letters v-model="selectedLetter" />
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <div class="font-semibold">{{ filteredCountries.length }} countries</div>
          <u-command-palette
            v-if="filteredCountries.length"
            placeholder="Search countries"
            :groups="toc"
            :loading="status === 'pending'"
            :fuse="{ resultLimit: 1000 }"
            :ui="{ content: 'max-h-200 2xl:max-h-150' }"
          />
        </u-page-aside>
      </template>

      <u-page-header title="Countries">
        <template
          #links
          v-if="mdAndDown"
        >
          <u-slideover
            title="Filters"
            class="ml-auto"
          >
            <u-button :icon="icons.filter" />

            <template #body>
              <filter-letters v-model="selectedLetter" />
            </template>
          </u-slideover>
        </template>
      </u-page-header>

      <u-page-body>
        <u-page-grid v-if="filteredCountries.length || ['pending', 'idle'].includes(status)">
          <div
            v-if="filteredCountries.length"
            v-for="country in filteredCountries"
            :key="country.id"
            :id="country.id"
          >
            <u-page-card
              highlight
              :to="{ name: 'country', params: { id: country.id, name: kebabCase(country.name) } }"
              :ui="{ title: 'text-center', body: 'w-full' }"
            >
              <template #title>
                <country-link
                  :country
                  :icon-only="false"
                  class="mx-auto"
                />
              </template>
            </u-page-card>
          </div>

          <loading-base
            v-else
            v-for="_ in 10"
            :key="_"
          />
        </u-page-grid>
        <error-message
          v-else
          message="No countries found"
          :icon="icons.noCountries"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
