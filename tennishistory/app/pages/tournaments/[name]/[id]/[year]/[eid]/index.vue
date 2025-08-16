<script setup lang="ts">
definePageMeta({ name: "event" })
const {
  params: { id }
} = useRoute()
</script>

<template>
  <event-wrapper v-slot="{ tours, tournament }">
    <event-overview-country
      v-if="COUNTRY_DRAWS.includes(id as string)"
      :tournament
    />
    <event-overview
      v-else
      :tours
      :tournament
    />
  </event-wrapper>
</template>
