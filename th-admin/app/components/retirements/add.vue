<script setup>
const { type, refresh } = defineProps(["type", "refresh"])
const {
  params: { id }
} = useRoute("retirements")
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const uploading = ref(false)

defineShortcuts({
  meta_enter: () => set(open, !get(open))
})

const state = reactive({ eid: id })

const formFields = computed(() => [
  { label: "Player", key: "id", type: "entries", colSpan: 2, required: true },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"], required: true },
  { label: "Reason", key: "reason", type: "text" },
  { label: "Team Reason", key: "team_reason", type: "text" }
])

const onSubmit = async event => {
  set(uploading, true)
  try {
    const apiRoute = type === "Retirement" ? "/api/retirements/add" : type === "Walkover" ? "/api/walkovers/add" : "/api/defaults/add"
    await $fetch(apiRoute, {
      query: event.data
    })
    toast.add({
      title: `${type} created`,
      icon: icons.success,
      color: "success"
    })
    set(open, false)
    refresh()
  } catch (e) {
    toast.add({
      title: `Error creating ${type}`,
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
    :title="`Add ${type}`"
    v-model:open="open"
  >
    <u-button
      :label="`Add ${type}`"
      :icon="icons.plus"
      block
    />

    <template #body>
      <u-form
        id="retirement-form"
        :state
        :schema="retirementSchema"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <form-field
            v-for="field in formFields"
            :key="field.label"
            :field
            v-model="state[field.key]"
          />
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="retirement-form"
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
