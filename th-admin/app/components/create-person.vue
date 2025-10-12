<script setup>
const { type } = defineProps(["type"])
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const toast = useToast()
const updating = ref(false)

defineShortcuts({
  meta_enter: () => set(open, !get(open))
})

const state = reactive({})

const formFields = [
  { label: "First Name", key: "first_name", type: "text", required: true },
  { label: "Last Name", key: "last_name", type: "text", required: true }
]

const onSubmit = async event => {
  set(updating, true)
  try {
    await $fetch("/api/create-person", {
      query: { ...event.data, type }
    })
    toast.add({
      title: `${type} created`,
      icon: icons.success,
      color: "success"
    })
    set(open, false)
  } catch (e) {
    toast.add({
      title: `Error creating ${type}`,
      description: e.message,
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
    :title="`Create ${type}`"
    v-model:open="open"
  >
    <u-button
      block
      icon="line-md:account-add"
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
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.close"
        block
      />
    </template>
  </u-modal>
</template>
