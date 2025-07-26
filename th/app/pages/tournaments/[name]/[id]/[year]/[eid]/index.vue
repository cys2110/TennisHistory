<script setup lang="ts">
definePageMeta({ name: "event" })
const { params } = useRoute()
const { id } = params as { id: string }
</script>

<template>
  <event-wrapper v-slot="{ tours }">
    <event-overview-country v-if="COUNTRY_DRAWS.includes(id as string)" />
    <event-overview
      v-else
      :tours
    />
  </event-wrapper>
</template>
