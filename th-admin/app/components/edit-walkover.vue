<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { entry } = defineProps<{ entry: any }>()
const toast = useToast()

type Schema = z.output<typeof retirementSchema>

const state = reactive<Partial<Schema>>({
  id: entry.id,
  type: entry.type,
  team_reason: entry.team_reason,
  reason: entry.reason
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/update-walkover", {
      query: event.data
    })
    toast.add({
      title: "Walkover updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating walkover",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    :schema="retirementSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-5 border-t border-muted pt-1.5 gap-0.5">
      <u-form-field label="Player">
        <u-link
          v-if="!entry.first_name"
          :to="{ name: 'edit-player', query: { id: entry.pid } }"
        >
          {{ entry.id }}
        </u-link>
        <u-input
          v-else
          :model-value="`${entry.first_name} ${entry.last_name}`"
          disabled
        />
      </u-form-field>

      <div class="flex items-center">
        <u-badge
          :label="entry.type"
          :color="entry.type"
        />
      </div>

      <u-form-field
        name="reason"
        label="Reason"
      >
        <u-input
          v-model="state.reason"
          placeholder="Reason"
        />
      </u-form-field>

      <u-form-field
        name="team_reason"
        label="Team Reason"
      >
        <u-input
          v-model="state.team_reason"
          placeholder="Team Reason"
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
