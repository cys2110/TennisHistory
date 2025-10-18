<script setup lang="ts">
defineProps<{ label: string | TourEnum; size?: "xs" | "sm" | "md" | "lg" | "xl" }>()
const {
  ui: { colors }
} = useAppConfig()
</script>

<template>
  <u-badge
    :label
    :color="(label as keyof typeof colors)"
    :size="size || 'md'"
    class="font-semibold"
  />
</template>
