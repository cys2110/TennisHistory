<script setup lang="ts">
definePageMeta({ name: "event" })
</script>

<template>
  <div>
    <nuxt-layout name="event-layout">
      <event-details />

      <div class="flex flex-wrap gap-5 justify-evenly">
        <awards />
        <seeds />
        <entry-info />
      </div>

      <entries />
    </nuxt-layout>
  </div>
</template>
