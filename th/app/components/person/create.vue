<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
defineProps<{ block?: boolean }>()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const toast = useToast()
const updating = ref(false)

defineShortcuts({
  meta_shift_p: () => set(open, !get(open))
})

const state = reactive<PersonSchema>({
  type: "Coach",
  first_name: "",
  last_name: ""
})

const formFields: FormFieldInterface<PersonSchema>[] = [
  { label: "Type", key: "type", type: "select", items: ["Coach", "Supervisor", "Umpire"], required: true, colSpan: 2 },
  { label: "First Name", key: "first_name", type: "text", required: true },
  { label: "Last Name", key: "last_name", type: "text", required: true }
]

const handleReset = () => {
  state.first_name = ""
  state.last_name = ""
}

const onSubmit = async (event: FormSubmitEvent<PersonSchema>) => {
  set(updating, true)
  try {
    await $fetch("/api/person/create", {
      query: event.data
    })
    toast.add({
      title: `${state.type} created`,
      icon: icons.success,
      color: "success"
    })
    handleReset()
    set(open, false)
  } catch (e) {
    toast.add({
      title: `Error creating ${state.type}`,
      description: (e as Error).message,
      icon: icons["error"],
      color: "error"
    })
  } finally {
    set(updating, false)
  }
}
</script>

<template>
  <u-modal
    :title="`Create ${state.type}`"
    v-model:open="open"
  >
    <u-button
      icon="line-md:account-add"
      :label="block ? 'Create Person' : undefined"
      :block
    />

    <template #body>
      <u-form
        id="person-form"
        :schema="personSchema"
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
        form="person-form"
        type="submit"
        label="Save"
        :icon="updating ? ICONS.uploading : icons.check"
        block
      />
      <u-button
        label="Reset"
        @click="handleReset"
        block
        color="warning"
        :icon="icons.reload"
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
