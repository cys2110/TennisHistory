<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { refresh } = defineProps<{ refresh: () => void }>()
const {
  params: { id }
} = useRoute("withdrawals")
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const uploading = ref(false)

type Schema = z.output<typeof withdrawalSchema>

const state = reactive<Partial<Schema>>({
  id: "",
  eid: id as string
})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Player", key: "id", type: "players", colSpan: 2, required: true },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"], required: true },
  { label: "Reason", key: "reason", type: "text" },
  { label: "Team Reason", key: "team_reason", type: "text" },
  { label: "Team Mate", key: "team_mate", type: "players" },
  { label: "Seed", key: "seed", type: "number" },
  { label: "Status", key: "status", type: "select", items: ["AL", "WC", "Q", "SE", "PR", "LL"] },
  { label: "Rank", key: "rank", type: "number" }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(uploading, true)
  try {
    await $fetch("/api/withdrawals/add", {
      query: event.data
    })
    toast.add({
      title: "Withdrawal created",
      icon: icons.success,
      color: "success"
    })
    set(open, false)
    refresh()
  } catch (e) {
    toast.add({
      title: "Error creating withdrawal",
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
    title="Add Withdrawal"
    v-model:open="open"
  >
    <u-button
      label="Add Withdrawal"
      block
      :icon="icons.plus"
    />

    <template #body>
      <u-form
        :state
        :schema="withdrawalSchema"
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
