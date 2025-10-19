<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui"
defineProps<{ size?: "xs" }>()
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)
const open = ref(false)

defineShortcuts({
  meta_enter: () => set(open, !get(open))
})

const state = reactive<TournamentSchema>({
  id: 0,
  name: "",
  established: undefined,
  abolished: undefined,
  website: undefined,
  tours: []
})

const formFields: FormFieldInterface<TournamentSchema>[] = [
  { label: "Name", key: "name", type: "text", required: true, colSpan: "col-span-2" },
  { label: "ID", key: "id", type: "text", subType: "number", required: true },
  {
    label: "Tours",
    key: "tours",
    type: "checkbox",
    items: Object.entries(TourEnum).map(tour => ({ label: tour[1], value: tour[0] })),
    required: true
  },
  { label: "Year Established", key: "established", type: "text", subType: "number" },
  { label: "Year Abolished", key: "abolished", type: "text", subType: "number" },
  { label: "Website URL", key: "website", type: "textarea", colSpan: "col-span-2" }
]

const handleReset = () => {
  state.id = 0
  state.name = ""
  state.established = undefined
  state.abolished = undefined
  state.website = undefined
  state.tours = []
}

const onSubmit = async (event: FormSubmitEvent<TournamentSchema>) => {
  set(uploading, true)
  try {
    await $fetch("/api/tournaments/create", {
      query: event.data
    })
    toast.add({
      title: "Tournament created",
      icon: icons["success"],
      color: "success"
    })
    handleReset()
    set(open, false)
    await navigateTo({ name: "tournament", params: { id: state.id, name: kebabCase(state.name) } })
  } catch (e) {
    toast.add({
      title: "Error creating tournament",
      description: (e as Error).message,
      icon: icons["error"],
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}

const handleError = (event: FormErrorEvent) => {
  toast.add({
    title: "Please ensure all fields are filled out correctly",
    description: event.errors.map(error => error.message).join(", "),
    icon: icons["error"],
    color: "error"
  })
}
</script>

<template>
  <u-modal
    title="Create Tournament"
    v-model:open="open"
  >
    <u-button
      :icon="icons.plus"
      label="Create Tournament"
      :size
      block
    />

    <template #body>
      <u-form
        id="tournament-form"
        :schema="tournamentSchema"
        :state
        @submit="onSubmit"
        @error="handleError"
      >
        <div class="grid grid-cols-2 gap-2">
          <form-field
            v-for="field in formFields"
            :key="field.label"
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
        @click="handleReset"
        label="Reset"
        :icon="icons.reload"
        block
        color="warning"
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons['error']"
        block
      />
    </template>
  </u-modal>
</template>
