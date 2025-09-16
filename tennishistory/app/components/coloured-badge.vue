<script setup lang="ts">
const { label } = defineProps<{ label: string; size?: "xs" | "sm" | "md" | "lg" | "xl" }>()
const {
  ui: { colors }
} = useAppConfig()

const getBadgeColour = () => {
  switch (label) {
    case "ITF (M)":
      return "men"
    case "ITF (W)":
      return "women"
    default:
      return label.toLowerCase() as keyof typeof colors
  }
}
</script>

<template>
  <u-badge
    :label="label"
    :color="getBadgeColour()"
    :size="size || 'md'"
    class="font-semibold"
  />
</template>
