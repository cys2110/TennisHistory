<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { refresh } = defineProps<{ refresh: () => void }>()

const {
  params: { id }
} = useRoute("lda")
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const uploading = ref(false)

type Schema = z.output<typeof ldaSchema>

const state = reactive<Partial<Schema>>({ eid: id as string })

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Player", key: "id", type: "entries", required: true },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"], required: true },
  { label: "Rank", key: "rank", type: "number" }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
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
