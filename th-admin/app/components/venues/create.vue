<script setup>
defineProps(["block"])
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const uploading = ref(false)

defineShortcuts({
  meta_enter: () => set(open, !get(open))
})

const schema = z.object({
  name: z.string().optional(),
  city: z.string(),
  country: z.string()
})

const state = reactive({})

const formFields = [
  { label: "Name", key: "name", type: "text", colSpan: 2 },
  { label: "City", key: "city", type: "text", required: true },
  { label: "Country", key: "country", type: "countries", required: true }
]

const onSubmit = async event => {
  set(uploading, true)
  try {
    await $fetch("/api/venues/create", {
      query: event.data
    })
    toast.add({
      title: "Venue created",
      icon: icons.success,
      color: "success"
    })
    set(open, false)
  } catch (e) {
    toast.add({
      title: "Error creating venue",
      description: e.message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-modal
    title="Create Venue"
    v-model:open="open"
  >
    <u-button
      :block
      :icon="icons.plus"
    />

    <template #body>
      <u-form
        id="venue-form"
        :schema="schema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <form-field
            v-for="field in formFields"
            :key="field.label"
            :field="field"
            v-model="state[field.key]"
          />
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <div class="w-full">
        <u-button
          form="venue-form"
          type="submit"
          label="Save"
          :icon="uploading ? ICONS.uploading : icons.check"
          block
        />
      </div>

      <div class="w-full">
        <u-button
          label="Cancel"
          color="error"
          @click="close"
          :icon="icons.close"
          block
        />
      </div>
    </template>
  </u-modal>
</template>
