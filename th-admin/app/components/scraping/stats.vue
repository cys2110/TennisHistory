<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { query } = useRoute()
const open = ref(false)
const toast = useToast()

const schema = z.object({
  eid: z.string(),
  type: z.enum(["Singles", "Doubles"]),
  links: z.array(z.string())
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  eid: query.id as string,
  type: "Singles",
  links: []
})

const cleanLink = (link: string) => link.replace(/^[\s"'“”‘’\[\]]+|[\s"'“”‘’\[\]]+$/g, "")

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    const response: any = await $fetch("http://127.0.0.1:5001/atp_stats", {
      method: "POST",
      timeout: 120_000,
      "Content-Type": "application/json",
      body: JSON.stringify(event.data)
    })
    if (response.ok) {
      toast.add({
        title: "Matches scraped",
        icon: "lucide:circle-check",
        color: "success"
      })
    } else {
      toast.add({
        title: "Error scraping matches",
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
    title="Scrape Matches"
    v-model:open="open"
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Scrape matches"
      size="sm"
      block
    />

    <template #body>
      <u-form
        id="matches-form"
        :schema
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <u-form-field label="Event ID">
            <u-input
              v-model="state.eid"
              name="eid"
              placeholder="Enter Event ID"
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

          <div class="col-span-2">
            <u-form-field label="Match Links">
              <u-input-tags
                v-model="state.links"
                name="links"
                placeholder="Enter match links"
                class="w-full"
                add-on-paste
                :delimiter="', '"
                :convert-value="cleanLink"
              />
            </u-form-field>
          </div>
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="matches-form"
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
