<script setup lang="ts">
definePageMeta({
  name: "country-event",
  layout: "event",
  middleware: [
    function (to, from) {
      if (!COUNTRY_DRAWS.includes(to.params.id as string)) return navigateTo({ name: "event" })
    }
  ]
})
</script>

<template>
  <div>
    <country-event-details />
    <country-event-entries />
  </div>
</template>
