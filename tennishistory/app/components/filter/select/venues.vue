<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<string[]>()
const {
  ui: { icons }
} = useAppConfig()

const { data: venues, status } = await useFetch<VenueInterface[]>("/api/venues", {
  key: "venues",
  default: () => []
})
</script>

<template>
  <u-form-field
    label="Venues"
    :size="middleSizes ? 'sm' : 'md'"
    class="my-3"
  >
    <u-select-menu
      v-model="modelValue"
      multiple
      :items="venues.map(venue => ({ id: venue.id, name: venue.name ? `${venue.name}, ${venue.city}` : venue.city }))"
      label-key="name"
      value-key="id"
      :loading="['idle', 'pending'].includes(status)"
      :icon="ICONS.venue"
      placeholder="Select venues"
    >
      <template #content-bottom>
        <u-button
          :trailing-icon="icons.close"
          color="neutral"
          variant="link"
          size="xs"
          @click="modelValue = []"
          label="Clear"
          block
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select-menu>
  </u-form-field>
</template>
