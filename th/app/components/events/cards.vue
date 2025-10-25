<script setup lang="ts">
defineProps<{ event: EventInterface }>()
const {
  params: { id }
} = useRoute("event")
</script>

<template>
  <events-wrapper-cards :event>
    <events-country v-if="COUNTRY_DRAWS.includes(id)" />

    <events-overview v-else />
  </events-wrapper-cards>
</template>
