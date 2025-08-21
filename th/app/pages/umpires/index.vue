<script setup lang="ts">
import { InputTableHeader, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/vue-table"
const { viewMode } = useDefaults()
useHead({ title: "Umpires" })
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Umpires",
  description: "A collection of tennis umpires"
}))

const selectedLetter = ref<string | undefined>()

// API call
const { data: umpires, status } = await useFetch<PlayerInterface[]>("/api/umpires", {
  key: "umpires",
  default: () => []
})

const filteredUmpires = computed(() => {
  if (umpires.value && selectedLetter.value) {
    return umpires.value.filter(supervisor => supervisor.last_name.startsWith(selectedLetter.value!))
  }
  return umpires.value
})

// TOC
const toc = computed(() => [
  {
    id: "umpires",
    items: filteredUmpires.value.map(umpire => ({
      label: umpire.id,
      to: `#${umpire.id}`
    }))
  }
])

const columns: TableColumn<PlayerInterface>[] = [
  {
    accessorKey: "last_name",
    header: ({ column }) =>
      h(InputTableHeader, {
        column: column as Column<unknown>,
        label: "Umpire"
      }),
    cell: ({ row }) =>
      h(
        ULink,
        {
          class: "hover-link",
          to: { name: "umpire", params: { id: kebabCase(row.original.id) } }
        },
        () => row.original.id
      ),
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
                  placeholder="Search umpires"
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
          :data="umpires"
          :columns
          :loading="status === 'pending'"
          sticky
          empty="No umpires found"
          v-model:columnFilters="columnFilters"
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          :ui="{
            root: 'w-fit mx-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent'
          }"
        />

        <u-page-grid
          v-else-if="umpires.length || status === 'pending'"
          class="xl:grid-cols-4 2xl:grid-cols-5 p-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent overflow-y-auto scroll-smooth"
        >
          <div
            v-if="umpires.length"
            v-for="umpire in filteredUmpires"
            :key="umpire.id"
            :id="umpire.id"
          >
            <u-page-card
              :title="umpire.id"
              highlight
              highlight-color="joint"
              :to="{ name: 'umpire', params: { id: kebabCase(umpire.id) } }"
              :ui="{ title: 'text-center', body: 'w-full' }"
            />
          </div>

          <loading-base
            v-else
            v-for="_ in 10"
            :key="_"
          />
        </u-page-grid>
        <error-message
          v-else
          message="No umpires found"
        />
      </template>

      <template
        #footer
        v-if="viewMode !== 'list'"
      >
        <div class="font-semibold p-5 border-t border-muted">Total: {{ filteredUmpires.length }}</div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
