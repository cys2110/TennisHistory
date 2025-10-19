<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui"
const {
  ui: { icons }
} = useAppConfig()
const toast = useToast()
const open = ref(false)
const uploading = ref(false)

defineShortcuts({
  meta_shift_v: () => set(open, !get(open))
})

const state = reactive<VenueSchema>({
  name: "",
  city: "",
  country: {
    alpha2: "",
    name: "",
    id: ""
  }
})

const formFields: FormFieldInterface<VenueSchema>[] = [
  { label: "Name", key: "name", type: "text", colSpan: "col-span-2" },
  { label: "City", key: "city", type: "text", required: true },
  { label: "Country", key: "country", type: "search", subType: "countries", required: true }
]

const handleReset = () => {
  state.name = ""
  state.city = ""
  state.country = { alpha2: "", name: "", id: "" }
}

const onSubmit = async (event: FormSubmitEvent<VenueSchema>) => {
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
    handleReset()
    set(open, false)
  } catch (e) {
    toast.add({
      title: "Error creating venue",
      description: (e as Error).message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}

const onError = (event: FormErrorEvent) => {
  toast.add({
    title: "Error creating venue",
    description: event.errors.map(err => err.message).join(", "),
    icon: icons.error,
    color: "error"
  })
}
</script>

<template>
  <u-modal
    title="Create Venue"
    v-model:open="open"
  >
    <u-button
      icon="tabler:building-plus"
      label="Create Venue"
      block
    />

    <template #body>
      <u-form
        id="venue-form"
        :schema="venueSchema"
        :state
        @submit="onSubmit"
        @error="onError"
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
      <u-button
        form="venue-form"
        type="submit"
        label="Save"
        :icon="uploading ? ICONS.uploading : icons.check"
        block
      />

      <u-button
        label="Reset"
        @click="handleReset"
        :icon="icons.reload"
        block
        color="warning"
      />

      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.close"
        block
      />
    </template>
  </u-modal>
</template>
