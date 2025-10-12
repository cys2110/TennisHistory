<script setup>
const { person, type } = defineProps(["person", "type"])
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const updating = ref(false)

const state = reactive({
  id: person.id,
  first_name: person.first_name,
  last_name: person.last_name
})

const formFields = [
  { label: "ID", key: "id", type: "text", required: true },
  { label: "First Name", key: "first_name", type: "text", required: true },
  { label: "Last Name", key: "last_name", type: "text", required: true }
]

const onSubmit = async event => {
  set(updating, true)
  try {
    await $fetch("/api/update-person", {
      query: { ...event.data, type }
    })
    toast.add({
      title: `${type} updated`,
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: `Error updating ${type}`,
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
  <u-form
    :schema="personSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-4 border-b border-muted pb-2 gap-2">
      <form-field
        v-for="field in formFields"
        :key="field.key"
        :field="field"
        v-model="state[field.key]"
      />

      <div class="flex items-center">
        <u-button
          type="submit"
          label="Save"
          block
          :icon="updating ? ICONS.uploading : icons.check"
        />
      </div>
    </div>
  </u-form>
</template>
