<script setup lang="ts">
import { ArchiveGrid, ArchiveTable } from "#components"

useHead({ title: "Results Archive" })
const { viewMode } = useDefaults()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
</script>

<template>
  <div class="w-full">
    <component
      :is="viewMode === 'list' && mdAndUp ? ArchiveTable : ArchiveGrid"
      :key="viewMode"
    />
  </div>
</template>
