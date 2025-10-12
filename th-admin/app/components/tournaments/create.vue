<script setup>
defineProps(["block", "refresh"])
const open = ref(false)
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

defineShortcuts({
  meta_enter: () => set(open, !get(open))
})

const state = reactive({})

const formFields = [
  { label: "Tournament Name", key: "name", type: "text", required: true, colSpan: 2 },
  { label: "Tournament ID", key: "id", type: "number", required: true },
  { label: "Tours", key: "tours", type: "checkbox", items: tours, size: "xs", required: true },
  { label: "Year Established", key: "established", type: "number" },
  { label: "Year Abolished", key: "abolished", type: "number" },
  { label: "Website URL", key: "website", type: "textarea", colSpan: 2 }
]

const onSubmit = async event => {
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
    set(open, false)
  } catch (e) {
    toast.add({
      title: "Error creating tournament",
      description: e.message,
      icon: icons["error"],
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-modal
    title="Create Tournament"
    v-model:open="open"
  >
    <u-button
      :icon="icons.plus"
      :block
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
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons['error']"
        block
      />
    </template>
  </u-modal>
</template>
