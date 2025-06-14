<script setup lang="ts">
const { surfaces, status } = defineProps<{
  surfaces: SurfaceInterface[]
  status: APIStatusType
}>()
</script>

<template>
  <u-page-grid
    v-if="surfaces.length || ['pending', 'idle'].includes(status)"
    class="pt-10 px-4 pb-2"
  >
    <u-page-card
      v-if="surfaces.length"
      v-for="surface in surfaces"
      :key="surface.id"
      :to="{ name: 'surface', params: { id: encodeName(surface.id) } }"
      :title="surface.id"
      highlight
      highlight-color="joint"
      reverse
      :ui="{
        body: 'mx-auto w-full',
        title: 'text-center'
      }"
    >
      <nuxt-img
        :src="`/surfaces/${surface.surface}.jpg`"
        :alt="surface.id"
        class="opacity-75 rounded-lg"
      />
    </u-page-card>
    <loading-base
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>

  <error-message
    v-else
    message="No surfaces found"
  />
</template>
