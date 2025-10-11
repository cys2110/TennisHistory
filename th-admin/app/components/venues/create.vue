<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

defineProps<{ block?: boolean }>()
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const uploading = ref(false)

const schema = z.object({
  name: z.string().optional(),
  city: z.string(),
  country: z.string()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Name", key: "name", type: "text", colSpan: 2 },
  { label: "City", key: "city", type: "text", required: true },
  { label: "Country", key: "country", type: "countries", required: true }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
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
      description: (e as Error).message,
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
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Create Venue"
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
      <u-button
        form="venue-form"
        type="submit"
        label="Save"
        :icon="uploading ? ICONS.uploading : icons.check"
      />

      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.close"
      />
    </template>
  </u-modal>
</template>
