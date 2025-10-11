<script setup lang="ts">
definePageMeta({ name: "player" })
import type { FormSubmitEvent } from "@nuxt/ui"
import { parseDate } from "@internationalized/date"
import * as z from "zod"

useHead({ title: "Edit Player - TH Admin" })

const {
  params: { id }
} = useRoute("player")
const toast = useToast()
const {
  ui: { icons, colors }
} = useAppConfig()

const scraping = ref(false)
const submitting = ref(false)

const { data: player, status } = await useFetch<any>("/api/players/get-player", {
  query: { id }
})

type Schema = z.output<typeof playerSchema>

const state = reactive<Partial<Schema>>({
  id: id as string,
  first_name: get(player)?.first_name,
  last_name: get(player)?.last_name,
  tours: get(player)?.tours,
  country: get(player)?.country?.id,
  previous_countries: get(player)?.previous_countries?.map((c: any) => c.id),
  turned_pro: get(player)?.turned_pro,
  retired: get(player)?.retired,
  coaches: get(player)?.coaches?.map((c: any) => c.id),
  former_coaches: get(player)?.former_coaches?.map((c: any) => c.id),
  atp_link: get(player)?.atp_link,
  wta_link: get(player)?.wta_link,
  wiki_link: get(player)?.wiki_link,
  official_link: get(player)?.official_link,
  bh: get(player)?.bh,
  rh: get(player)?.rh,
  current_singles: get(player)?.current_singles,
  current_doubles: get(player)?.current_doubles,
  ch_singles: get(player)?.ch_singles,
  ch_doubles: get(player)?.ch_doubles,
  singles_ch_date: get(player)?.singles_ch_date ? parseDate(get(player)?.singles_ch_date) : undefined,
  doubles_ch_date: get(player)?.doubles_ch_date ? parseDate(get(player)?.doubles_ch_date) : undefined,
  dob: get(player)?.dob ? parseDate(get(player)?.dob) : undefined,
  dod: get(player)?.dod ? parseDate(get(player)?.dod) : undefined,
  height: get(player)?.height,
  pm: get(player)?.pm,
  hof: get(player)?.hof
})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "First Name", key: "first_name", type: "text", required: true },
  { label: "Last Name", key: "last_name", type: "text", required: true },
  { label: "Tours", key: "tours", type: "tags", required: true },
  { label: "Country Code", key: "country", type: "text", required: true },
  { label: "Previous Countries", key: "previous_countries", type: "tags" },
  { label: "Turned Pro", key: "turned_pro", type: "text", subType: "number" },
  { label: "Retired", key: "retired", type: "text", subType: "number" },
  {
    label: "Handedness",
    key: "rh",
    type: "select",
    items: [
      { value: true, label: "Right" },
      { value: false, label: "Left" }
    ]
  },
  { label: "Backhand", key: "bh", type: "select", items: ["One", "Two"] },
  { label: "Date of Birth", key: "dob", type: "date" },
  { label: "Date of Death", key: "dod", type: "date" },
  { label: "Height (cm)", key: "height", type: "number" },
  { label: "Prize Money", key: "pm", type: "currency", required: true },
  { label: "Coach", key: "coaches", type: "coaches" },
  { label: "Former Coaches", key: "former_coaches", type: "coaches" },
  { label: "Hall of Fame Induction", key: "hof", type: "text", subType: "number" }
]

const linkFields: { label: string; key: keyof Schema; color: keyof typeof colors }[] = [
  { label: "ATP", key: "atp_link", color: "ATP" },
  { label: "WTA", key: "wta_link", color: "WTA" },
  { label: "Wiki", key: "wiki_link", color: "primary" },
  { label: "Official", key: "official_link", color: "success" }
]

const handleScrape = async () => {
  set(scraping, true)
  try {
    const apiSlug = isNaN(Number(id)) ? "atp_player" : "wta_player"
    const response: any = await $fetch(`http://127.0.0.1:5001/${apiSlug}/` + id, {
      method: "GET",
      timeout: 120_000
    })
    if (response.ok) {
      toast.add({
        title: "Player updated",
        icon: icons.success,
        color: "success"
      })
    } else {
      toast.add({
        title: "Error updating player",
        icon: icons.error,
        color: "error"
      })
    }
  } catch (e) {
    console.error(e)
    toast.add({
      title: "Error updating player",
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(scraping, false)
    reloadNuxtApp()
  }
}

const onSubmit = async (e: FormSubmitEvent<typeof state>) => {
  set(submitting, true)
  try {
    await $fetch("/api/players/update", {
      query: e.data
    })
    toast.add({
      title: "Player updated",
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating player",
      description: (e as Error).message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(submitting, false)
  }
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Edit Player - ${player.first_name ? `${player.first_name} ${player.last_name}` : id}`" />
        <u-dashboard-toolbar>
          <u-button
            label="Scrape player"
            @click="handleScrape"
            block
            :icon="scraping ? ICONS.downloading : ICONS.download"
          />
          <u-badge
            v-if="player?.updated_at"
            class="w-full py-1.5"
            :label="`Updated at: ${get(useDateFormat(player.updated_at, 'DD MMMM YYYY'))}`"
            color="success"
            size="md"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-form
          :schema="playerSchema"
          :state
          @submit="onSubmit"
        >
          <u-button
            type="submit"
            label="Save"
            size="sm"
            block
            class="mb-3"
            :icon="submitting ? ICONS.uploading : icons.check"
          />
          <div
            v-if="status === 'success'"
            class="grid grid-cols-3 gap-2"
          >
            <form-field
              v-for="field in formFields"
              :key="field.label"
              :field="field"
              v-model="state[field.key]"
            />

            <div class="col-span-2">
              <u-form-field label="Ranks">
                <div class="grid grid-cols-4 gap-2">
                  <div class="flex justify-center items-center">
                    <u-badge
                      label="Singles"
                      color="Singles"
                      size="md"
                      class="w-full justify-center"
                    />
                  </div>
                  <input-number
                    label="current singles rank"
                    v-model="state.current_singles"
                  />
                  <input-number
                    label="singles career high rank"
                    v-model="state.ch_singles"
                  />
                  <date-picker
                    v-model="state.singles_ch_date"
                    placeholder="singles career high date"
                  />
                  <div class="flex justify-center items-center">
                    <u-badge
                      label="Doubles"
                      color="Doubles"
                      size="md"
                      class="w-full justify-center"
                    />
                  </div>
                  <input-number
                    label="doubles current rank"
                    v-model="state.current_doubles"
                  />
                  <input-number
                    label="doubles career high rank"
                    v-model="state.ch_doubles"
                  />
                  <date-picker
                    v-model="state.doubles_ch_date"
                    placeholder="doubles career high date"
                  />
                </div>
              </u-form-field>
            </div>

            <div class="col-span-3">
              <u-form-field label="Links">
                <div class="grid grid-cols-4 gap-2 *:flex *:flex-col *:gap-1">
                  <div
                    v-for="field in linkFields"
                    :key="field.label"
                  >
                    <label :for="field.key">
                      <u-badge
                        :label="field.label"
                        :color="field.color"
                        size="md"
                        class="w-full justify-center"
                      />
                    </label>
                    <u-textarea
                      :id="field.key"
                      v-model="state[field.key]"
                      :placeholder="`Enter ${field.label.toLowerCase()} link`"
                    />
                  </div>
                </div>
              </u-form-field>
            </div>
          </div>

          <loading v-else-if="status === 'pending'" />

          <reload
            v-else
            message="player"
          />
        </u-form>
      </template>
    </u-dashboard-panel>
  </div>
</template>
