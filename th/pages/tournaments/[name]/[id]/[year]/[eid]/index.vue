<script setup lang="ts">
definePageMeta({
  name: "event",
  layout: "event",
  middleware: [
    function (to, from) {
      if (COUNTRY_DRAWS.includes(to.params.id as string)) return navigateTo({ name: "country-event" })
    }
  ]
})
const { viewMode } = useViewMode()
</script>

<template>
  <div>
    <div
      v-if="viewMode === 'cards'"
      class="flex gap-5 flex-col"
    >
      <event-details />
      <awards />
      <seeds />
      <entry-info />
    </div>
    <u-page-columns
      v-else
      class="lg:columns-2 xl:columns-3 2xl:columns-3"
    >
      <event-details />
      <awards />
      <seeds />
      <entry-info />
    </u-page-columns>
    <entries />
  </div>
</template>
