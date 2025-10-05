<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { query } = useRoute()
const toast = useToast()

const { data: currency, status } = await useFetch("/api/get-currency", { query: { id: query.id }, default: () => "USD" })

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
    <div class="flex items-center justify-evenly border-t border-muted pt-1.5">
      <u-form-field
        name="id"
        label="ID"
      >
        <u-input v-model="state.id" />
      </u-form-field>

      <u-form-field label="Round">
        <u-select
          v-model="state.round"
          :items="rounds"
          placeholder="Select round"
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
        />
      </u-form-field>
      <u-form-field
        name="number"
        label="Number"
      >
        <u-input-number
          v-model="state.number"
          size="sm"
          orientation="vertical"
          placeholder="Number"
        />
      </u-form-field>
      <u-form-field
        name="points"
        label="Points"
      >
        <u-input-number
          v-model="state.points"
          size="sm"
          orientation="vertical"
          placeholder="Points"
        />
      </u-form-field>

      <u-form-field
        name="pm"
        label="Prize Money"
      >
        <u-input-number
          v-model="state.pm"
          size="sm"
          orientation="vertical"
          placeholder="Prize Money"
          :format-options="{
            style: 'currency',
            currency: currency || 'USD'
          }"
        />
      </u-form-field>
      <div class="flex items-end justify-center">
        <u-button
          type="submit"
          label="Save"
          size="sm"
        />
      </div>
    </div>
  </u-form>
</template>
