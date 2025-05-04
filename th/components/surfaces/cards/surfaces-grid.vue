<script setup lang="ts">
const { data, status } = defineProps<{
  data: SurfacesAPIResponseType
  status: APIStatusType
}>()
</script>

<template>
  <error-message
    v-if="status === 'error' || !data.count"
    title="No surfaces found"
  />
  <u-page-grid v-else>
    <base-card
      v-if="data.count"
      v-for="surface in data.surfaces"
      :key="surface.id"
      type="surface"
      :surface
    />

    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
</template>
