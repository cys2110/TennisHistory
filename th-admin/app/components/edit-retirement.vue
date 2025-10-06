<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { entry, type } = defineProps<{ entry: any; type: "Retirement" | "Walkover" }>()
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
    await $fetch("/api/update-retirement", {
      query: { ...event.data, relationship: type === "Retirement" ? "RETIRED" : "WALKOVER" }
    })
    toast.add({
      title: `${type} updated`,
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: `Error updating ${type}`,
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
    <div class="grid grid-cols-5 border-t border-muted pt-1.5 gap-2">
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
          class="w-full"
        />
      </u-form-field>

      <div class="flex justify-center items-center">
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
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="team_reason"
        label="Team Reason"
      >
        <u-input
          v-model="state.team_reason"
          placeholder="Team Reason"
          class="w-full"
        />
      </u-form-field>

      <div class="flex items-center">
        <u-button
          type="submit"
          label="Save"
          size="sm"
          block
        />
      </div>
    </div>
  </u-form>
</template>
