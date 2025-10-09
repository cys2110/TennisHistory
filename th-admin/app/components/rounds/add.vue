<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const {
  params: { id }
} = useRoute("rounds")
const toast = useToast()

type Schema = z.output<typeof roundSchema>

const state = reactive<Partial<Schema>>({
  id: id as string,
  tour: "",
  draw: "",
  type: "",
  round: "",
  number: 0,
  points: undefined,
  pm: undefined,
  eid: id as string
})

const params = computed(() => ({
  id,
  tour: state.tour
}))

const { data: currency, refresh } = await useFetch("/api/get-currency", {
  query: params,
  default: () => "USD",
  immediate: false
})

watch(
  () => state.tour,
  () => {
    if (state.tour) {
      refresh()
    }
  }
)

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/rounds/add", {
      query: event.data
    })
    toast.add({
      title: "Round created",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error creating round",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    :schema="roundSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-9 border-t border-muted pt-1.5 gap-1">
      <u-form-field
        name="id"
        label="ID"
      >
        <u-input
          v-model="state.id"
          placeholder="Enter round ID"
          class="w-full"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Round">
        <u-select
          v-model="state.round"
          :items="rounds"
          placeholder="Select round"
          class="w-full"
          size="sm"
        />
      </u-form-field>
      <u-form-field label="Tour">
        <u-select
          v-model="state.tour"
          :items="['ATP', 'WTA', 'Men', 'Women']"
          placeholder="Select tour"
          class="w-full"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Type">
        <u-select
          v-model="state.type"
          :items="['Singles', 'Doubles']"
          placeholder="Select type"
          class="w-full"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Draw">
        <u-select
          v-model="state.draw"
          :items="['Main', 'Qualifying']"
          placeholder="Select draw"
          class="w-full"
          size="sm"
        />
      </u-form-field>
      <u-form-field label="Number">
        <u-input-number
          v-model="state.number"
          orientation="vertical"
          placeholder="Enter round number"
          class="w-full"
          size="sm"
        />
      </u-form-field>
      <u-form-field label="Points">
        <u-input-number
          v-model="state.points"
          orientation="vertical"
          placeholder="Enter points"
          class="w-full"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Prize Money">
        <u-input-number
          v-model="state.pm"
          orientation="vertical"
          placeholder="Enter prize money"
          class="w-full"
          size="sm"
          :format-options="{
            style: 'currency',
            currency: currency || 'USD'
          }"
        />
      </u-form-field>
      <div class="flex items-end">
        <u-button
          type="submit"
          label="Save"
          size="sm"
          block
          icon="lucide:square-check-big"
        />
      </div>
    </div>
  </u-form>
</template>
