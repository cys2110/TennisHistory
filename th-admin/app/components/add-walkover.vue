<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { query } = useRoute()
const toast = useToast()

const { data: entries, status } = await useFetch("/api/get-entries", {
  query: { id: query.id },
  default: () => []
})

type Schema = z.output<typeof retirementSchema>

const state = reactive<Partial<Schema>>({
  id: "",
  type: "",
  draw: "",
  team_reason: undefined,
  reason: undefined,
  eid: query.id as string
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/add-walkover", {
      query: event.data
    })
    toast.add({
      title: "Walkover created",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error creating walkover",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    :state
    :schema="retirementSchema"
    @submit="onSubmit"
  >
    <div class="flex items-center justify-evenly border-t border-muted pt-1.5">
      <u-form-field
        name="id"
        label="Player"
      >
        <u-select-menu
          v-model="state.id"
          :loading="['pending', 'idle'].includes(status)"
          :items="entries.map(e => ({ ...e, label: e.first_name ? `${e.last_name}, ${e.first_name}` : e.id }))"
          value-key="fid"
          label-key="label"
          placeholder="Select player"
        />
      </u-form-field>

      <u-form-field
        name="type"
        label="Type"
      >
        <u-select
          v-model="state.type"
          :items="['Singles', 'Doubles']"
          placeholder="Select type"
        />
      </u-form-field>
      <u-form-field
        name="draw"
        label="Draw"
      >
        <u-select
          v-model="state.draw"
          :items="['Main', 'Qualifying']"
          placeholder="Select draw"
        />
      </u-form-field>

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
      <div class="flex items-end justify-center">
        <u-button
          type="submit"
          label="Save"
          size="sm"
        />
      </div>
    </div>
  </u-form>
</template>
