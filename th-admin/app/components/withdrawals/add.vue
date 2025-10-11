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
const uploading = ref(false)

type Schema = z.output<typeof withdrawalSchema>

const state = reactive<Partial<Schema>>({
  eid: id as string
})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Player", key: "id", type: "players" },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"] },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"] },
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
  <u-form
    :state
    :schema="withdrawalSchema"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-10 border-b border-muted pb-2 gap-2">
      <form-field
        v-for="field in formFields"
        :key="field.label"
        :field
        v-model="state[field.key]"
      />

      <div class="flex items-center">
        <u-button
          type="submit"
          label="Save"
          block
          :icon="uploading ? ICONS.uploading : icons.check"
        />
      </div>
    </div>
  </u-form>
</template>
