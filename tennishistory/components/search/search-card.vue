<script setup lang="ts">
const { result } = defineProps<{
  result: {
    labels: string[]
    country: CountryInterface | null
    min_year: string | null
    max_year: string | null
    name: string
    city: string | null
    id: string
    alpha2: string | null
  }
}>()

const toLink = computed(() => {
  if (result.labels.includes("Tournament")) {
    return { name: "tournament", params: { id: result.id, name: encodeName(result.name) } }
  } else {
    return { name: result.labels[0].toLowerCase(), params: { id: encodeName(result.id) } }
  }
})
</script>

<template>
  <u-page-card
    highlight
    :title="result.name || result.id"
    :description="result.city ? `${result.city}, ${result.country?.name}` : undefined"
    :icon="
      result.alpha2
        ? `flag:${result.alpha2}-4x3`
        : result.country
        ? `flag:${result.country.alpha2}-4x3`
        : undefined
    "
    :to="toLink"
  />
</template>
