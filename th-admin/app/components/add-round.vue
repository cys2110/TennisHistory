<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { query } = useRoute()
const toast = useToast()

type Schema = z.output<typeof roundSchema>

const state = reactive<Partial<Schema>>({
  id: "",
  tour: "",
  draw: "",
  type: "",
  round: "",
  number: 0,
  points: undefined,
  pm: undefined,
  eid: query.id as string
})

const params = computed(() => ({
  id: query.id,
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
    await $fetch("/api/add-round", {
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
          placeholder="ID"
          class="w-full"
        />
      </u-form-field>

      <u-form-field label="Round">
        <u-select
          v-model="state.round"
          :items="rounds"
          placeholder="Select round"
          class="w-full"
        />
      </u-form-field>
      <u-form-field
        name="tour"
        label="Tour"
      >
        <u-select
          v-model="state.tour"
          :items="['ATP', 'WTA', 'Men', 'Women']"
          placeholder="Select tour"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="type"
        label="Type"
      >
        <u-select
          v-model="state.type"
          :items="['Singles', 'Doubles']"
          placeholder="Select type"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="draw"
        label="Draw"
      >
        <u-select
          v-model="state.draw"
          :items="['Main', 'Qualifying']"
          placeholder="Select draw"
          class="w-full"
        />
      </u-form-field>
      <u-form-field
        name="number"
        label="Number"
      >
        <u-input-number
          v-model="state.number"
          orientation="vertical"
          placeholder="Number"
          class="w-full"
        />
      </u-form-field>
      <u-form-field
        name="points"
        label="Points"
      >
        <u-input-number
          v-model="state.points"
          orientation="vertical"
          placeholder="Points"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="pm"
        label="Prize Money"
      >
        <u-input-number
          v-model="state.pm"
          orientation="vertical"
          placeholder="Prize Money"
          class="w-full"
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
        />
      </div>
    </div>
  </u-form>
</template>
