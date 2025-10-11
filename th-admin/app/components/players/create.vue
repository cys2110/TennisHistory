<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

defineProps<{ block?: boolean }>()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const toast = useToast()
const uploading = ref(false)

const schema = z.object({
  id: z.string(),
  tour: z.string()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
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
    set(open, false)
    await navigateTo({
      name: "player",
      query: { id: state.id }
    })
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
</script>

<template>
  <u-modal
    title="Create Player"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Create Player"
      :block
      icon="line-md:account-add"
    />

    <template #body>
      <u-form
        id="player-form"
        :schema="schema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-5">
          <form-field
            :field="{ label: 'ID', key: 'id', type: 'text' }"
            v-model="state.id"
          />

          <u-form-field
            name="tour"
            label="Tour"
          >
            <u-radio-group
              v-model="state.tour"
              :items="['ATP', 'WTA']"
              orientation="horizontal"
            />
          </u-form-field>
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="player-form"
        type="submit"
        label="Save"
        :icon="uploading ? ICONS.uploading : icons.upload"
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.error"
      />
    </template>
  </u-modal>
</template>
