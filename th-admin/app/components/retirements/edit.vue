<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { entry, type } = defineProps<{ entry: any; type: "Retirement" | "Walkover" | "Default" }>()
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

type Schema = z.output<typeof retirementSchema>

const state = reactive<Partial<Schema>>({
  id: entry.id,
  type: entry.type,
  team_reason: entry.team_reason,
  reason: entry.reason
})

const formFields = computed<FormFieldInterface<Schema>[]>(() => [
  { label: "Reason", key: "reason", type: "text" },
  { label: "Team Reason", key: "team_reason", type: "text" }
])

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(uploading, true)
  try {
    await $fetch("/api/retirements/update", {
      query: { ...event.data, relationship: type === "Retirement" ? "RETIRED" : type.toUpperCase() }
    })
    toast.add({
      title: `${type} updated`,
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: `Error updating ${type}`,
      description: (e as Error).message,
      icon: icons.close,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-form
    :schema="retirementSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-4 border-b border-muted pb-2 gap-2">
      <u-form-field label="Player">
        <u-link
          v-if="!entry.first_name"
          :to="{ name: 'player', query: { id: entry.pid } }"
        >
          {{ entry.id }}
        </u-link>
        <u-input
          v-else
          :model-value="`${entry.first_name} ${entry.last_name}`"
          disabled
          class="w-full"
        />

        <template #hint>
          <u-badge
            :label="entry.type"
            :color="entry.type"
            size="sm"
          />
        </template>
      </u-form-field>

      <form-field
        v-for="field in formFields"
        :key="field.label"
        :field
        v-model="state[field.key]"
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
