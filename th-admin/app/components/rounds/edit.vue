<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { round } = defineProps<{ round: any }>()
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

type Schema = z.output<typeof roundSchema>

const state = reactive<Partial<Schema>>({
  id: round.id,
  tour: round.tour,
  draw: round.draw,
  type: round.type,
  round: round.round,
  number: round.number,
  points: round.points,
  pm: round.pm
})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Number", key: "number", type: "number" },
  { label: "Points", key: "points", type: "number" },
  { label: "Prize Money", key: "pm", type: "currency" }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(uploading, true)
  try {
    await $fetch("/api/rounds/update", {
      query: event.data
    })
    toast.add({
      title: "Round updated",
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating round",
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
  <u-form
    :schema="roundSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-5 border-b border-muted pb-2 gap-1">
      <u-form-field label="Round">
        <u-input
          :model-value="round.round"
          disabled
        />

        <template #hint>
          <div class="flex justify-between items-center gap-1">
            <u-badge
              :label="round.tour"
              :color="round.tour"
              size="sm"
            />
            <u-badge
              :label="round.type"
              :color="round.type"
              size="sm"
            />
            <u-badge
              :label="round.draw"
              :color="round.draw"
              size="sm"
            />
          </div>
        </template>
      </u-form-field>

      <form-field
        v-for="field in formFields"
        :key="field.label"
        :field
        v-model="state[field.key]"
        :currency="round.currency"
      />

      <div class="flex items-center">
        <u-button
          type="submit"
          label="Save"
          block
          :icon="uploading ? ICONS.uploading : icons.check"
        />
      </div>
    </div>
  </u-form>
</template>
