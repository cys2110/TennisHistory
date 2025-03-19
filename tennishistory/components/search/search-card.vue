<script setup lang="ts">
const { result, type } = defineProps<{ result: any; type: string }>()

const details = computed(() => {
  switch (type) {
    case "Tournament":
      return {
        title: result.properties.name,
        to: { name: "tournament", params: { tid: result.properties.id, name: useChangeCase(result.properties.name, "kebabCase").value } }
      }
    case "Country":
      return {
        title: result.properties.name,
        to: { name: "country", params: { id: result.properties.id } },
        icon: `flag:${result.properties.alpha2}-4x3`
      }
    default:
      return {
        title: result.properties.id,
        to: { name: type.toLowerCase(), params: { id: useChangeCase(result.properties.id, "kebabCase").value } }
      }
  }
})
</script>

<template>
  <u-page-card
    v-if="details"
    highlight
    :title="details.title"
    :to="details.to"
    :icon="details.icon"
  />
</template>
