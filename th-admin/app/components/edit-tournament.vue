<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { tournament } = defineProps<{ tournament: TournamentInterface }>()
const open = ref(false)
const toast = useToast()

type Schema = z.output<typeof tournamentSchema>

const state = reactive<Partial<Schema>>({
  id: tournament.id,
  name: tournament.name,
  established: tournament.established,
  abolished: tournament.abolished,
  website: tournament.website,
  tours: tournament.tours
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/update-tournament", {
      query: event.data
    })
    toast.add({
      title: "Tournament updated",
      icon: "lucide:circle-check",
      color: "success"
    })
    set(open, false)
  } catch (e) {
    toast.add({
      title: "Error updating tournament",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-modal
    :title="tournament.id.toString()"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      :label="tournament.name ?? tournament.id.toString()"
      :id="`tournament-${tournament.id}`"
      block
      variant="link"
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
            name="name"
            label="Name"
          >
            <u-input v-model="state.name" />
          </u-form-field>
          <u-form-field
            name="tours"
            label="Tours"
          >
            <u-input-tags v-model="state.tours" />
          </u-form-field>
          <u-form-field
            name="established"
            label="Established"
          >
            <u-input
              v-model="state.established"
              type="number"
            />
          </u-form-field>
          <u-form-field
            name="abolished"
            label="Abolished"
          >
            <u-input
              v-model="state.abolished"
              type="number"
            />
          </u-form-field>
          <div class="col-span-2">
            <u-form-field
              name="website"
              label="Website"
            >
              <u-textarea
                v-model="state.website"
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
