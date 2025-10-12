<script setup>
const { refresh } = defineProps(["refresh"])

const {
  params: { id }
} = useRoute("rounds")
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

const formFields = [
  { label: "Player", key: "id", type: "players", required: true },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true },
  { label: "Seed", key: "seed", type: "number" },
  { label: "Status", key: "status", type: "select", items: ["AL", "WC", "Q", "SE", "PR", "LL"] },
  { label: "Qualifying Seed", key: "q_seed", type: "number" },
  { label: "Qualifying Status", key: "q_status", type: "select", items: ["AL", "WC", "Q", "SE", "PR", "LL"] }
]

const onSubmit = async event => {
  set(uploading, true)
  try {
    await $fetch("/api/entries/add", {
      query: event.data
    })
    toast.add({
      title: "Entry created",
      icon: icons.success,
      color: "success"
    })
    set(open, false)
    refresh()
  } catch (e) {
    toast.add({
      title: "Error creating entry",
      description: e.message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-modal
    title="Add Entry"
    v-model:open="open"
  >
    <u-button
      label="Add Entry"
      :icon="icons.plus"
      block
    />

    <template #body>
      <u-form
        id="entry-form"
        :schema="entrySchema"
        :state
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
        form="entry-form"
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
