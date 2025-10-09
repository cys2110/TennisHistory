<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const open = ref(false)
const toast = useToast()

const schema = z.object({
  id: z.string(),
  tour: z.string()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: "",
  tour: ""
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/players/create", {
      query: event.data
    })
    toast.add({
      title: "Player created",
      icon: "lucide:circle-check",
      color: "success"
    })
    set(open, false)
    await navigateTo({
      name: "edit-player",
      query: { id: state.id }
    })
  } catch (e) {
    toast.add({
      title: "Error creating player",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-modal
    title="Create Player"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Create Player"
      size="sm"
    />

    <template #body>
      <u-form
        id="player-form"
        :schema="schema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <u-form-field
            name="id"
            label="ID"
          >
            <u-input
              v-model="state.id"
              placeholder="ID"
              class="w-full"
            />
          </u-form-field>

          <u-form-field
            name="tour"
            label="Tour"
          >
            <u-select-menu
              v-model="state.tour"
              :items="['ATP', 'WTA']"
              placeholder="Select tour"
              class="w-full"
            />
          </u-form-field>
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="player-form"
        type="submit"
        label="Save"
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
      />
    </template>
  </u-modal>
</template>
