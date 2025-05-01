<script setup lang="ts">
definePageMeta({ name: "country-event" })
</script>

<template>
  <div>
    <nuxt-layout name="event-layout">
      <country-event-details />
      <country-event-entries />
    </nuxt-layout>
  </div>
</template>
