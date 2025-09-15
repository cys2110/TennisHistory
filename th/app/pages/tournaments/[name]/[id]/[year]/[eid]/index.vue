<script setup lang="ts">
definePageMeta({ name: "event" })
const {
  params: { id }
} = useRoute("event")
</script>

<template>
  <event-wrapper>
    <event-country v-if="COUNTRY_DRAWS.includes(id as string)" />

    <event-overview v-else />
  </event-wrapper>
</template>
