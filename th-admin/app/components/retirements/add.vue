<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { type, refresh } = defineProps<{ type: "Retirement" | "Walkover" | "Default"; refresh: () => void }>()
const {
  params: { id }
} = useRoute("retirements")
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

const { data: entries, status } = await useFetch("/api/entries/get", {
  query: { id },
  default: () => [],
  transform: data =>
    get(useArrayUnique(data, (a, b) => a.id === b.id)).map(entry => ({
      id: entry.fid,
      label: entry.first_name ? `${entry.first_name} ${entry.last_name}` : entry.id
    }))
})

type Schema = z.output<typeof retirementSchema>

const state = reactive<Partial<Schema>>({ eid: id as string })

const formFields = computed<FormFieldInterface<Schema>[]>(() => [
  { label: "Player", key: "id", type: "selectMenu", items: get(entries.value), loading: get(status) === "pending", required: true },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"] },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"] },
  { label: "Reason", key: "reason", type: "text" },
  { label: "Team Reason", key: "team_reason", type: "text" }
])

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
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
    refresh()
  } catch (e) {
    toast.add({
      title: `Error creating ${type}`,
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
    :schema="retirementSchema"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-6 border-b border-muted pb-2 gap-2">
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
