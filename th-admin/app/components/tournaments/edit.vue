<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { tournament } = defineProps<{ tournament: TournamentInterface }>()
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const uploading = ref(false)

type Schema = z.output<typeof tournamentSchema>

const state = reactive<Partial<Schema>>({
  id: tournament.id,
  name: tournament.name,
  established: tournament.established ?? undefined,
  abolished: tournament.abolished ?? undefined,
  website: tournament.website,
  tours: tournament.tours as Schema["tours"]
})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Name", key: "name", type: "text", required: true, colSpan: 2 },
  { label: "Tours", key: "tours", type: "tags", required: true, colSpan: 2 },
  { label: "Established", key: "established", type: "number" },
  { label: "Abolished", key: "abolished", type: "number" },
  { label: "Website", key: "website", type: "textarea", colSpan: 2 }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(uploading, true)
  try {
    await $fetch("/api/tournaments/update", {
      query: event.data
    })
    toast.add({
      title: "Tournament updated",
      icon: icons.success,
      color: "success"
    })
    set(open, false)
  } catch (e) {
    toast.add({
      title: "Error updating tournament",
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
  <u-modal
    :title="tournament.id.toString()"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      :label="tournament.name ?? tournament.id.toString()"
      :id="`tournament-${tournament.id}`"
      block
    />

    <template #body>
      <u-form
        id="tournament-form"
        :schema="tournamentSchema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <form-field
            v-for="field in formFields"
            :key="field.key"
            :field="field"
            v-model="state[field.key]"
          />
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="tournament-form"
        type="submit"
        label="Save"
        :icon="uploading ? ICONS.uploading : icons.check"
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.close"
      />
    </template>
  </u-modal>
</template>
