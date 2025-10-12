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
const open = ref(false)
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
  { label: "Round ID", key: "id", type: "text", required: true },
  { label: "Round", key: "round", type: "select", items: rounds, required: true },
  { label: "Tour", key: "tour", type: "select", items: tours, required: true },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"], required: true },
  { label: "Number", key: "number", type: "number", required: true },
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
    set(open, false)
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
  <u-modal
    title="Add Round"
    v-model:open="open"
  >
    <u-button
      label="Add Round"
      :icon="icons.plus"
      block
    />

    <template #body>
      <u-form
        id="round-form"
        :schema="roundSchema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <form-field
            v-for="field in formFields"
            :key="field.label"
            :field
            v-model="state[field.key]"
            :currency
          />
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="round-form"
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
