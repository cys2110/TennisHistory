<script setup lang="ts">
const { type, id, surface, supervisor } = defineProps<{
  type: string
  id?: string
  surface?: SurfaceInterface
  supervisor?: { id: string; last_name: string }
}>()

const linkParams = computed(() => {
  if (surface) {
    return { id: encodeName(surface?.id) }
  } else if (supervisor) {
    return { id: encodeName(supervisor?.id) }
  } else if (id) {
    return { id: encodeName(id) }
  }
})
</script>

<template>
  <u-page-card
    :title="surface?.id ?? supervisor?.id ?? id"
    :to="{ name: type, params: linkParams }"
    highlight
    reverse
    :ui="{ body: 'mx-auto' }"
  >
    <nuxt-img
      v-if="surface"
      :src="`/surfaces/${surface.surface}.jpg`"
      :alt="surface.id"
      class="opacity-75 rounded-lg"
    />
  </u-page-card>
</template>
