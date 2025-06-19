<script setup lang="ts">
definePageMeta({ name: "event" })
const {
  name,
  params: { name: paramName, year, id }
} = useRoute()
const currentPage = computed(() => EVENT_PAGES.find(page => page.name === name))
const tournamentName = computed(() => decodeName(paramName as string))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: `${tournamentName.value} ${year}` } })
</script>

<template>
  <event-wrapper v-slot="{ tours }">
    <event-country-overview v-if="COUNTRY_DRAWS.includes(id as string)" />
    <event-overview
      :tours
      v-else
    />
  </event-wrapper>
</template>
