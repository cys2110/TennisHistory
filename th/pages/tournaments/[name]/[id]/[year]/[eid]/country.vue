<script setup lang="ts">
definePageMeta({
  name: "country-event",
  middleware: [
    function (to, from) {
      if (!COUNTRY_DRAWS.includes(to.params.id as string)) return navigateTo({ name: "event" })
    }
  ]
})
</script>

<template>
  <event-wrapper>
    <country-event-details />
    <country-event-entries />
  </event-wrapper>
</template>
