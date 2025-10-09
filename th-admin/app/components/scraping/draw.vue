<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const open = ref(false)
const toast = useToast()

type Schema = z.output<typeof scrapeEventSchema>

const state = reactive<Partial<Schema>>({
  tid: 0,
  tid2: undefined,
  year: new Date().getFullYear(),
  year2: undefined,
  draw_size: undefined,
  type: "Singles",
  draw: "Main",
  sets: undefined
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    const response: any = await $fetch("http://127.0.0.1:5001/atp_draw", {
      method: "POST",
      timeout: 120_000,
      "Content-Type": "application/json",
      body: JSON.stringify(event.data)
    })
    if (response.ok) {
      toast.add({
        title: "Draw scraped",
        icon: "lucide:circle-check",
        color: "success"
      })
    } else {
      toast.add({
        title: "Error scraping draw",
        icon: "lucide:circle-x",
        color: "error"
      })
    }
  } catch (e) {
    console.error(e)
    toast.add({
      title: "Error scraping draw",
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-modal
    title="Scrape Draws"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Scrape draws"
      size="sm"
      block
    />

    <template #body>
      <u-form
        id="draw-form"
        :schema="scrapeEventSchema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <u-form-field label="DB ID">
            <u-input
              type="number"
              v-model="state.tid"
              name="tid"
              placeholder="Enter DB ID"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Source ID">
            <u-input
              type="number"
              v-model="state.tid2"
              name="tid2"
              placeholder="Enter Source ID"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Year Slug">
            <u-input
              type="number"
              v-model="state.year"
              name="year"
              placeholder="Enter Year Slug"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Year">
            <u-input
              type="number"
              v-model="state.year2"
              name="year2"
              placeholder="Enter Year"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Draw Size">
            <u-input-number
              v-model="state.draw_size"
              name="draw_size"
              orientation="vertical"
              placeholder="Enter Draw Size"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Match Type">
            <u-select
              v-model="state.type"
              :items="['Singles', 'Doubles']"
              placeholder="Select Match Type"
              name="match_type"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Draw">
            <u-select
              v-model="state.draw"
              :items="['Main', 'Qualifying']"
              placeholder="Select Draw"
              name="draw"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Best of">
            <u-select
              v-model="state.sets"
              :items="['Best3', 'Best5']"
              placeholder="Select Best of"
              name="sets"
              class="w-full"
            />
          </u-form-field>
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="draw-form"
        type="submit"
        label="Scrape"
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
      />
    </template>
  </u-modal>
</template>
