<script setup>
const { refresh } = defineProps(["refresh"])

const {
  params: { id }
} = useRoute("lda")
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
  { label: "Player", key: "id", type: "entries", required: true },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"], required: true },
  { label: "Rank", key: "rank", type: "number" }
]

const onSubmit = async event => {
  set(uploading, true)
  try {
    await $fetch("/api/lda/add", {
      query: event.data
    })
    toast.add({
      title: "LDA created",
      icon: icons.success,
      color: "success"
    })
    set(open, false)
    refresh()
  } catch (e) {
    toast.add({
      title: "Error creating LDA",
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
    title="Add LDA"
    v-model:open="open"
  >
    <u-button
      label="Add LDA"
      :icon="icons.plus"
      block
    />

    <template #body>
      <u-form
        id="lda-form"
        :state
        :schema="ldaSchema"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <form-field
            v-for="field in formFields"
            :key="field.key?.toString()"
            :field="field"
            v-model="state[field.key]"
          />
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="lda-form"
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
