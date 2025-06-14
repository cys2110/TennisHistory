<script setup lang="ts">
import { UmpireGrid, UmpireTable } from "#components"

useHead({ title: "Umpires", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")
const selectedLetter = ref<string>("A")
</script>

<template>
  <page-wrapper>
    <template
      #nav-right
      v-if="mdAndDown"
    >
      <u-slideover
        title="Filters"
        class="ml-auto"
      >
        <u-button
          :icon="icons.filter"
          size="xs"
        />
        <template #body>
          <select-letters v-model="selectedLetter" />
        </template>
      </u-slideover>
    </template>
    <template
      #toolbar
      v-else
    >
      <select-letters v-model="selectedLetter" />
    </template>

    <component
      :is="viewMode === 'list' ? UmpireTable : UmpireGrid"
      :key="viewMode"
      v-model="selectedLetter"
    />
  </page-wrapper>
</template>
