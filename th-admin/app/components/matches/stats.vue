<script setup>
const {
  ui: { icons }
} = useAppConfig()
const toast = useToast()
const open = ref(false)
const uploading = ref(false)
</script>

<template>
  <u-modal
    title="Add Stats"
    v-model:open="open"
  >
    <u-button
      label="Add Stats"
      :icon="icons.plus"
      block
    />

    <template #body></template>

    <template #footer="{ close }">
      <u-button
        form="stats-form"
        type="submit"
        label="Save"
        :icon="uploading ? ICONS.uploading : icons.upload"
        block
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.error"
        block
      />
    </template>
  </u-modal>
</template>
