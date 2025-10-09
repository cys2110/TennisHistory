<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const open = ref(false)
const toast = useToast()
const links = ref<string[]>([])

type Schema = z.output<typeof scrapeEventSchema>

const state = reactive<Partial<Schema>>({
  tid: 0,
  tid2: undefined,
  year: new Date().getFullYear(),
  year2: undefined,
  type: "Singles"
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    const response: any = await $fetch("http://127.0.0.1:5001/atp_results", {
      method: "POST",
      timeout: 120_000,
      "Content-Type": "application/json",
      body: JSON.stringify(event.data)
    })
    if (response.ok) {
      toast.add({
        title: "Results scraped",
        icon: "lucide:circle-check",
        color: "success"
      })
      links.value = response.links
    } else {
      toast.add({
        title: "Error scraping results",
        icon: "lucide:circle-x",
        color: "error"
      })
    }
  } catch (e) {
    console.error(e)
    toast.add({
      title: "Error scraping results",
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-modal
    title="Scrape Results"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Scrape results"
      size="sm"
    />

    <template #body>
      <u-form
        id="results-form"
        :schema="scrapeEventSchema"
        :state
        @submit="onSubmit"
      >
        <div v-if="links.length">
          {{ links }}
        </div>
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

          <u-form-field label="Match Type">
            <u-select
              v-model="state.type"
              :items="['Singles', 'Doubles']"
              placeholder="Select Match Type"
              name="match_type"
              class="w-full"
            />
          </u-form-field>
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="results-form"
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
