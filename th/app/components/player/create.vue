<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"
defineProps<{ size?: "xs" | "sm" | "md" }>()
const {
  ui: { icons }
} = useAppConfig()
const toast = useToast()
const open = ref(false)
const uploading = ref(false)

defineShortcuts({
  meta_enter: () => set(open, !get(open))
})

const schema = z.object({
  id: z.string("Please enter an ID"),
  tour: z.literal(["ATP", "WTA"], "Please select a tour")
})
type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  id: "",
  tour: "ATP"
})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "ID", key: "id", type: "text", required: true },
  { label: "Tour", key: "tour", type: "radio", items: ["ATP", "WTA"], required: true }
]

const handleReset = () => {
  state.id = ""
  state.tour = "ATP"
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  set(uploading, true)
  try {
    await $fetch("/api/players/create", {
      query: event.data
    })
    toast.add({
      title: "Player created",
      icon: icons["success"],
      color: "success"
    })
    handleReset()
    set(open, false)
    await navigateTo({ name: "player", params: { id: state.id, name: "-" } })
  } catch (e) {
    toast.add({
      title: "Error creating player",
      description: (e as Error).message,
      icon: icons["error"],
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}

const onError = (event: FormErrorEvent) => {
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
    title="Create Player"
    v-model:open="open"
  >
    <u-button
      icon="line-md:account-add"
      label="Create Player"
      :size
      block
    />

    <template #body>
      <u-form
        id="player-form"
        :schema
        :state
        @submit="onSubmit"
        @error="onError"
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
        form="player-form"
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
