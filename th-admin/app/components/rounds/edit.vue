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
    await $fetch("/api/rounds/update", {
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
    <div class="grid grid-cols-6 border-t border-muted pt-1.5 gap-2">
      <u-form-field label="Round">
        <u-input
          :model-value="round.round"
          disabled
          class="w-full"
        />
      </u-form-field>
      <div class="flex justify-center items-center gap-1">
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
      <u-form-field label="Number">
        <u-input-number
          v-model="state.number"
          orientation="vertical"
          class="w-full"
        />
      </u-form-field>
      <u-form-field label="Points">
        <u-input-number
          v-model="state.points"
          orientation="vertical"
          class="w-full"
        />
      </u-form-field>

      <u-form-field label="Prize Money">
        <u-input-number
          v-model="state.pm"
          orientation="vertical"
          class="w-full"
          :format-options="{
            style: 'currency',
            currency: round.currency || 'USD'
          }"
        />
      </u-form-field>
      <div class="flex items-center">
        <u-button
          type="submit"
          label="Save"
          size="sm"
          block
          icon="lucide:square-check-big"
        />
      </div>
    </div>
  </u-form>
</template>
