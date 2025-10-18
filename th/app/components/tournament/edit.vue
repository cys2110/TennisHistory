<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"

const { tournament } = defineProps<{ tournament: TournamentInterface; size?: "sm" | "md" }>()
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const uploading = ref(false)

const baseState = {
  id: tournament.id,
  name: tournament.name,
  established: tournament.established ?? undefined,
  abolished: tournament.abolished ?? undefined,
  website: tournament.website,
  tours: tournament.tours
}
const state = ref<TournamentSchema>(baseState)

const formFields: FormFieldInterface<TournamentSchema>[] = [
  { label: "Name", key: "name", type: "text", required: true, colSpan: 2 },
  {
    label: "Tours",
    key: "tours",
    type: "checkbox",
    items: Object.entries(TourEnum).map(tour => ({ label: tour[1], value: tour[0] })),
    required: true,
    colSpan: 2
  },
  { label: "Established", key: "established", type: "text", subType: "number" },
  { label: "Abolished", key: "abolished", type: "text", subType: "number" },
  { label: "Website", key: "website", type: "textarea", colSpan: 2 }
]

const handleReset = () => set(state, baseState)

const onSubmit = async (event: FormSubmitEvent<TournamentSchema>) => {
  set(uploading, true)
  try {
    await $fetch("/api/tournaments/edit", {
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
    :title="tournament.name ?? tournament.id.toString()"
    v-model:open="open"
  >
    <u-button
      :icon="ICONS.edit"
      label="Edit tournament"
      :size="size || 'xs'"
      block
      class="mt-2"
      :color="tournament.update ? 'warning' : 'primary'"
    />

    <template #body>
      <u-form
        id="tournament-form"
        ref="form"
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
        block
      />
      <u-button
        label="Reset"
        color="warning"
        @click="handleReset"
        :icon="icons.reload"
        block
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.close"
        block
      />
    </template>
  </u-modal>
</template>
