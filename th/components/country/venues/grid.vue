<script setup lang="ts">
const { venues, status } = defineProps<{
  venues: VenueInterface[]
  status: APIStatusType
}>()

const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
</script>

<template>
  <u-page-grid
    v-if="venues.length || ['pending', 'idle'].includes(status)"
    class="my-5"
  >
    <u-page-card
      v-if="venues.length"
      v-for="venue in venues"
      :key="venue.id"
      :title="venue.name ? `${venue.name}, ${venue.city}` : venue.city"
      :to="{ name: 'venue', params: { id: encodeName(venue.id) } }"
      highlight
      highlight-color="joint"
      :ui="{
        body: 'mx-auto w-full',
        title: 'text-center flex items-center gap-2 justify-center',
        container: 'items-center'
      }"
    />
    <loading-base
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :message="`No venues located in ${name}`"
  />
</template>
