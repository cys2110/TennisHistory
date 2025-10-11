<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { type } = defineProps<{ type: "Coach" | "Umpire" | "Supervisor" }>()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const toast = useToast()
const updating = ref(false)

type Schema = z.output<typeof personSchema>

const state = reactive<Partial<Schema>>({})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "First Name", key: "first_name", type: "text", required: true },
  { label: "Last Name", key: "last_name", type: "text", required: true }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(updating, true)
  try {
    await $fetch("/api/create-person", {
      query: { ...event.data, type }
    })
    toast.add({
      title: `${type} created`,
      icon: icons.success,
      color: "success"
    })
    set(open, false)
  } catch (e) {
    toast.add({
      title: `Error creating ${type}`,
      description: (e as Error).message,
      icon: icons["error"],
      color: "error"
    })
  } finally {
    set(updating, false)
  }
}
</script>

<template>
  <u-modal
    :title="`Create ${type}`"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      :label="`Create ${type}`"
      block
      icon="line-md:account-add"
    />

    <template #body>
      <u-form
        id="person-form"
        :schema="personSchema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <form-field
            v-for="field in formFields"
            :key="field.key"
            :field="field"
            v-model="state[field.key]"
          />
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="person-form"
        type="submit"
        label="Save"
        :icon="updating ? ICONS.uploading : icons.check"
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
