<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const {
  params: { id }
} = useRoute("event")
const {
  ui: { icons }
} = useAppConfig()

const open = ref(false)
const selectedTour = ref<"ATP" | "WTA">("ATP")
const toast = useToast()
const scraping = ref(false)

const schema = z.object({
  eid: z.string(),
  year: z.number().optional(),
  wid: z.number().optional(),
  type: z.enum(["Singles", "Doubles"]),
  draw: z.enum(["Main", "Qualifying"]).optional(),
  links: z.array(z.string()).optional(),
  draw_range: z.array(z.string()),
  skip: z.array(z.string()).optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  eid: id as string,
  type: "Singles",
  links: [],
  draw_range: [],
  skip: []
})

const formFields = computed(
  () =>
    [
      { label: "Event ID", key: "eid", type: "text", subType: "number", required: true },
      ...(get(selectedTour) === "WTA" ? [{ label: "WTA ID", key: "wid", type: "text", subType: "number", required: true }] : []),
      ...(get(selectedTour) === "WTA" ? [{ label: "Year", key: "year", type: "text", subType: "number", required: true }] : []),
      { label: "Match Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true },
      ...(get(selectedTour) === "WTA" ? [{ label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"], required: true }] : []),
      ...(get(selectedTour) === "WTA" ? [{ label: "Draw Range", key: "draw_range", type: "tags", max: 2, required: true }] : []),
      ...(get(selectedTour) === "WTA" ? [{ label: "Matches to Skip", key: "skip", type: "tags" }] : []),
      ...(get(selectedTour) === "ATP" ? [{ label: "Match Links", key: "links", type: "tags", required: true, format: cleanLink }] : [])
    ] as FormFieldInterface<Schema>[]
)

const cleanLink = (link: string) => link.replace(/^[\s"'“”‘’\[\]]+|[\s"'“”‘’\[\]]+$/g, "")

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(scraping, true)
  try {
    const response: any = await $fetch(`http://127.0.0.1:5001/${get(selectedTour).toLowerCase()}_stats`, {
      method: "POST",
      timeout: 120_000,
      "Content-Type": "application/json",
      body: JSON.stringify(event.data)
    })
    if (response.ok) {
      toast.add({
        title: "Matches scraped",
        icon: icons.success,
        color: "success"
      })
    } else {
      toast.add({
        title: "Error scraping matches",
        icon: icons.error,
        color: "error"
      })
    }
  } catch (e) {
    console.error(e)
    toast.add({
      title: "Error scraping results",
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
    title="Scrape Matches"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Scrape matches"
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
        id="matches-form"
        :schema
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <form-field
            v-for="field in formFields"
            :key="field.key"
            :field="field"
            v-model="state[field.key]"
          />
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="matches-form"
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
