<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const open = ref(false)
const toast = useToast()

type Schema = z.output<typeof tournamentSchema>

const state = reactive<Partial<Schema>>({
  id: 0,
  name: "",
  established: undefined,
  abolished: undefined,
  website: undefined,
  tours: []
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/create-tournament", {
      query: event.data
    })
    toast.add({
      title: "Tournament created",
      icon: "lucide:circle-check",
      color: "success"
    })
    set(open, false)
  } catch (e) {
    toast.add({
      title: "Error creating tournament",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-modal
    title="Create Tournament"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Create Tournament"
      size="sm"
    />

    <template #body>
      <u-form
        id="tournament-form"
        :schema="tournamentSchema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <u-form-field
            name="id"
            label="ID"
          >
            <u-input
              type="number"
              v-model="state.id"
              placeholder="Enter Tournament ID"
              class="w-full"
            />
          </u-form-field>

          <u-form-field
            name="name"
            label="Name"
          >
            <u-input
              v-model="state.name"
              placeholder="Enter Tournament Name"
              class="w-full"
            />
          </u-form-field>

          <u-form-field
            name="tours"
            label="Tours"
          >
            <u-input-tags
              v-model="state.tours"
              placeholder="Enter Tournament Tours"
              class="w-full"
            />
          </u-form-field>

          <u-form-field
            name="established"
            label="Established"
          >
            <u-input
              v-model="state.established"
              type="number"
              placeholder="Enter Year Established"
              class="w-full"
            />
          </u-form-field>

          <u-form-field
            name="abolished"
            label="Abolished"
          >
            <u-input
              v-model="state.abolished"
              type="number"
              placeholder="Enter Year Abolished"
              class="w-full"
            />
          </u-form-field>

          <div class="col-span-2">
            <u-form-field
              name="website"
              label="Website"
            >
              <u-textarea
                v-model="state.website"
                placeholder="Enter Website URL"
                class="w-full"
              />
            </u-form-field>
          </div>
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="tournament-form"
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
