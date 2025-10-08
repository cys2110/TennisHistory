<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { query } = useRoute()
const toast = useToast()

const { data: entries, status } = await useFetch("/api/get-entries", {
  query: { id: query.id },
  default: () => []
})

type Schema = z.output<typeof ldaSchema>

const state = reactive<Partial<Schema>>({
  id: "",
  draw: "",
  type: "",
  rank: undefined,
  eid: query.id as string
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/add-lda", {
      query: event.data
    })
    toast.add({
      title: "LDA created",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error creating LDA",
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
    :schema="ldaSchema"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-5 border-t border-muted pt-1.5 gap-2">
      <u-form-field
        name="id"
        label="Player"
      >
        <u-select-menu
          v-model="state.id"
          :loading="['pending', 'idle'].includes(status)"
          :items="entries.map(e => ({ ...e, label: e.first_name ? `${e.last_name}, ${e.first_name} - ${e.type}` : `${e.id} - ${e.type}` }))"
          value-key="fid"
          label-key="label"
          placeholder="Select player"
          class="w-full"
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
          class="w-full"
        />
      </u-form-field>
      <u-form-field
        name="type"
        label="Draw"
      >
        <u-select
          v-model="state.draw"
          :items="['Main', 'Qualifying']"
          placeholder="Select draw"
          class="w-full"
        />
      </u-form-field>
      <u-form-field
        name="rank"
        label="Rank"
      >
        <u-input-number
          v-model="state.rank"
          orientation="vertical"
          placeholder="Rank"
          class="w-full"
        />
      </u-form-field>
      <div class="flex items-end">
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
