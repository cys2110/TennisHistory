<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { round } = defineProps<{ round: any }>()
const toast = useToast()

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

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/update-round", {
      query: event.data
    })
    toast.add({
      title: "Round updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating round",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    :schema="roundSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-6 border-t border-muted pt-1.5 gap-0.5">
      <u-form-field label="Round">
        <u-input
          :model-value="round.round"
          disabled
          size="sm"
        />
      </u-form-field>
      <div class="flex items-center gap-1">
        <u-badge
          :label="round.tour"
          :color="round.tour"
        />
        <u-badge
          :label="round.type"
          :color="round.type"
        />
        <u-badge
          :label="round.draw"
          :color="round.draw"
        />
      </div>
      <u-form-field
        name="number"
        label="Number"
      >
        <u-input-number
          v-model="state.number"
          size="sm"
          orientation="vertical"
        />
      </u-form-field>
      <u-form-field
        name="points"
        label="Points"
      >
        <u-input-number
          v-model="state.points"
          size="sm"
          orientation="vertical"
        />
      </u-form-field>

      <u-form-field
        name="pm"
        label="Prize Money"
      >
        <u-input-number
          v-model="state.pm"
          size="sm"
          orientation="vertical"
          :format-options="{
            style: 'currency',
            currency: round.currency || 'USD'
          }"
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
