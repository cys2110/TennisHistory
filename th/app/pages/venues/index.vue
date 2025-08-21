<script setup lang="ts">
const { viewMode } = useDefaults()
useHead({ title: "Venues" })
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Venues",
  description: "A collection of tennis venues"
}))

const selectedLetter = ref<string | undefined>()
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
            v-if="mdAndDown && viewMode !== 'list'"
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
          </template>

          <template #right>
            <div id="toc" />
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
        <venue-table v-if="viewMode === 'list'" />

        <venue-grid
          v-else
          v-model="selectedLetter"
        />
      </template>

      <template
        #footer
        v-if="viewMode !== 'list'"
      >
        <div
          id="dashboard-footer"
          class="font-semibold p-5 border-t border-muted"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
