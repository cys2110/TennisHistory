<script setup>
import { parseDate } from "@internationalized/date"

definePageMeta({ name: "player" })

useHead({ title: "Edit Player - TH Admin" })

const {
  params: { id }
} = useRoute()
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()

const form = useTemplateRef("form")

const scraping = ref(false)
const submitting = ref(false)

defineShortcuts({
  meta_enter: () => form.value?.submit(),
  meta_shift_s: () => handleScrape()
})

const { data: player, status } = await useFetch("/api/players/get-player", { query: { id } })

const state = reactive({
  ...get(player),
  id,
  country: get(player)?.country
    ? {
        id: get(player)?.country?.id,
        start_date: get(player)?.country?.start_date ? parseDate(get(player)?.country?.start_date) : undefined
      }
    : {
        id: "",
        start_date: undefined
      },
  previous_countries: get(player)?.previous_countries?.map(c => ({
    id: c.id,
    start_date: c.start_date ? parseDate(c.start_date) : undefined,
    end_date: c.end_date ? parseDate(c.end_date) : undefined
  })),
  coaches: get(player)?.coaches?.length
    ? get(player)?.coaches?.map(c => ({
        id: c.id,
        name: c.first_name ? `${c.first_name} ${c.last_name}` : undefined,
        years: c.years || undefined
      }))
    : [],
  former_coaches: get(player)?.former_coaches?.length
    ? get(player)?.former_coaches?.map(c => ({
        id: c.id,
        name: c.first_name ? `${c.first_name} ${c.last_name}` : undefined,
        years: c.years || undefined
      }))
    : [],
  singles_ch_date: get(player)?.singles_ch_date ? parseDate(get(player)?.singles_ch_date) : undefined,
  doubles_ch_date: get(player)?.doubles_ch_date ? parseDate(get(player)?.doubles_ch_date) : undefined,
  dob: get(player)?.dob ? parseDate(get(player)?.dob) : undefined,
  dod: get(player)?.dod ? parseDate(get(player)?.dod) : undefined
})

const formFields = [
  { label: "First Name", key: "first_name", type: "text", required: true },
  { label: "Last Name", key: "last_name", type: "text", required: true },
  { label: "Tour", key: "tour", type: "radio", items: ["ATP", "WTA"], required: true },
  { label: "Turned Pro", key: "turned_pro", type: "text", subType: "number" },
  { label: "Retired", key: "retired", type: "text", subType: "number" },
  { label: "Plays", key: "rh", type: "radio", items: ["Right", "Left"] },
  { label: "Backhand", key: "bh", type: "radio", items: ["One", "Two"] },
  { label: "Date of Birth", key: "dob", type: "date" },
  { label: "Date of Death", key: "dod", type: "date" },
  { label: "Height (cm)", key: "height", type: "number" },
  { label: "Prize Money", key: "pm", type: "currency", required: true },
  { label: "Hall of Fame Induction", key: "hof", type: "text", subType: "number" }
]

const rankFields = [
  {
    label: "Singles",
    children: [
      { label: "current rank", key: "current_singles", type: "number" },
      { label: "career high", key: "ch_singles", type: "number" },
      { label: "career high date", key: "singles_ch_date", type: "date" }
    ]
  },
  {
    label: "Doubles",
    children: [
      { label: "current rank", key: "current_doubles", type: "number" },
      { label: "career high", key: "ch_doubles", type: "number" },
      { label: "career high date", key: "doubles_ch_date", type: "date" }
    ]
  }
]

const linkFields = [
  { label: "Site", key: "site_link", color: "primary" },
  { label: "Wiki", key: "wiki_link", color: "warning" },
  { label: "Official", key: "official_link", color: "success" }
]

const scrapeEnabled = computed(() => {
  const singlesChDate = get(player).singles_ch_date ? new Date(get(player).singles_ch_date) : null
  const doublesChDate = get(player).doubles_ch_date ? new Date(get(player).doubles_ch_date) : null
  const cutoffDate = new Date("2001-01-01")
  if ((singlesChDate && singlesChDate < cutoffDate) || (doublesChDate && doublesChDate < cutoffDate) || get(player).dod) {
    return false
  }
  return true
})

const handleScrape = async () => {
  set(scraping, true)
  try {
    const apiSlug = isNaN(Number(id)) ? "atp_player" : "wta_player"
    const response = await $fetch(`http://127.0.0.1:5001/${apiSlug}/` + id, {
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

const onError = event => console.error(event.errors)

const onSubmit = async e => {
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
      description: e.message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(submitting, false)
  }
}
</script>

<template>
  <client-only>
    <div class="w-full">
      <u-dashboard-panel>
        <template #header>
          <u-dashboard-navbar :title="`Edit Player - ${player?.first_name ? `${player.first_name} ${player.last_name}` : id}`">
            <template #leading>
              <u-dashboard-sidebar-collapse variant="link" />
            </template>
          </u-dashboard-navbar>
          <u-dashboard-toolbar>
            <u-button
              v-if="scrapeEnabled"
              label="Scrape player"
              @click="handleScrape"
              block
              :icon="scraping ? ICONS.downloading : ICONS.download"
            />
            <u-badge
              v-if="player?.updated_at"
              class="w-full py-1.5 justify-center"
              :label="`Updated at: ${get(useDateFormat(player.updated_at, 'DD MMMM YYYY'))}`"
              color="success"
              size="md"
            />
            <u-button
              form="player-form"
              type="submit"
              label="Save"
              block
              :icon="submitting ? ICONS.uploading : icons.check"
            />
          </u-dashboard-toolbar>
        </template>
        <template #body>
          <u-form
            id="player-form"
            ref="form"
            :schema="playerSchema"
            :state
            @submit="onSubmit"
            @error="onError"
          >
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

              <u-form-field label="Country">
                <u-field-group class="w-full">
                  <countries-search
                    v-model="state.country.id"
                    placeholder="country"
                  />
                  <date-picker
                    v-model="state.country.start_date"
                    placeholder="start date"
                  />
                  <u-button
                    color="error"
                    :icon="icons.close"
                    @click="state.country = { id: '', start_date: undefined }"
                  />
                </u-field-group>
              </u-form-field>

              <div class="col-span-2">
                <u-form-field label="Former Representations">
                  <div class="flex flex-col gap-1">
                    <u-field-group
                      v-for="country in state.previous_countries"
                      :key="country.id"
                    >
                      <countries-search
                        v-model="country.id"
                        placeholder="country"
                      />
                      <date-picker
                        v-model="country.start_date"
                        placeholder="start date"
                      />
                      <date-picker
                        v-model="country.end_date"
                        placeholder="end date"
                      />
                      <u-button
                        color="error"
                        :icon="icons.close"
                        @click="state.previous_countries = state.previous_countries.filter(c => c !== country)"
                      />
                    </u-field-group>
                    <u-button
                      label="Add Former Country"
                      icon="solar:globus-line-duotone"
                      block
                      @click="state.previous_countries.push({ id: '', start_date: undefined, end_date: undefined })"
                    />
                  </div>
                </u-form-field>
              </div>

              <div class="col-span-3">
                <u-form-field label="Ranks">
                  <div class="grid grid-cols-2 items-center gap-2">
                    <u-field-group
                      v-for="group in rankFields"
                      :key="group.label"
                    >
                      <u-button
                        disabled
                        :label="group.label"
                        :color="group.label"
                      />
                      <template
                        v-for="child in group.children"
                        :key="child.key"
                      >
                        <input-number
                          v-if="child.type === 'number'"
                          :label="child.label"
                          v-model="state[child.key]"
                        />
                        <date-picker
                          v-else
                          v-model="state[child.key]"
                          :placeholder="child.label"
                        />
                      </template>
                    </u-field-group>
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

              <u-form-field label="Coaches">
                <div class="flex flex-col gap-1">
                  <u-field-group
                    v-for="coach in state.coaches"
                    :key="coach.id"
                  >
                    <coaches-search
                      v-model="coach.id"
                      placeholder="coach"
                    />
                    <u-input
                      v-model="coach.name"
                      placeholder="name"
                      disabled
                    />
                    <u-input
                      v-model="coach.years"
                      placeholder="Years coached"
                    >
                      <template
                        v-if="coach.years"
                        #trailing
                      >
                        <u-button
                          color="neutral"
                          variant="link"
                          size="xs"
                          :icon="icons.close"
                          aria-label="Clear input"
                          @click="coach.years = undefined"
                        />
                      </template>
                    </u-input>
                    <u-button
                      color="error"
                      :icon="icons.close"
                      @click="state.coaches = state.coaches.filter(c => c !== coach)"
                    />
                  </u-field-group>
                  <u-button
                    label="Add Coach"
                    icon="line-md:account-add"
                    block
                    @click="state.coaches.push({ id: '', years: undefined })"
                  />
                </div>
              </u-form-field>

              <div class="col-span-2">
                <u-form-field label="Former Coaches">
                  <div class="flex flex-col gap-1">
                    <u-field-group
                      v-if="state.former_coaches?.length"
                      v-for="coach in state.former_coaches"
                      :key="coach.id"
                    >
                      <coaches-search
                        v-model="coach.id"
                        placeholder="coach"
                      />
                      <u-input
                        v-model="coach.name"
                        placeholder="name"
                        disabled
                      />
                      <u-input
                        v-model="coach.years"
                        placeholder="Years coached"
                      >
                        <template
                          v-if="coach.years"
                          #trailing
                        >
                          <u-button
                            color="neutral"
                            variant="link"
                            size="xs"
                            :icon="icons.close"
                            aria-label="Clear input"
                            @click="coach.years = undefined"
                          />
                        </template>
                      </u-input>
                      <u-button
                        color="error"
                        :icon="icons.close"
                        @click="state.former_coaches = state.former_coaches.filter(c => c !== coach)"
                      />
                    </u-field-group>
                    <u-button
                      label="Add Former Coach"
                      icon="line-md:account-add"
                      block
                      @click="state.former_coaches.push({ id: '', years: undefined })"
                    />
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
  </client-only>
</template>
