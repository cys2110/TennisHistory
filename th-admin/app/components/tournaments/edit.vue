<script setup>
const { tournament } = defineProps(["tournament"])
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const uploading = ref(false)

const state = reactive({
  id: tournament.id,
  name: tournament.name,
  established: tournament.established ?? undefined,
  abolished: tournament.abolished ?? undefined,
  website: tournament.website,
  tours: tournament.tours.filter(tour => tour !== "Update")
})

const formFields = [
  { label: "Name", key: "name", type: "text", required: true, colSpan: 2 },
  { label: "Tours", key: "tours", type: "checkbox", items: tours, required: true, colSpan: 2 },
  { label: "Established", key: "established", type: "text", subType: "number" },
  { label: "Abolished", key: "abolished", type: "text", subType: "number" },
  { label: "Website", key: "website", type: "textarea", colSpan: 2 }
]

const onSubmit = async event => {
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
      description: e.message,
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
  >
    <u-button
      :label="tournament.name ?? tournament.id.toString()"
      :id="`tournament-${tournament.id}`"
      block
      :color="tournament.tours.includes('Update') ? 'warning' : 'primary'"
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
