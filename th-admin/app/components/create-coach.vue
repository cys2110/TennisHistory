<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const open = ref(false)
const toast = useToast()

type Schema = z.output<typeof personSchema>

const state = reactive<Partial<Schema>>({
  first_name: "",
  last_name: ""
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/create-coach", {
      query: event.data
    })
    toast.add({
      title: "Coach created",
      icon: "lucide:circle-check",
      color: "success"
    })
    set(open, false)
  } catch (e) {
    toast.add({
      title: "Error creating coach",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-modal
    title="Create Coach"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Create Coach"
      size="sm"
    />

    <template #body>
      <u-form
        id="coach-form"
        :schema="personSchema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <u-form-field label="First Name">
            <u-input
              v-model="state.first_name"
              placeholder="First Name"
            />
          </u-form-field>

          <u-form-field
            name="last_name"
            label="Last Name"
          >
            <u-input
              v-model="state.last_name"
              placeholder="Last Name"
            />
          </u-form-field>
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="coach-form"
        type="submit"
        label="Save"
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
      />
    </template>
  </u-modal>
</template>
