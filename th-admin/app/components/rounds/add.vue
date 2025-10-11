<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { refresh } = defineProps<{ refresh: () => void }>()

const {
  params: { id }
} = useRoute("rounds")
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

type Schema = z.output<typeof roundSchema>

const state = reactive<Partial<Schema>>({
  id: id as string,
  eid: id as string
})

const params = computed(() => ({
  id,
  tour: state.tour
}))

const { data: currency, refresh: currencyRefresh } = await useFetch("/api/get-currency", {
  query: params,
  default: () => "USD",
  immediate: false
})

watch(
  () => state.tour,
  () => {
    if (state.tour) {
      currencyRefresh()
    }
  }
)

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Round ID", key: "id", type: "text" },
  { label: "Round", key: "round", type: "select", items: rounds },
  { label: "Tour", key: "tour", type: "select", items: tours },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"] },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"] },
  { label: "Number", key: "number", type: "number" },
  { label: "Points", key: "points", type: "number" },
  { label: "Prize Money", key: "pm", type: "currency" }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(uploading, true)
  try {
    await $fetch("/api/rounds/add", {
      query: event.data
    })
    toast.add({
      title: "Round created",
      icon: icons.success,
      color: "success"
    })
    refresh()
  } catch (e) {
    toast.add({
      title: "Error creating round",
      description: (e as Error).message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-form
    :schema="roundSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-9 border-b border-muted pb-2 gap-1">
      <form-field
        v-for="field in formFields"
        :key="field.label"
        :field
        v-model="state[field.key]"
        :currency
      />

      <div class="flex items-end">
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
