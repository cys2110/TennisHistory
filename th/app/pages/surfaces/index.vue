<script setup lang="ts">
import { SurfaceGrid, SurfaceTable } from "#components"
useHead({ title: "Surfaces", templateParams: { subPage: null } })
const { viewMode } = useViewMode()
</script>

<template>
  <page-wrapper>
    <component :is="viewMode === 'list' ? SurfaceTable : SurfaceGrid" />
  </page-wrapper>
</template>
