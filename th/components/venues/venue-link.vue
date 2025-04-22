<script setup lang="ts">
defineProps<{ venue: VenueInterface }>()
</script>

<template>
  <u-link
    class="hover-link"
    :to="{ name: 'venue', params: { id: encodeName(venue.id) } }"
  >
    {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
  </u-link>
</template>
