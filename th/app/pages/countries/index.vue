<script setup lang="ts">
import { CountryLink, InputTableHeader } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/vue-table"
const { icons } = useAppConfig()
const { viewMode } = useDefaults()
useHead({ title: "Countries" })
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Countries",
  description: "A collection of countries"
}))

const selectedLetter = ref<string | undefined>()

// API call
const { data: countries, status } = await useFetch<CountryInterface[]>("/api/countries", {
  key: "countries",
  default: () => []
})

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
    items: countries.value.map(country => ({
      label: country.name,
      to: `#${country.id}`
    }))
  }
])

const columns: TableColumn<CountryInterface>[] = [
  {
    accessorKey: "name",
    header: ({ column }) =>
      h(InputTableHeader, {
        column: column as Column<unknown>,
        label: "Country"
      }),
    cell: ({ row }) =>
      h(CountryLink, {
        country: row.original,
        iconOnly: false,
        class: "mx-auto"
      }),
    footer: ({ table }) => {
      const filteredRows = table.getFilteredRowModel().rows
      return `Total: ${filteredRows.length}`
    }
  }
]

const columnFilters = ref([])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template
            #right
            v-if="viewMode !== 'list'"
          >
            <u-slideover
              v-if="mdAndDown"
              title="Filters"
              class="ml-auto"
            >
              <u-button
                :icon="icons.filter"
                size="xs"
              />
              <template #body>
                <filter-letters v-model="selectedLetter" />
              </template>
            </u-slideover>

            <u-popover>
              <u-button
                :size="mdAndDown ? 'xs' : 'sm'"
                :icon="icons.toc"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search countries"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :fuse="{ resultLimit: 1000 }"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar v-if="!mdAndDown && viewMode !== 'list'">
          <filter-letters
            v-model="selectedLetter"
            :ui="{ fieldset: 'flex-wrap gap-2' }"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-table
          v-if="viewMode === 'list'"
          :data="countries"
          :columns
          :loading="status === 'pending'"
          sticky
          empty="No countries found"
          v-model:columnFilters="columnFilters"
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          :ui="{
            root: 'w-fit min-w-1/4 mx-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent'
          }"
        />

        <u-page-grid
          v-else-if="countries.length || status === 'pending'"
          class="xl:grid-cols-4 2xl:grid-cols-5 p-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent overflow-y-auto scroll-smooth"
        >
          <div
            v-if="countries.length"
            v-for="country in filteredCountries"
            :key="country.id"
            :id="country.id"
          >
            <u-page-card
              highlight
              highlight-color="joint"
              :to="{ name: 'country', params: { id: country.id, name: kebabCase(country.name) } }"
              :ui="{ body: 'w-full' }"
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
      </template>

      <template
        #footer
        v-if="viewMode !== 'list'"
      >
        <div class="font-semibold p-5 border-t border-muted">Total: {{ filteredCountries.length }}</div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
