<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

defineProps<{ block?: boolean }>()
const open = ref(false)
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

type Schema = z.output<typeof tournamentSchema>

const state = reactive<Partial<Schema>>({})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Tournament Name", key: "name", type: "text", required: true, colSpan: 2 },
  { label: "Tournament ID", key: "id", type: "number", required: true },
  { label: "Tours", key: "tours", type: "tags", required: true },
  { label: "Year Established", key: "established", type: "number" },
  { label: "Year Abolished", key: "abolished", type: "number" },
  { label: "Website URL", key: "website", type: "textarea", colSpan: 2 }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(uploading, true)
  try {
    await $fetch("/api/tournaments/create", {
      query: event.data
    })
    toast.add({
      title: "Tournament created",
      icon: icons["success"],
      color: "success"
    })
    set(open, false)
  } catch (e) {
    toast.add({
      title: "Error creating tournament",
      description: (e as Error).message,
      icon: icons["error"],
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-modal
    title="Create Tournament"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Create Tournament"
      :icon="icons.plus"
      :block
    />

    <template #body>
      <u-form
        id="tournament-form"
        :schema="tournamentSchema"
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
        form="tournament-form"
        type="submit"
        label="Save"
        :icon="uploading ? ICONS.uploading : icons.check"
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons['error']"
      />
    </template>
  </u-modal>
</template>
