<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const open = ref(false)
const toast = useToast()

const schema = z.object({
  name: z.string().optional(),
  city: z.string(),
  country: z.string()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  city: "",
  country: ""
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/venues/create", {
      query: event.data
    })
    toast.add({
      title: "Venue created",
      icon: "lucide:circle-check",
      color: "success"
    })
    set(open, false)
  } catch (e) {
    toast.add({
      title: "Error creating venue",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
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
      size="sm"
    />

    <template #body>
      <u-form
        id="venue-form"
        :schema="schema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <u-form-field label="Name">
            <u-input
              v-model="state.name"
              placeholder="Name"
            />
          </u-form-field>

          <u-form-field
            name="city"
            label="City"
          >
            <u-input
              v-model="state.city"
              placeholder="City"
            />
          </u-form-field>

          <u-form-field
            name="country"
            label="Country"
          >
            <u-input
              v-model="state.country"
              placeholder="Country"
            />
          </u-form-field>
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="venue-form"
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
