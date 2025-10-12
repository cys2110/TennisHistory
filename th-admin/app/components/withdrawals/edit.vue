<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { entry } = defineProps<{ entry: any }>()
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

type Schema = z.output<typeof withdrawalSchema>

const state = reactive<Partial<Schema>>({
  id: entry.id,
  type: entry.type,
  team_reason: entry.team_reason,
  reason: entry.reason,
  draw: entry.draw,
  team_mate: entry.team_mate?.id
})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Reason", key: "reason", type: "text" },
  { label: "Team Reason", key: "team_reason", type: "text" },
  { label: "Team Mate", key: "team_mate", type: "players" }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(uploading, true)
  try {
    await $fetch("/api/withdrawals/update", {
      query: event.data
    })
    toast.add({
      title: "Withdrawal updated",
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating withdrawal",
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
    :schema="withdrawalSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-5 border-b border-muted pb-2 gap-3">
      <u-form-field label="Player">
        <div class="flex items-center gap-2">
          <u-link
            v-if="!entry.first_name"
            :to="{ name: 'player', params: { id: entry.pid } }"
          >
            {{ entry.id }}
          </u-link>
          <u-input
            v-else
            :value="`${entry.first_name} ${entry.last_name}`"
            disabled
          />
        </div>

        <template #hint>
          <div class="flex justify-between items-center">
            <u-badge
              :label="entry.type"
              :color="entry.type"
              size="sm"
            />
            <u-badge
              :label="entry.draw"
              :color="entry.draw"
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
