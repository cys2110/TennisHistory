<script setup lang="ts">
const props = defineProps<{ name: string; tid: string; year: string; eid: string; start?: string }>()

const startDate = computed(() => {
  if (props.start) {
    return new Date(props.start)
  } else {
    return new Date(1968, 0, 1)
  }
})
const currentDate = new Date()
const isDisabled = computed(() => currentDate < startDate.value)
</script>

<template>
  <ClientOnly>
    <u-tooltip
      :disabled="!isDisabled"
      text="Event has not started yet"
    >
      <u-button-group size="xs">
        <u-button
          v-for="page in eVENTPAGES"
          :key="page.label"
          :label="page.label"
          color="secondary"
          variant="subtle"
          :to="{ name: page.name, params: { name: useChangeCase(name, 'kebabCase').value, tid, year, eid } }"
          :icon="page.icon"
          :disabled="isDisabled"
          prefetch-on="interaction"
        />
      </u-button-group>
    </u-tooltip>
  </ClientOnly>
</template>
