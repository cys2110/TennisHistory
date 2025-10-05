<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { supervisor } = defineProps<{ supervisor: any }>()
const toast = useToast()

type Schema = z.output<typeof personSchema>

const state = reactive<Partial<Schema>>({
  id: supervisor.id,
  first_name: supervisor.first_name,
  last_name: supervisor.last_name
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/update-supervisor", {
      query: event.data
    })
    toast.add({
      title: "Supervisor updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating supervisor",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    :schema="personSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-4 border-t border-muted pt-1.5 gap-2">
      <u-form-field label="ID">
        <u-input
          v-model="state.id"
          placeholder="ID"
          class="w-full"
        />
      </u-form-field>
      <u-form-field label="First Name">
        <u-input
          v-model="state.first_name"
          placeholder="First Name"
        />
      </u-form-field>

      <u-form-field label="Last Name">
        <u-input
          v-model="state.last_name"
          placeholder="Last Name"
        />
      </u-form-field>
      <div class="flex items-center justify-center">
        <u-button
          type="submit"
          label="Save"
          size="sm"
        />
      </div>
    </div>
  </u-form>
</template>
