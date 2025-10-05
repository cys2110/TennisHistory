<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { entry } = defineProps<{ entry: any }>()
const toast = useToast()
const searchTerm = ref("")

const { data: players } = await useFetch("/api/search-players", {
  query: { search: searchTerm },
  default: () => []
})

type Schema = z.output<typeof withdrawalSchema>

const state = reactive<Partial<Schema>>({
  id: entry.id,
  type: entry.type,
  team_reason: entry.team_reason,
  reason: entry.reason,
  draw: entry.draw,
  team_mate: entry.team_mate?.id
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/update-withdrawal", {
      query: event.data
    })
    toast.add({
      title: "Withdrawal updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating withdrawal",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    :schema="withdrawalSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-6 border-t border-muted pt-1.5">
      <u-form-field label="Player">
        <u-link
          v-if="!entry.first_name"
          :to="{ name: 'edit-player', query: { id: entry.pid } }"
        >
          {{ entry.id }}
        </u-link>
        <u-input
          v-else
          :value="`${entry.first_name} ${entry.last_name}`"
          disabled
        />
      </u-form-field>

      <div class="flex items-center gap-1">
        <u-badge
          :label="entry.type"
          :color="entry.type"
        />
        <u-badge
          :label="entry.draw"
          :color="entry.draw"
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

      <u-form-field
        name="team_mate"
        label="Team Mate"
      >
        <u-select-menu
          v-model="state.team_mate"
          v-model:search-term="searchTerm"
          :items="[entry.team_mate, ...players]"
          value-key="id"
          label-key="label"
          placeholder="Select team mate"
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
