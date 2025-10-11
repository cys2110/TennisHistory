<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const {
  ui: { icons }
} = useAppConfig()

const open = ref(false)
const selectedTour = ref<"ATP" | "WTA">("ATP")
const toast = useToast()
const scraping = ref(false)

type Schema = z.output<typeof scrapeEventSchema>

const state = reactive<Partial<Schema>>({
  year: new Date().getFullYear(),
  type: "Singles",
  draw: "Main"
})

const formFields = computed(
  () =>
    [
      { label: "DB ID", key: "tid", type: "text", subType: "number", required: true },
      { label: "Source ID", key: "tid2", type: "text", subType: "number" },
      { label: "Year Slug", key: "year", type: "text", subType: "number", required: true },
      { label: "Year", key: "year2", type: "text", subType: "number" },
      ...(get(selectedTour) === "ATP" ? [{ label: "Draw Size", key: "draw_size", type: "number", required: true }] : []),
      ...(get(selectedTour) === "ATP" ? [{ label: "Match Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true }] : []),
      ...(get(selectedTour) === "ATP" ? [{ label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"], required: true }] : []),
      ...(get(selectedTour) === "ATP" ? [{ label: "Best of", key: "sets", type: "select", items: ["Best3", "Best5"] }] : [])
    ] as FormFieldInterface<Schema>[]
)

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(scraping, true)
  try {
    const response: any = await $fetch(`http://127.0.0.1:5001/${get(selectedTour).toLowerCase()}_draw`, {
      method: "POST",
      timeout: 120_000,
      "Content-Type": "application/json",
      body: JSON.stringify(event.data)
    })
    if (response.ok) {
      toast.add({
        title: "Draw scraped",
        icon: icons.success,
        color: "success"
      })
      set(open, false)
    } else {
      toast.add({
        title: "Error scraping draw",
        icon: icons.error,
        color: "error"
      })
    }
  } catch (e) {
    console.error(e)
    toast.add({
      title: "Error scraping draw",
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(scraping, false)
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
      :icon="scraping ? ICONS.downloading : ICONS.download"
      block
    />

    <template #body>
      <u-radio-group
        v-model="selectedTour"
        :items="['ATP', 'WTA']"
        orientation="horizontal"
      />

      <u-form
        id="draw-form"
        :schema="scrapeEventSchema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <form-field
            v-for="field in formFields"
            :key="field.key"
            :field
            v-model="state[field.key]"
          />
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="draw-form"
        type="submit"
        label="Scrape"
        :icon="scraping ? ICONS.downloading : ICONS.download"
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.close"
      />
    </template>
  </u-modal>
</template>
